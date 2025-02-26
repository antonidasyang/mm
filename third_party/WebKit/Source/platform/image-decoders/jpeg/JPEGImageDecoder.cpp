/*
 * Copyright (C) 2006 Apple Computer, Inc.
 *
 * Portions are Copyright (C) 2001-6 mozilla.org
 *
 * Other contributors:
 *   Stuart Parmenter <stuart@mozilla.com>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 *
 * Alternatively, the contents of this file may be used under the terms
 * of either the Mozilla Public License Version 1.1, found at
 * http://www.mozilla.org/MPL/ (the "MPL") or the GNU General Public
 * License Version 2.0, found at http://www.fsf.org/copyleft/gpl.html
 * (the "GPL"), in which case the provisions of the MPL or the GPL are
 * applicable instead of those above.  If you wish to allow use of your
 * version of this file only under the terms of one of those two
 * licenses (the MPL or the GPL) and not to allow others to use your
 * version of this file under the LGPL, indicate your decision by
 * deletingthe provisions above and replace them with the notice and
 * other provisions required by the MPL or the GPL, as the case may be.
 * If you do not delete the provisions above, a recipient may use your
 * version of this file under any of the LGPL, the MPL or the GPL.
 */

#include "platform/image-decoders/jpeg/JPEGImageDecoder.h"

#include "platform/PlatformInstrumentation.h"
#include "wtf/PtrUtil.h"
#include <memory>

extern "C" {
#if 0//defined(WIN32)
#include "third_party/libjpeg/iccjpeg.h"
#include "third_party/libjpeg/jpeglib.h"
#else
#include "third_party/libjpeg_turbo/iccjpeg.h"
#include "third_party/libjpeg_turbo/jpeglib.h"
#endif
#include <setjmp.h>
#include <stdio.h> // jpeglib.h needs stdio FILE.
}

#if CPU(BIG_ENDIAN) || CPU(MIDDLE_ENDIAN)
#error Blink assumes a little-endian target.
#endif

#if defined(JCS_ALPHA_EXTENSIONS)
#define TURBO_JPEG_RGB_SWIZZLE
#if SK_B32_SHIFT // Output little-endian RGBA pixels (Android).
inline J_COLOR_SPACE rgbOutputColorSpace()
{
    return JCS_EXT_RGBA;
}
#else // Output little-endian BGRA pixels.
inline J_COLOR_SPACE rgbOutputColorSpace()
{
    return JCS_EXT_BGRA;
}
#endif
inline bool turboSwizzled(J_COLOR_SPACE colorSpace)
{
    return colorSpace == JCS_EXT_RGBA || colorSpace == JCS_EXT_BGRA;
}
#else
inline J_COLOR_SPACE rgbOutputColorSpace()
{
    return JCS_RGB;
}
#endif

namespace {

const int exifMarker = JPEG_APP0 + 1;

// JPEG only supports a denominator of 8.
const unsigned scaleDenominator = 8;

} // namespace

namespace blink {

struct decoder_error_mgr {
    DISALLOW_NEW();
    struct jpeg_error_mgr pub; // "public" fields for IJG library
    int num_corrupt_warnings; // Counts corrupt warning messages
    jmp_buf setjmp_buffer; // For handling catastropic errors
};

struct decoder_source_mgr {
    DISALLOW_NEW();
    struct jpeg_source_mgr pub; // "public" fields for IJG library
    JPEGImageReader* reader;
};

enum jstate {
    JPEG_HEADER, // Reading JFIF headers
    JPEG_START_DECOMPRESS,
    JPEG_DECOMPRESS_PROGRESSIVE, // Output progressive pixels
    JPEG_DECOMPRESS_SEQUENTIAL, // Output sequential pixels
    JPEG_DONE
};

enum yuv_subsampling {
    YUV_UNKNOWN,
    YUV_410,
    YUV_411,
    YUV_420,
    YUV_422,
    YUV_440,
    YUV_444
};

void init_source(j_decompress_ptr jd);
boolean fill_input_buffer(j_decompress_ptr jd);
void skip_input_data(j_decompress_ptr jd, long num_bytes);
void term_source(j_decompress_ptr jd);
void error_exit(j_common_ptr cinfo);
void emit_message(j_common_ptr cinfo, int msg_level);

static unsigned readUint16(JOCTET* data, bool isBigEndian)
{
    if (isBigEndian)
        return (GETJOCTET(data[0]) << 8) | GETJOCTET(data[1]);
    return (GETJOCTET(data[1]) << 8) | GETJOCTET(data[0]);
}

static unsigned readUint32(JOCTET* data, bool isBigEndian)
{
    if (isBigEndian)
        return (GETJOCTET(data[0]) << 24) | (GETJOCTET(data[1]) << 16) | (GETJOCTET(data[2]) << 8) | GETJOCTET(data[3]);
    return (GETJOCTET(data[3]) << 24) | (GETJOCTET(data[2]) << 16) | (GETJOCTET(data[1]) << 8) | GETJOCTET(data[0]);
}

static bool checkExifHeader(jpeg_saved_marker_ptr marker,
    bool& isBigEndian,
    unsigned& ifdOffset)
{
    // For exif data, the APP1 block is followed by 'E', 'x', 'i', 'f', '\0',
    // then a fill byte, and then a tiff file that contains the metadata.
    // A tiff file starts with 'I', 'I' (intel / little endian byte order) or
    // 'M', 'M' (motorola / big endian byte order), followed by (uint16_t)42,
    // followed by an uint32_t with the offset to the tag block, relative to the
    // tiff file start.
    const unsigned exifHeaderSize = 14;
    if (!(marker->marker == exifMarker && marker->data_length >= exifHeaderSize && marker->data[0] == 'E' && marker->data[1] == 'x' && marker->data[2] == 'i' && marker->data[3] == 'f' && marker->data[4] == '\0'
            // data[5] is a fill byte
            && ((marker->data[6] == 'I' && marker->data[7] == 'I') || (marker->data[6] == 'M' && marker->data[7] == 'M'))))
        return false;

    isBigEndian = marker->data[6] == 'M';
    if (readUint16(marker->data + 8, isBigEndian) != 42)
        return false;

    ifdOffset = readUint32(marker->data + 10, isBigEndian);
    return true;
}

static ImageOrientation readImageOrientation(jpeg_decompress_struct* info)
{
    // The JPEG decoder looks at EXIF metadata.
    // FIXME: Possibly implement XMP and IPTC support.
    const unsigned orientationTag = 0x112;
    const unsigned shortType = 3;
    for (jpeg_saved_marker_ptr marker = info->marker_list; marker;
         marker = marker->next) {
        bool isBigEndian;
        unsigned ifdOffset;
        if (!checkExifHeader(marker, isBigEndian, ifdOffset))
            continue;
        const unsigned offsetToTiffData = 6; // Account for 'Exif\0<fill byte>' header.
        if (marker->data_length < offsetToTiffData || ifdOffset >= marker->data_length - offsetToTiffData)
            continue;
        ifdOffset += offsetToTiffData;

        // The jpeg exif container format contains a tiff block for metadata.
        // A tiff image file directory (ifd) consists of a uint16_t describing
        // the number of ifd entries, followed by that many entries.
        // When touching this code, it's useful to look at the tiff spec:
        // http://partners.adobe.com/public/developer/en/tiff/TIFF6.pdf
        JOCTET* ifd = marker->data + ifdOffset;
        JOCTET* end = marker->data + marker->data_length;
        if (end - ifd < 2)
            continue;
        unsigned tagCount = readUint16(ifd, isBigEndian);
        ifd += 2; // Skip over the uint16 that was just read.

        // Every ifd entry is 2 bytes of tag, 2 bytes of contents datatype,
        // 4 bytes of number-of-elements, and 4 bytes of either offset to the
        // tag data, or if the data is small enough, the inlined data itself.
        const int ifdEntrySize = 12;
        for (unsigned i = 0; i < tagCount && end - ifd >= ifdEntrySize;
             ++i, ifd += ifdEntrySize) {
            unsigned tag = readUint16(ifd, isBigEndian);
            unsigned type = readUint16(ifd + 2, isBigEndian);
            unsigned count = readUint32(ifd + 4, isBigEndian);
            if (tag == orientationTag && type == shortType && count == 1)
                return ImageOrientation::fromEXIFValue(
                    readUint16(ifd + 8, isBigEndian));
        }
    }

    return ImageOrientation();
}

static IntSize computeYUVSize(const jpeg_decompress_struct* info,
    int component)
{
    return IntSize(info->cur_comp_info[component]->downsampled_width,
        info->cur_comp_info[component]->downsampled_height);
}

static size_t computeYUVWidthBytes(const jpeg_decompress_struct* info,
    int component)
{
    return info->cur_comp_info[component]->width_in_blocks * DCTSIZE;
}

static yuv_subsampling yuvSubsampling(const jpeg_decompress_struct& info)
{
    if ((DCTSIZE == 8) && (info.num_components == 3) && (info.scale_denom <= 8) && (info.cur_comp_info[0]) && (info.cur_comp_info[1]) && (info.cur_comp_info[2]) && (info.cur_comp_info[1]->h_samp_factor == 1) && (info.cur_comp_info[1]->v_samp_factor == 1) && (info.cur_comp_info[2]->h_samp_factor == 1) && (info.cur_comp_info[2]->v_samp_factor == 1)) {
        int h = info.cur_comp_info[0]->h_samp_factor;
        int v = info.cur_comp_info[0]->v_samp_factor;
        // 4:4:4 : (h == 1) && (v == 1)
        // 4:4:0 : (h == 1) && (v == 2)
        // 4:2:2 : (h == 2) && (v == 1)
        // 4:2:0 : (h == 2) && (v == 2)
        // 4:1:1 : (h == 4) && (v == 1)
        // 4:1:0 : (h == 4) && (v == 2)
        if (v == 1) {
            switch (h) {
            case 1:
                return YUV_444;
            case 2:
                return YUV_422;
            case 4:
                return YUV_411;
            default:
                break;
            }
        } else if (v == 2) {
            switch (h) {
            case 1:
                return YUV_440;
            case 2:
                return YUV_420;
            case 4:
                return YUV_410;
            default:
                break;
            }
        }
    }

    return YUV_UNKNOWN;
}

static void progressMonitor(j_common_ptr info)
{
    int scan = ((j_decompress_ptr)info)->input_scan_number;
    // Progressive images with a very large number of scans can cause the
    // decoder to hang.  Here we use the progress monitor to abort on
    // a very large number of scans.  100 is arbitrary, but much larger
    // than the number of scans we might expect in a normal image.
    if (scan >= 100) {
        error_exit(info);
    }
}

class JPEGImageReader final {
    USING_FAST_MALLOC(JPEGImageReader);
    WTF_MAKE_NONCOPYABLE(JPEGImageReader);

public:
    JPEGImageReader(JPEGImageDecoder* decoder)
        : m_decoder(decoder)
        , m_needsRestart(false)
        , m_restartPosition(0)
        , m_nextReadPosition(0)
        , m_lastSetByte(nullptr)
        , m_state(JPEG_HEADER)
        , m_samples(nullptr)
    {
        memset(&m_info, 0, sizeof(jpeg_decompress_struct));

        // Set up the normal JPEG error routines, then override error_exit.
        m_info.err = jpeg_std_error(&m_err.pub);
        m_err.pub.error_exit = error_exit;

        // Allocate and initialize JPEG decompression object.
        jpeg_create_decompress(&m_info);

        // Initialize source manager.
        memset(&m_src, 0, sizeof(decoder_source_mgr));
        m_info.src = reinterpret_cast_ptr<jpeg_source_mgr*>(&m_src);

        // Set up callback functions.
        m_src.pub.init_source = init_source;
        m_src.pub.fill_input_buffer = fill_input_buffer;
        m_src.pub.skip_input_data = skip_input_data;
        m_src.pub.resync_to_restart = jpeg_resync_to_restart;
        m_src.pub.term_source = term_source;
        m_src.reader = this;

        // Set up a progress monitor.
        m_info.progress = &m_progressMgr;
        m_progressMgr.progress_monitor = progressMonitor;

        // Retain ICC color profile markers for color management.
        setup_read_icc_profile(&m_info);

        // Keep APP1 blocks, for obtaining exif data.
        jpeg_save_markers(&m_info, exifMarker, 0xFFFF);
    }

    ~JPEGImageReader() { jpeg_destroy_decompress(&m_info); }

    void skipBytes(long numBytes)
    {
        if (numBytes <= 0)
            return;

        size_t bytesToSkip = static_cast<size_t>(numBytes);

        if (bytesToSkip < m_info.src->bytes_in_buffer) {
            // The next byte needed is in the buffer. Move to it.
            m_info.src->bytes_in_buffer -= bytesToSkip;
            m_info.src->next_input_byte += bytesToSkip;
        } else {
            // Move beyond the buffer and empty it.
            m_nextReadPosition = m_nextReadPosition + bytesToSkip - m_info.src->bytes_in_buffer;
            m_info.src->bytes_in_buffer = 0;
            m_info.src->next_input_byte = nullptr;
        }

        // This is a valid restart position.
        m_restartPosition = m_nextReadPosition - m_info.src->bytes_in_buffer;
        // We updated |next_input_byte|, so we need to update |m_lastByteSet|
        // so we know not to update |m_restartPosition| again.
        m_lastSetByte = m_info.src->next_input_byte;
    }

    bool fillBuffer()
    {
        if (m_needsRestart) {
            m_needsRestart = false;
            m_nextReadPosition = m_restartPosition;
        } else {
            updateRestartPosition();
        }

        const char* segment;
        const size_t bytes = m_data->getSomeData(segment, m_nextReadPosition);
        if (bytes == 0) {
            // We had to suspend. When we resume, we will need to start from the
            // restart position.
            m_needsRestart = true;
            clearBuffer();
            return false;
        }

        m_nextReadPosition += bytes;
        m_info.src->bytes_in_buffer = bytes;
        const JOCTET* nextByte = reinterpret_cast_ptr<const JOCTET*>(segment);
        m_info.src->next_input_byte = nextByte;
        m_lastSetByte = nextByte;
        return true;
    }

    void setData(SegmentReader* data)
    {
        if (m_data.get() == data)
            return;

        m_data = data;

        // If a restart is needed, the next call to fillBuffer will read from the
        // new SegmentReader.
        if (m_needsRestart)
            return;

        // Otherwise, empty the buffer, and leave the position the same, so
        // fillBuffer continues reading from the same position in the new
        // SegmentReader.
        m_nextReadPosition -= m_info.src->bytes_in_buffer;
        clearBuffer();
    }

    bool decode(bool onlySize)
    {
        // We need to do the setjmp here. Otherwise bad things will happen
        if (setjmp(m_err.setjmp_buffer))
            return m_decoder->setFailed();

        J_COLOR_SPACE overrideColorSpace = JCS_UNKNOWN;
        switch (m_state) {
        case JPEG_HEADER:
            // Read file parameters with jpeg_read_header().
            if (jpeg_read_header(&m_info, true) == JPEG_SUSPENDED)
                return false; // I/O suspension.

            switch (m_info.jpeg_color_space) {
            case JCS_YCbCr:
                // libjpeg can convert YCbCr image pixels to RGB.
                m_info.out_color_space = rgbOutputColorSpace();
                if (m_decoder->hasImagePlanes() && (yuvSubsampling(m_info) != YUV_UNKNOWN))
                    overrideColorSpace = JCS_YCbCr;
                break;
            case JCS_GRAYSCALE:
            case JCS_RGB:
                // libjpeg can convert GRAYSCALE image pixels to RGB.
                m_info.out_color_space = rgbOutputColorSpace();
                break;
            case JCS_CMYK:
            case JCS_YCCK:
                // libjpeg can convert YCCK to CMYK, but neither to RGB, so we
                // manually convert CMKY to RGB.
                m_info.out_color_space = JCS_CMYK;
                break;
            default:
                return m_decoder->setFailed();
            }

            m_state = JPEG_START_DECOMPRESS;

            // We can fill in the size now that the header is available.
            if (!m_decoder->setSize(m_info.image_width, m_info.image_height))
                return false;

            // Calculate and set decoded size.
            m_info.scale_num = m_decoder->desiredScaleNumerator();
            m_info.scale_denom = scaleDenominator;
            // Scaling caused by running low on memory isn't supported by YUV
            // decoding since YUV decoding is performed on full sized images. At
            // this point, buffers and various image info structs have already been
            // set up for the scaled size after reading the image header using this
            // decoder, so using the full size is no longer possible.
            if (m_info.scale_num != m_info.scale_denom)
                overrideColorSpace = JCS_UNKNOWN;
            jpeg_calc_output_dimensions(&m_info);
            m_decoder->setDecodedSize(m_info.output_width, m_info.output_height);

            m_decoder->setOrientation(readImageOrientation(info()));

            // Allow color management of the decoded RGBA pixels if possible.
            if (!m_decoder->ignoresColorSpace()) {
                JOCTET* profile = nullptr;
                unsigned profileLength = 0;
                if (read_icc_profile(info(), &profile, &profileLength)) {
                    decoder()->setEmbeddedColorProfile(reinterpret_cast<char*>(profile),
                        profileLength);
                    free(profile);
                }
                if (decoder()->colorTransform()) {
                    overrideColorSpace = JCS_UNKNOWN;
                }
            }
            if (overrideColorSpace == JCS_YCbCr) {
                m_info.out_color_space = JCS_YCbCr;
                m_info.raw_data_out = TRUE;
                m_uvSize = computeYUVSize(
                    &m_info,
                    1); // U size and V size have to be the same if we got here
            }

            // Don't allocate a giant and superfluous memory buffer when the
            // image is a sequential JPEG.
            m_info.buffered_image = jpeg_has_multiple_scans(&m_info);
            if (m_info.buffered_image) {
                m_err.pub.emit_message = emit_message;
                m_err.num_corrupt_warnings = 0;
            }

            if (onlySize) {
                // This exits the function while there is still potentially
                // data in the buffer. Before this function is called again,
                // the SharedBuffer may be collapsed (by a call to
                // mergeSegmentsIntoBuffer), invalidating the "buffer" (which
                // in reality is a pointer into the SharedBuffer's data).
                // Defensively empty the buffer, but first find the latest
                // restart position and signal to restart, so the next call to
                // fillBuffer will resume from the correct point.
                m_needsRestart = true;
                updateRestartPosition();
                clearBuffer();
                return true;
            }
            // FALL THROUGH

        case JPEG_START_DECOMPRESS:
            // Set parameters for decompression.
            // FIXME -- Should reset dct_method and dither mode for final pass
            // of progressive JPEG.
            m_info.dct_method = JDCT_ISLOW;
            m_info.dither_mode = JDITHER_FS;
            m_info.do_fancy_upsampling = true;
            m_info.do_block_smoothing = true;
            m_info.enable_2pass_quant = false;
            // FIXME: should we just assert these?
            m_info.enable_external_quant = false;
            m_info.enable_1pass_quant = false;
            m_info.quantize_colors = false;
            m_info.colormap = 0;

            // Make a one-row-high sample array that will go away when done with
            // image. Always make it big enough to hold one RGBA row. Since this
            // uses the IJG memory manager, it must be allocated before the call
            // to jpeg_start_decompress().
            m_samples = allocateSampleArray();

            // Start decompressor.
            if (!jpeg_start_decompress(&m_info))
                return false; // I/O suspension.

            // If this is a progressive JPEG ...
            m_state = (m_info.buffered_image) ? JPEG_DECOMPRESS_PROGRESSIVE
                                              : JPEG_DECOMPRESS_SEQUENTIAL;
            // FALL THROUGH

        case JPEG_DECOMPRESS_SEQUENTIAL:
            if (m_state == JPEG_DECOMPRESS_SEQUENTIAL) {
                if (!m_decoder->outputScanlines())
                    return false; // I/O suspension.

                // If we've completed image output...
                ASSERT(m_info.output_scanline == m_info.output_height);
                m_state = JPEG_DONE;
            }
            // FALL THROUGH

        case JPEG_DECOMPRESS_PROGRESSIVE:
            if (m_state == JPEG_DECOMPRESS_PROGRESSIVE) {
                int status = 0;
                do {
                    decoder_error_mgr* err = reinterpret_cast_ptr<decoder_error_mgr*>(m_info.err);
                    if (err->num_corrupt_warnings)
                        break;
                    status = jpeg_consume_input(&m_info);
                } while ((status != JPEG_SUSPENDED) && (status != JPEG_REACHED_EOI));

                for (;;) {
                    if (!m_info.output_scanline) {
                        int scan = m_info.input_scan_number;

                        // If we haven't displayed anything yet
                        // (output_scan_number == 0) and we have enough data for
                        // a complete scan, force output of the last full scan.
                        if (!m_info.output_scan_number && (scan > 1) && (status != JPEG_REACHED_EOI))
                            --scan;

                        if (!jpeg_start_output(&m_info, scan))
                            return false; // I/O suspension.
                    }

                    if (m_info.output_scanline == 0xffffff)
                        m_info.output_scanline = 0;

                    if (!m_decoder->outputScanlines()) {
                        if (m_decoder->failed())
                            return false;
                        // If no scan lines were read, flag it so we don't call
                        // jpeg_start_output() multiple times for the same scan.
                        if (!m_info.output_scanline)
                            m_info.output_scanline = 0xffffff;

                        return false; // I/O suspension.
                    }

                    if (m_info.output_scanline == m_info.output_height) {
                        if (!jpeg_finish_output(&m_info))
                            return false; // I/O suspension.

                        if (jpeg_input_complete(&m_info) && (m_info.input_scan_number == m_info.output_scan_number))
                            break;

                        m_info.output_scanline = 0;
                    }
                }

                m_state = JPEG_DONE;
            }
            // FALL THROUGH

        case JPEG_DONE:
            // Finish decompression.
            return jpeg_finish_decompress(&m_info);
        }

        return true;
    }

    jpeg_decompress_struct* info() { return &m_info; }
    JSAMPARRAY samples() const { return m_samples; }
    JPEGImageDecoder* decoder() { return m_decoder; }
    IntSize uvSize() const { return m_uvSize; }

private:
    JSAMPARRAY allocateSampleArray()
    {
// Some output color spaces don't need the sample array: don't allocate in that
// case.
#if defined(TURBO_JPEG_RGB_SWIZZLE)
        if (turboSwizzled(m_info.out_color_space))
            return nullptr;
#endif

        if (m_info.out_color_space != JCS_YCbCr)
            return (*m_info.mem->alloc_sarray)(
                reinterpret_cast_ptr<j_common_ptr>(&m_info), JPOOL_IMAGE,
                4 * m_info.output_width, 1);

        // Compute the width of the Y plane in bytes.  This may be larger than the
        // output width, since the jpeg library requires that the allocated width be
        // a multiple of DCTSIZE.  Note that this buffer will be used as garbage
        // memory for rows that extend below the actual height of the image.  We can
        // reuse the same memory for the U and V planes, since we are guaranteed
        // that the Y plane width is at least as large as the U and V plane widths.
        int widthBytes = computeYUVWidthBytes(&m_info, 0);
        return (*m_info.mem->alloc_sarray)(
            reinterpret_cast_ptr<j_common_ptr>(&m_info), JPOOL_IMAGE, widthBytes,
            1);
    }

    void updateRestartPosition()
    {
        if (m_lastSetByte != m_info.src->next_input_byte) {
            // next_input_byte was updated by jpeg, meaning that it found a restart
            // position.
            m_restartPosition = m_nextReadPosition - m_info.src->bytes_in_buffer;
        }
    }

    void clearBuffer()
    {
        // Let libjpeg know that the buffer needs to be refilled.
        m_info.src->bytes_in_buffer = 0;
        m_info.src->next_input_byte = nullptr;
        m_lastSetByte = nullptr;
    }

    RefPtr<SegmentReader> m_data;
    JPEGImageDecoder* m_decoder;

    // Input reading: True if we need to back up to m_restartPosition.
    bool m_needsRestart;
    // If libjpeg needed to restart, this is the position to restart from.
    size_t m_restartPosition;
    // This is the position where we will read from, unless there is a restart.
    size_t m_nextReadPosition;
    // This is how we know to update the restart position. It is the last value
    // we set to next_input_byte. libjpeg will update next_input_byte when it
    // has found the next restart position, so if it no longer matches this
    // value, we know we've reached the next restart position.
    const JOCTET* m_lastSetByte;

    jpeg_decompress_struct m_info;
    decoder_error_mgr m_err;
    decoder_source_mgr m_src;
    jpeg_progress_mgr m_progressMgr;
    jstate m_state;

    JSAMPARRAY m_samples;
    IntSize m_uvSize;
};

void error_exit(
    j_common_ptr cinfo) // Decoding failed: return control to the setjmp point.
{
    longjmp(reinterpret_cast_ptr<decoder_error_mgr*>(cinfo->err)->setjmp_buffer,
        -1);
}

void emit_message(j_common_ptr cinfo, int msg_level)
{
    if (msg_level >= 0)
        return;

    decoder_error_mgr* err = reinterpret_cast_ptr<decoder_error_mgr*>(cinfo->err);
    err->pub.num_warnings++;

    // Detect and count corrupt JPEG warning messages.
    const char* warning = 0;
    int code = err->pub.msg_code;
    if (code > 0 && code <= err->pub.last_jpeg_message)
        warning = err->pub.jpeg_message_table[code];
    if (warning && !strncmp("Corrupt JPEG", warning, 12))
        err->num_corrupt_warnings++;
}

void init_source(j_decompress_ptr) { }

void skip_input_data(j_decompress_ptr jd, long num_bytes)
{
    reinterpret_cast_ptr<decoder_source_mgr*>(jd->src)->reader->skipBytes(
        num_bytes);
}

boolean fill_input_buffer(j_decompress_ptr jd)
{
    return reinterpret_cast_ptr<decoder_source_mgr*>(jd->src)
        ->reader->fillBuffer();
}

void term_source(j_decompress_ptr jd)
{
    reinterpret_cast_ptr<decoder_source_mgr*>(jd->src)
        ->reader->decoder()
        ->complete();
}

JPEGImageDecoder::JPEGImageDecoder(AlphaOption alphaOption,
    const ColorBehavior& colorBehavior,
    size_t maxDecodedBytes)
    : ImageDecoder(alphaOption, colorBehavior, maxDecodedBytes)
{
}

JPEGImageDecoder::~JPEGImageDecoder() { }

bool JPEGImageDecoder::setSize(unsigned width, unsigned height)
{
    if (!ImageDecoder::setSize(width, height))
        return false;

    if (!desiredScaleNumerator())
        return setFailed();

    setDecodedSize(width, height);
    return true;
}

void JPEGImageDecoder::onSetData(SegmentReader* data)
{
    if (m_reader)
        m_reader->setData(data);
}

void JPEGImageDecoder::setDecodedSize(unsigned width, unsigned height)
{
    m_decodedSize = IntSize(width, height);
}

IntSize JPEGImageDecoder::decodedYUVSize(int component) const
{
    ASSERT((component >= 0) && (component <= 2) && m_reader);
    const jpeg_decompress_struct* info = m_reader->info();

    ASSERT(info->out_color_space == JCS_YCbCr);
    return computeYUVSize(info, component);
}

size_t JPEGImageDecoder::decodedYUVWidthBytes(int component) const
{
    ASSERT((component >= 0) && (component <= 2) && m_reader);
    const jpeg_decompress_struct* info = m_reader->info();

    ASSERT(info->out_color_space == JCS_YCbCr);
    return computeYUVWidthBytes(info, component);
}

unsigned JPEGImageDecoder::desiredScaleNumerator() const
{
    size_t originalBytes = size().width() * size().height() * 4;

    if (originalBytes <= m_maxDecodedBytes)
        return scaleDenominator;

    // Downsample according to the maximum decoded size.
    unsigned scaleNumerator = static_cast<unsigned>(floor(sqrt(
        // MSVC needs explicit parameter type for sqrt().
        static_cast<float>(m_maxDecodedBytes * scaleDenominator * scaleDenominator / originalBytes))));

    return scaleNumerator;
}

bool JPEGImageDecoder::canDecodeToYUV()
{
    // Calling isSizeAvailable() ensures the reader is created and the output
    // color space is set.
    return isSizeAvailable() && m_reader->info()->out_color_space == JCS_YCbCr;
}

bool JPEGImageDecoder::decodeToYUV()
{
    if (!hasImagePlanes())
        return false;

    PlatformInstrumentation::willDecodeImage("JPEG");
    decode(false);
    PlatformInstrumentation::didDecodeImage();
    return !failed();
}

void JPEGImageDecoder::setImagePlanes(
    std::unique_ptr<ImagePlanes> imagePlanes)
{
    m_imagePlanes = std::move(imagePlanes);
}

template <J_COLOR_SPACE colorSpace>
void setPixel(ImageFrame& buffer,
    ImageFrame::PixelData* pixel,
    JSAMPARRAY samples,
    int column)
{
    ASSERT_NOT_REACHED();
}

// Used only for debugging with libjpeg (instead of libjpeg-turbo).
template <>
void setPixel<JCS_RGB>(ImageFrame& buffer,
    ImageFrame::PixelData* pixel,
    JSAMPARRAY samples,
    int column)
{
    JSAMPLE* jsample = *samples + column * 3;
    buffer.setRGBARaw(pixel, jsample[0], jsample[1], jsample[2], 255);
}

template <>
void setPixel<JCS_CMYK>(ImageFrame& buffer,
    ImageFrame::PixelData* pixel,
    JSAMPARRAY samples,
    int column)
{
    JSAMPLE* jsample = *samples + column * 4;

    // Source is 'Inverted CMYK', output is RGB.
    // See: http://www.easyrgb.com/math.php?MATH=M12#text12
    // Or: http://www.ilkeratalay.com/colorspacesfaq.php#rgb
    // From CMYK to CMY:
    // X =   X    * (1 -   K   ) +   K  [for X = C, M, or Y]
    // Thus, from Inverted CMYK to CMY is:
    // X = (1-iX) * (1 - (1-iK)) + (1-iK) => 1 - iX*iK
    // From CMY (0..1) to RGB (0..1):
    // R = 1 - C => 1 - (1 - iC*iK) => iC*iK  [G and B similar]
    unsigned k = jsample[3];
    buffer.setRGBARaw(pixel, jsample[0] * k / 255, jsample[1] * k / 255,
        jsample[2] * k / 255, 255);
}

// Used only for JCS_CMYK and JCS_RGB output.  Note that JCS_RGB is used only
// for debugging with libjpeg (instead of libjpeg-turbo).
template <J_COLOR_SPACE colorSpace>
bool outputRows(JPEGImageReader* reader, ImageFrame& buffer)
{
    JSAMPARRAY samples = reader->samples();
    jpeg_decompress_struct* info = reader->info();
    int width = info->output_width;

    while (info->output_scanline < info->output_height) {
        // jpeg_read_scanlines will increase the scanline counter, so we
        // save the scanline before calling it.
        int y = info->output_scanline;
        // Request one scanline: returns 0 or 1 scanlines.
        if (jpeg_read_scanlines(info, samples, 1) != 1)
            return false;

        ImageFrame::PixelData* pixel = buffer.getAddr(0, y);
        for (int x = 0; x < width; ++pixel, ++x)
            setPixel<colorSpace>(buffer, pixel, samples, x);

//         SkColorSpaceXform* xform = reader->decoder()->colorTransform();
//         if (JCS_RGB == colorSpace && xform) {
//             ImageFrame::PixelData* row = buffer.getAddr(0, y);
//             xform->apply(xformColorFormat(), row, xformColorFormat(), row, width, kOpaque_SkAlphaType);
//         }
    }

    buffer.setPixelsChanged(true);
    return true;
}

static bool outputRawData(JPEGImageReader* reader, ImagePlanes* imagePlanes)
{
    JSAMPARRAY samples = reader->samples();
    jpeg_decompress_struct* info = reader->info();

    JSAMPARRAY bufferraw[3];
    JSAMPROW bufferraw2[32];
    bufferraw[0] = &bufferraw2[0]; // Y channel rows (8 or 16)
    bufferraw[1] = &bufferraw2[16]; // U channel rows (8)
    bufferraw[2] = &bufferraw2[24]; // V channel rows (8)
    int yHeight = info->output_height;
    int v = info->comp_info[0].v_samp_factor;
    IntSize uvSize = reader->uvSize();
    int uvHeight = uvSize.height();
    JSAMPROW outputY = static_cast<JSAMPROW>(imagePlanes->plane(0));
    JSAMPROW outputU = static_cast<JSAMPROW>(imagePlanes->plane(1));
    JSAMPROW outputV = static_cast<JSAMPROW>(imagePlanes->plane(2));
    size_t rowBytesY = imagePlanes->rowBytes(0);
    size_t rowBytesU = imagePlanes->rowBytes(1);
    size_t rowBytesV = imagePlanes->rowBytes(2);

    // Request 8 or 16 scanlines: returns 0 or more scanlines.
    int yScanlinesToRead = DCTSIZE * v;
    JSAMPROW dummyRow = *samples;
    while (info->output_scanline < info->output_height) {
        // Assign 8 or 16 rows of memory to read the Y channel.
        for (int i = 0; i < yScanlinesToRead; ++i) {
            int scanline = info->output_scanline + i;
            if (scanline < yHeight) {
                bufferraw2[i] = &outputY[scanline * rowBytesY];
            } else {
                bufferraw2[i] = dummyRow;
            }
        }

        // Assign 8 rows of memory to read the U and V channels.
        int scaledScanline = info->output_scanline / v;
        for (int i = 0; i < 8; ++i) {
            int scanline = scaledScanline + i;
            if (scanline < uvHeight) {
                bufferraw2[16 + i] = &outputU[scanline * rowBytesU];
                bufferraw2[24 + i] = &outputV[scanline * rowBytesV];
            } else {
                bufferraw2[16 + i] = dummyRow;
                bufferraw2[24 + i] = dummyRow;
            }
        }

        JDIMENSION scanlinesRead = jpeg_read_raw_data(info, bufferraw, yScanlinesToRead);
        if (!scanlinesRead)
            return false;
    }

    info->output_scanline = std::min(info->output_scanline, info->output_height);
    return true;
}

bool JPEGImageDecoder::outputScanlines()
{
    if (hasImagePlanes())
        return outputRawData(m_reader.get(), m_imagePlanes.get());

    if (m_frameBufferCache.isEmpty())
        return false;

    jpeg_decompress_struct* info = m_reader->info();

    // Initialize the framebuffer if needed.
    ImageFrame& buffer = m_frameBufferCache[0];
    if (buffer.getStatus() == ImageFrame::FrameEmpty) {
        ASSERT(info->output_width == static_cast<JDIMENSION>(m_decodedSize.width()));
        ASSERT(info->output_height == static_cast<JDIMENSION>(m_decodedSize.height()));

        if (!buffer.setSizeAndColorSpace(info->output_width, info->output_height,
                colorSpaceForSkImages()))
            return setFailed();

        // The buffer is transparent outside the decoded area while the image is
        // loading. The image will be marked fully opaque in complete().
        buffer.setStatus(ImageFrame::FramePartial);
        buffer.setHasAlpha(true);

        // For JPEGs, the frame always fills the entire image.
        buffer.setOriginalFrameRect(IntRect(IntPoint(), size()));
    }

#if defined(TURBO_JPEG_RGB_SWIZZLE)
    if (turboSwizzled(info->out_color_space)) {
        while (info->output_scanline < info->output_height) {
            unsigned char* row = reinterpret_cast_ptr<unsigned char*>(
                buffer.getAddr(0, info->output_scanline));
            if (jpeg_read_scanlines(info, &row, 1) != 1)
                return false;

            SkColorSpaceXform* xform = colorTransform();
            if (xform) {
//                 xform->apply(xformColorFormat(), row, xformColorFormat(), row,
//                     info->output_width, kOpaque_SkAlphaType);
                OutputDebugStringA("JPEGImageDecoder::outputScanlines not impl\n");
                DebugBreak();
            }
        }
        buffer.setPixelsChanged(true);
        return true;
    }
#endif

    switch (info->out_color_space) {
    case JCS_RGB:
        return outputRows<JCS_RGB>(m_reader.get(), buffer);
    case JCS_CMYK:
        return outputRows<JCS_CMYK>(m_reader.get(), buffer);
    default:
        ASSERT_NOT_REACHED();
    }

    return setFailed();
}

void JPEGImageDecoder::complete()
{
    if (m_frameBufferCache.isEmpty())
        return;

    m_frameBufferCache[0].setHasAlpha(false);
    m_frameBufferCache[0].setStatus(ImageFrame::FrameComplete);
}

inline bool isComplete(const JPEGImageDecoder* decoder, bool onlySize)
{
    if (decoder->hasImagePlanes() && !onlySize)
        return true;

    return decoder->frameIsCompleteAtIndex(0);
}

void JPEGImageDecoder::decode(bool onlySize)
{
    if (failed())
        return;

    if (!m_reader) {
        m_reader = WTF::makeUnique<JPEGImageReader>(this);
        m_reader->setData(m_data.get());
    }

    // If we couldn't decode the image but have received all the data, decoding
    // has failed.
    if (!m_reader->decode(onlySize) && isAllDataReceived())
        setFailed();

    // If decoding is done or failed, we don't need the JPEGImageReader anymore.
    if (isComplete(this, onlySize) || failed())
        m_reader.reset();
}

} // namespace blink
