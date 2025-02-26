import { constVal, buildCommonSetting } from "./const_val.js";

var json = [{
    "var":[
        {"sdkPath":constVal.sdkPath},
        {"clangPath":constVal.clangPath},
        {"srcPath":constVal.srcPath},
        {"ndkIncludePath":constVal.ndkIncludePath},
        {"ndkBinPath":constVal.ndkBinPath},
        {"targetDir": constVal.targetDir},
        {"sysroot": constVal.sysroot},
    ],
    "compile":{
        "ccompiler":"${clangPath}/clang.exe",
        "cppcompiler":"${clangPath}/clang++.exe",
            
        "include":[
//            "${sdkPath}/include/c++/7.2.0",
//            "${sdkPath}/include/c++/7.2.0/include",
//            "${ndkIncludePath}",
//            "${sdkPath}/include/c++/7.2.0/x86_64-unknown-linux-gnu/",
//            "${srcPath}",
//            "${sdkPath}/sysroot/usr/include",
//            "${sdkPath}/sysroot/usr/",
//            "${sdkPath}/sysroot/usr/include/linux",
            ...constVal.includePaths,
            "${srcPath}/linux",
            "${srcPath}/third_party/brotli",
            "${srcPath}/third_party/freetype/src/include",
            "${srcPath}/third_party/zlib",
            "${srcPath}/third_party/ots/include",
            "${srcPath}/third_party/ots",
            "${srcPath}/third_party/sfntly/src/cpp/src",
            "${srcPath}/third_party/libxml/linux",
            "${srcPath}/third_party/libxml/linux/include",
            "${srcPath}/third_party/libxml/src/include",
            "${srcPath}/third_party/libxslt",
            "${srcPath}/third_party/fontconfig/include/src",
            "${srcPath}/third_party/fontconfig/include",
            "${srcPath}/third_party/fontconfig/src"
        ],
        "prebuildSrc":[
//            "${srcPath}/third_party/fontconfig/src/src/fcfreetype.c"
//            "${srcPath}/third_party/fontconfig/src/src/fcatomic.c",
//            "${srcPath}/third_party/fontconfig/src/src/fccache.c",
            "${srcPath}/third_party/fontconfig/src/src/fccfg.c",
//            "${srcPath}/third_party/fontconfig/src/src/fccharset.c",
//            "${srcPath}/third_party/fontconfig/src/src/fccompat.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcdbg.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcdefault.c",
            "${srcPath}/third_party/fontconfig/src/src/fcdir.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcformat.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcfreetype.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcfs.c",
//            "${srcPath}/third_party/fontconfig/src/src/fchash.c",
            "${srcPath}/third_party/fontconfig/src/src/fcinit.c"
//            "${srcPath}/third_party/fontconfig/src/src/fclang.c",
//            "${srcPath}/third_party/fontconfig/src/src/fclist.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcmatch.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcmatrix.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcname.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcobjs.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcpat.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcptrlist.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcrange.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcserialize.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcstat.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcstr.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcweight.c",
//            "${srcPath}/third_party/fontconfig/src/src/fcxml.c",
//            "${srcPath}/third_party/libxml/src/xpath.c"

        ],
        "src":[
            "${srcPath}/third_party/libwebp/dec/dec_alpha.c",
            "${srcPath}/third_party/libwebp/dec/dec_buffer.c",
            "${srcPath}/third_party/libwebp/dec/dec_frame.c",
            "${srcPath}/third_party/libwebp/dec/dec_idec.c",
            "${srcPath}/third_party/libwebp/dec/dec_quant.c",
            "${srcPath}/third_party/libwebp/dec/dec_tree.c",
            "${srcPath}/third_party/libwebp/dec/dec_vp8l.c",
            "${srcPath}/third_party/libwebp/dec/dec_io.c",
            "${srcPath}/third_party/libwebp/dec/dec_vp8.c",
            "${srcPath}/third_party/libwebp/dec/dec_webp.c",
            "${srcPath}/third_party/libwebp/demux/anim_decode.c",
            "${srcPath}/third_party/libwebp/demux/demux.c",
            "${srcPath}/third_party/libwebp/dsp/alpha_processing.c",
            "${srcPath}/third_party/libwebp/dsp/alpha_processing_sse2.c",
            "${srcPath}/third_party/libwebp/dsp/argb.c",
            "${srcPath}/third_party/libwebp/dsp/argb_sse2.c",
            "${srcPath}/third_party/libwebp/dsp/cpu.c",
            "${srcPath}/third_party/libwebp/dsp/dsp_cost.c",
            "${srcPath}/third_party/libwebp/dsp/cost_sse2.c",
            "${srcPath}/third_party/libwebp/dsp/filters.c",
            "${srcPath}/third_party/libwebp/dsp/rescaler.c",
            "${srcPath}/third_party/libwebp/dsp/rescaler_neon.c",
            "${srcPath}/third_party/libwebp/dsp/rescaler_sse2.c",
            "${srcPath}/third_party/libwebp/dsp/dec.c",
            "${srcPath}/third_party/libwebp/dsp/dec_clip_tables.c",
            "${srcPath}/third_party/libwebp/dsp/dec_sse2.c",
            "${srcPath}/third_party/libwebp/dsp/dec_neon.c",
            "${srcPath}/third_party/libwebp/dsp/enc.c",
            "${srcPath}/third_party/libwebp/dsp/enc_avx2.c",
            "${srcPath}/third_party/libwebp/dsp/enc_sse2.c",
            "${srcPath}/third_party/libwebp/dsp/lossless_sse2.c",
            "${srcPath}/third_party/libwebp/dsp/upsampling.c",
            "${srcPath}/third_party/libwebp/dsp/upsampling_sse2.c",
            "${srcPath}/third_party/libwebp/dsp/upsampling_neon.c",
            "${srcPath}/third_party/libwebp/dsp/yuv.c",
            "${srcPath}/third_party/libwebp/dsp/yuv_sse2.c",
            "${srcPath}/third_party/libwebp/dsp/lossless.c",
            "${srcPath}/third_party/libwebp/dsp/lossless_enc_neon.c",
            "${srcPath}/third_party/libwebp/dsp/lossless_neon.c",
            "${srcPath}/third_party/libwebp/enc/enc_alpha.c",
            "${srcPath}/third_party/libwebp/enc/enc_analysis.c",
            "${srcPath}/third_party/libwebp/enc/enc_backward_references.c",
            "${srcPath}/third_party/libwebp/enc/enc_config.c",
            "${srcPath}/third_party/libwebp/enc/enc_cost.c",
            "${srcPath}/third_party/libwebp/enc/enc_filter.c",
            "${srcPath}/third_party/libwebp/enc/enc_frame.c",
            "${srcPath}/third_party/libwebp/enc/enc_histogram.c",
            "${srcPath}/third_party/libwebp/enc/enc_iterator.c",
            "${srcPath}/third_party/libwebp/enc/enc_picture.c",
            "${srcPath}/third_party/libwebp/enc/enc_picture_csp.c",
            "${srcPath}/third_party/libwebp/enc/enc_picture_psnr.c",
            "${srcPath}/third_party/libwebp/enc/enc_picture_tools.c",
            "${srcPath}/third_party/libwebp/enc/enc_near_lossless.c",
            "${srcPath}/third_party/libwebp/enc/enc_quant.c",
            "${srcPath}/third_party/libwebp/enc/enc_syntax.c",
            "${srcPath}/third_party/libwebp/enc/enc_token.c",
            "${srcPath}/third_party/libwebp/enc/enc_tree.c",
            "${srcPath}/third_party/libwebp/enc/enc_vp8l.c",
            "${srcPath}/third_party/libwebp/enc/enc_webpenc.c",
            "${srcPath}/third_party/libwebp/utils/util_bit_reader.c",
            "${srcPath}/third_party/libwebp/utils/util_bit_writer.c",
            "${srcPath}/third_party/libwebp/utils/color_cache.c",
            "${srcPath}/third_party/libwebp/utils/util_filters.c",
            "${srcPath}/third_party/libwebp/utils/util_huffman.c",
            "${srcPath}/third_party/libwebp/utils/util_huffman_encode.c",
            "${srcPath}/third_party/libwebp/utils/quant_levels.c",
            "${srcPath}/third_party/libwebp/utils/quant_levels_dec.c",
            "${srcPath}/third_party/libwebp/utils/util_random.c",
            "${srcPath}/third_party/libwebp/utils/util_thread.c",
            "${srcPath}/third_party/libwebp/utils/util_rescaler.c",
            "${srcPath}/third_party/libwebp/utils/utils_webp.c",
            //libjpeg
            "${srcPath}/third_party/libjpeg_turbo/cdjpeg.c",
            "${srcPath}/third_party/libjpeg_turbo/wrtarga.c",
            "${srcPath}/third_party/libjpeg_turbo/wrrle.c",
            "${srcPath}/third_party/libjpeg_turbo/wrppm.c",
            "${srcPath}/third_party/libjpeg_turbo/wrjpgcom.c",
            "${srcPath}/third_party/libjpeg_turbo/wrgif.c",
            "${srcPath}/third_party/libjpeg_turbo/wrbmp.c",
            "${srcPath}/third_party/libjpeg_turbo/transupp.c",
            "${srcPath}/third_party/libjpeg_turbo/tjutil.c",
            "${srcPath}/third_party/libjpeg_turbo/rdtarga.c",
            "${srcPath}/third_party/libjpeg_turbo/rdswitch.c",
            "${srcPath}/third_party/libjpeg_turbo/rdrle.c",
            "${srcPath}/third_party/libjpeg_turbo/rdppm.c",
            "${srcPath}/third_party/libjpeg_turbo/rdjpgcom.c",
            "${srcPath}/third_party/libjpeg_turbo/rdgif.c",
            "${srcPath}/third_party/libjpeg_turbo/rdcolmap.c",
            "${srcPath}/third_party/libjpeg_turbo/rdbmp.c",
            "${srcPath}/third_party/libjpeg_turbo/jutils.c",
            "${srcPath}/third_party/libjpeg_turbo/jsimd_none.c",
            "${srcPath}/third_party/libjpeg_turbo/jquant2.c",
            "${srcPath}/third_party/libjpeg_turbo/jquant1.c",
            //"${srcPath}/third_party/libjpeg_turbo/jmemnobs.c",
            //"${srcPath}/third_party/libjpeg_turbo/jmemname.c",
            "${srcPath}/third_party/libjpeg_turbo/jmemmgr.c",
            "${srcPath}/third_party/libjpeg_turbo/jmemansi.c",
            "${srcPath}/third_party/libjpeg_turbo/jidctred.c",
            "${srcPath}/third_party/libjpeg_turbo/jidctint.c",
            "${srcPath}/third_party/libjpeg_turbo/jidctfst.c",
            "${srcPath}/third_party/libjpeg_turbo/jidctflt.c",
            "${srcPath}/third_party/libjpeg_turbo/jfdctint.c",
            "${srcPath}/third_party/libjpeg_turbo/jfdctfst.c",
            "${srcPath}/third_party/libjpeg_turbo/jfdctflt.c",
            "${srcPath}/third_party/libjpeg_turbo/jerror.c",
            "${srcPath}/third_party/libjpeg_turbo/jdtrans.c",
            "${srcPath}/third_party/libjpeg_turbo/jdsample.c",
            "${srcPath}/third_party/libjpeg_turbo/jdpostct.c",
            "${srcPath}/third_party/libjpeg_turbo/jdphuff.c",
            "${srcPath}/third_party/libjpeg_turbo/jdmerge.c",
            "${srcPath}/third_party/libjpeg_turbo/jdmaster.c",
            "${srcPath}/third_party/libjpeg_turbo/jdmarker.c",
            "${srcPath}/third_party/libjpeg_turbo/jdmainct.c",
            "${srcPath}/third_party/libjpeg_turbo/jdinput.c",
            "${srcPath}/third_party/libjpeg_turbo/jdicc.c",
            "${srcPath}/third_party/libjpeg_turbo/jdhuff.c",
            "${srcPath}/third_party/libjpeg_turbo/jddctmgr.c",
            "${srcPath}/third_party/libjpeg_turbo/jdcoefct.c",
            "${srcPath}/third_party/libjpeg_turbo/jdatasrc-tj.c",
            "${srcPath}/third_party/libjpeg_turbo/jdatasrc.c",
            "${srcPath}/third_party/libjpeg_turbo/jdatadst-tj.c",
            "${srcPath}/third_party/libjpeg_turbo/jdatadst.c",
            "${srcPath}/third_party/libjpeg_turbo/jdarith.c",
            "${srcPath}/third_party/libjpeg_turbo/jdapistd.c",
            "${srcPath}/third_party/libjpeg_turbo/jdapimin.c",
            "${srcPath}/third_party/libjpeg_turbo/jctrans.c",
            "${srcPath}/third_party/libjpeg_turbo/jcsample.c",
            "${srcPath}/third_party/libjpeg_turbo/jcprepct.c",
            "${srcPath}/third_party/libjpeg_turbo/jcphuff.c",
            "${srcPath}/third_party/libjpeg_turbo/jcparam.c",
            "${srcPath}/third_party/libjpeg_turbo/jcomapi.c",
            "${srcPath}/third_party/libjpeg_turbo/jcmaster.c",
            "${srcPath}/third_party/libjpeg_turbo/jcmarker.c",
            "${srcPath}/third_party/libjpeg_turbo/jcmainct.c",
            "${srcPath}/third_party/libjpeg_turbo/jcinit.c",
            "${srcPath}/third_party/libjpeg_turbo/jcicc.c",
            "${srcPath}/third_party/libjpeg_turbo/jchuff.c",
            "${srcPath}/third_party/libjpeg_turbo/jcdctmgr.c",
            "${srcPath}/third_party/libjpeg_turbo/jccolor.c",
            "${srcPath}/third_party/libjpeg_turbo/jccoefct.c",
            "${srcPath}/third_party/libjpeg_turbo/jcarith.c",
            "${srcPath}/third_party/libjpeg_turbo/jcapistd.c",
            "${srcPath}/third_party/libjpeg_turbo/jcapimin.c",
            "${srcPath}/third_party/libjpeg_turbo/jaricom.c",
            "${srcPath}/third_party/libjpeg_turbo/example.c",
            "${srcPath}/third_party/libjpeg_turbo/jdcolor.c",
            "${srcPath}/third_party/libjpeg_turbo/iccjpeg.c",

//            "${srcPath}/third_party/libjpeg/jaricom.c",
//            "${srcPath}/third_party/libjpeg/jcapimin.c",
//            "${srcPath}/third_party/libjpeg/jcapistd.c",
//            "${srcPath}/third_party/libjpeg/jcarith.c",
//            "${srcPath}/third_party/libjpeg/jccoefct.c",
//            "${srcPath}/third_party/libjpeg/jccolor.c",
//            "${srcPath}/third_party/libjpeg/jcdctmgr.c",
//            "${srcPath}/third_party/libjpeg/jchuff.c",
//            "${srcPath}/third_party/libjpeg/jcinit.c",
//            "${srcPath}/third_party/libjpeg/jcmainct.c",
//            "${srcPath}/third_party/libjpeg/jcmarker.c",
//            "${srcPath}/third_party/libjpeg/jcmaster.c",
//            "${srcPath}/third_party/libjpeg/jcomapi.c",
//            "${srcPath}/third_party/libjpeg/jcparam.c",
//            "${srcPath}/third_party/libjpeg/jcprepct.c",
//            "${srcPath}/third_party/libjpeg/jcsample.c",
//            "${srcPath}/third_party/libjpeg/jctrans.c",
//            "${srcPath}/third_party/libjpeg/jdapimin.c",
//            "${srcPath}/third_party/libjpeg/jdapistd.c",
//            "${srcPath}/third_party/libjpeg/jdarith.c",
//            "${srcPath}/third_party/libjpeg/jdatadst.c",
//            "${srcPath}/third_party/libjpeg/jdatasrc.c",
//            "${srcPath}/third_party/libjpeg/jdcoefct.c",
//            "${srcPath}/third_party/libjpeg/jdcolor.c",
//            "${srcPath}/third_party/libjpeg/jddctmgr.c",
//            "${srcPath}/third_party/libjpeg/jdhuff.c",
//            "${srcPath}/third_party/libjpeg/jdinput.c",
//            "${srcPath}/third_party/libjpeg/jdmainct.c",
//            "${srcPath}/third_party/libjpeg/jdmarker.c",
//            "${srcPath}/third_party/libjpeg/jdmaster.c",
//            "${srcPath}/third_party/libjpeg/jdmerge.c",
//            "${srcPath}/third_party/libjpeg/jdpostct.c",
//            "${srcPath}/third_party/libjpeg/jdsample.c",
//            "${srcPath}/third_party/libjpeg/jdtrans.c",
//            "${srcPath}/third_party/libjpeg/jerror.c",
//            "${srcPath}/third_party/libjpeg/jfdctflt.c",
//            "${srcPath}/third_party/libjpeg/jfdctfst.c",
//            "${srcPath}/third_party/libjpeg/jfdctint.c",
//            "${srcPath}/third_party/libjpeg/jidctflt.c",
//            "${srcPath}/third_party/libjpeg/jidctfst.c",
//            "${srcPath}/third_party/libjpeg/jidctint.c",
//            "${srcPath}/third_party/libjpeg/jmemmgr.c",
//            "${srcPath}/third_party/libjpeg/jmemnobs.c",
//            "${srcPath}/third_party/libjpeg/jquant1.c",
//            "${srcPath}/third_party/libjpeg/jquant2.c",
//            "${srcPath}/third_party/libjpeg/jutils.c",
//            "${srcPath}/third_party/libjpeg/iccjpeg.c",
            
            // ------ png:
            "${srcPath}/third_party/libpng/libpng.c",
            "${srcPath}/third_party/libpng/pngerror.c",
            "${srcPath}/third_party/libpng/pngget.c",
            "${srcPath}/third_party/libpng/pngmem.c",
            "${srcPath}/third_party/libpng/pngpread.c",
            "${srcPath}/third_party/libpng/pngread.c",
            "${srcPath}/third_party/libpng/pngrio.c",
            "${srcPath}/third_party/libpng/pngrtran.c",
            "${srcPath}/third_party/libpng/pngrutil.c",
            "${srcPath}/third_party/libpng/pngset.c",
            "${srcPath}/third_party/libpng/pngtrans.c",
            "${srcPath}/third_party/libpng/pngwio.c",
            "${srcPath}/third_party/libpng/pngwrite.c",
            "${srcPath}/third_party/libpng/pngwtran.c",
            "${srcPath}/third_party/libpng/pngwutil.c",
            // ---- xml
            "${srcPath}/third_party/libxml/src/c14n.c",
            "${srcPath}/third_party/libxml/src/catalog.c",
            "${srcPath}/third_party/libxml/src/chvalid.c",
            "${srcPath}/third_party/libxml/src/dict.c",
            "${srcPath}/third_party/libxml/src/DOCBparser.c",
            "${srcPath}/third_party/libxml/src/entities.c",
            "${srcPath}/third_party/libxml/src/error.c",
            "${srcPath}/third_party/libxml/src/globals.c",
            "${srcPath}/third_party/libxml/src/hash.c",
            "${srcPath}/third_party/libxml/src/legacy.c",
            "${srcPath}/third_party/libxml/src/list.c",
            "${srcPath}/third_party/libxml/src/parser.c",
            "${srcPath}/third_party/libxml/src/parserInternals.c",
            "${srcPath}/third_party/libxml/src/pattern.c",
            "${srcPath}/third_party/libxml/src/relaxng.c",
            "${srcPath}/third_party/libxml/src/schematron.c",
            "${srcPath}/third_party/libxml/src/threads.c",
            "${srcPath}/third_party/libxml/src/tree.c",
            "${srcPath}/third_party/libxml/src/trio.c",
            "${srcPath}/third_party/libxml/src/trionan.c",
            "${srcPath}/third_party/libxml/src/triostr.c",
            "${srcPath}/third_party/libxml/src/uri.c",
            "${srcPath}/third_party/libxml/src/valid.c",
            "${srcPath}/third_party/libxml/src/xinclude.c",
            "${srcPath}/third_party/libxml/src/xlink.c",
            "${srcPath}/third_party/libxml/src/xmllint.c",
            "${srcPath}/third_party/libxml/src/xmlmemory.c",
            "${srcPath}/third_party/libxml/src/xmlmodule.c",
            "${srcPath}/third_party/libxml/src/xmlreader.c",
            "${srcPath}/third_party/libxml/src/xmlsave.c",
            "${srcPath}/third_party/libxml/src/xmlstring.c",
            "${srcPath}/third_party/libxml/src/xmlunicode.c",
            "${srcPath}/third_party/libxml/src/xmlschemas.c",
            "${srcPath}/third_party/libxml/src/xmlschemastypes.c",
            "${srcPath}/third_party/libxml/src/xmlregexp.c",
            "${srcPath}/third_party/libxml/src/encoding.c",
            "${srcPath}/third_party/libxml/src/xmlIO.c",
            "${srcPath}/third_party/libxml/src/SAX2.c",
            "${srcPath}/third_party/libxml/src/SAX.c",
            "${srcPath}/third_party/libxslt/libxslt/extensions.c",
            "${srcPath}/third_party/libxslt/libxslt/extra.c",
            "${srcPath}/third_party/libxslt/libxslt/functions.c",
            "${srcPath}/third_party/libxslt/libxslt/imports.c",
            "${srcPath}/third_party/libxslt/libxslt/keys.c",
            "${srcPath}/third_party/libxslt/libxslt/namespaces.c",
            "${srcPath}/third_party/libxslt/libxslt/numbers.c",
            "${srcPath}/third_party/libxslt/libxslt/preproc.c",
            "${srcPath}/third_party/libxslt/libxslt/security.c",
            "${srcPath}/third_party/libxslt/libxslt/templates.c",
            "${srcPath}/third_party/libxslt/libxslt/transform.c",
            "${srcPath}/third_party/libxslt/libxslt/variables.c",
            "${srcPath}/third_party/libxslt/libxslt/xslt.c",
            "${srcPath}/third_party/libxslt/libxslt/xsltlocale.c",
            "${srcPath}/third_party/libxslt/libxslt/xsltutils.c",
            "${srcPath}/third_party/libxslt/libxslt/attributes.c",
            "${srcPath}/third_party/libxslt/libxslt/attrvt.c",
            "${srcPath}/third_party/libxslt/libxslt/documents.c",
            "${srcPath}/third_party/libxml/src/xpointer.c",
            "${srcPath}/third_party/libxml/src/xpath.c",
            "${srcPath}/third_party/libxslt/libxslt/xpath_pattern.c",
            "${srcPath}/third_party/libxml/src/HTMLtree.c",
            "${srcPath}/third_party/libxml/src/HTMLparser.c",
            // --- ots
            "${srcPath}/third_party/ots/src/vdmx.cc",
            "${srcPath}/third_party/ots/src/vhea.cc",
            "${srcPath}/third_party/ots/src/vmtx.cc",
            "${srcPath}/third_party/ots/src/vorg.cc",
            "${srcPath}/third_party/ots/src/cff.cc",
            "${srcPath}/third_party/ots/src/cff_type2_charstring.cc",
            "${srcPath}/third_party/ots/src/cmap.cc",
            "${srcPath}/third_party/ots/src/cvt.cc",
            "${srcPath}/third_party/ots/src/fpgm.cc",
            "${srcPath}/third_party/ots/src/gasp.cc",
            "${srcPath}/third_party/ots/src/gdef.cc",
            "${srcPath}/third_party/ots/src/glyf.cc",
            "${srcPath}/third_party/ots/src/gpos.cc",
            "${srcPath}/third_party/ots/src/gsub.cc",
            "${srcPath}/third_party/ots/src/hdmx.cc",
            "${srcPath}/third_party/ots/src/head.cc",
            "${srcPath}/third_party/ots/src/hhea.cc",
            "${srcPath}/third_party/ots/src/hmtx.cc",
            "${srcPath}/third_party/ots/src/kern.cc",
            "${srcPath}/third_party/ots/src/layout.cc",
            "${srcPath}/third_party/ots/src/loca.cc",
            "${srcPath}/third_party/ots/src/ltsh.cc",
            "${srcPath}/third_party/ots/src/math.cc",
            "${srcPath}/third_party/ots/src/maxp.cc",
            "${srcPath}/third_party/ots/src/metrics.cc",
            "${srcPath}/third_party/ots/src/name.cc",
            "${srcPath}/third_party/ots/src/os2.cc",
            "${srcPath}/third_party/ots/src/ots.cc",
            "${srcPath}/third_party/ots/src/post.cc",
            "${srcPath}/third_party/ots/src/prep.cc",
            "${srcPath}/third_party/brotli/dec/dictionary.c",
            "${srcPath}/third_party/brotli/dec/huffman.c",
            "${srcPath}/third_party/brotli/dec/state.c",
            "${srcPath}/third_party/brotli/dec/streams.c",
            "${srcPath}/third_party/brotli/dec/bit_reader.c",
            "${srcPath}/third_party/brotli/dec/decode.c",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/font_factory.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/tag.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/font.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/data/font_input_stream.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/data/font_output_stream.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/data/growable_memory_byte_array.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/data/memory_byte_array.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/data/readable_font_data.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/data/writable_font_data.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/data/byte_array.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/data/font_data.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/port/file_input_stream.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/port/lock.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/port/memory_input_stream.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/port/memory_output_stream.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/font_data_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/generic_table_builder.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/header.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/subtable.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/table_based_table_builder.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/byte_array_table_builder.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/index_sub_table_format1.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/index_sub_table_format2.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/index_sub_table_format3.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/index_sub_table_format4.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/index_sub_table_format5.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/simple_bitmap_glyph.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/small_glyph_metrics.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/big_glyph_metrics.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/bitmap_glyph.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/bitmap_glyph_info.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/bitmap_size_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/composite_bitmap_glyph.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/ebdt_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/eblc_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/ebsc_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/glyph_metrics.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/bitmap/index_sub_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/core/horizontal_device_metrics_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/core/horizontal_header_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/core/horizontal_metrics_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/core/maximum_profile_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/core/os2_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/core/cmap_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/core/font_header_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/truetype/loca_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/truetype/glyph_table.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sample/chromium/font_subsetter.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sample/chromium/subsetter_impl.cc",
            "${srcPath}/third_party/sfntly/src/cpp/src/sfntly/table/core/name_table.cc",
            "${srcPath}/third_party/ots/src/woff2.cc",
            // zip
            "${srcPath}/third_party/zlib/uncompr.c",
            "${srcPath}/third_party/zlib/x86.c",
            "${srcPath}/third_party/zlib/zutil.c",
            "${srcPath}/third_party/zlib/adler32.c",
            "${srcPath}/third_party/zlib/compress.c",
            "${srcPath}/third_party/zlib/crc32.c",
            "${srcPath}/third_party/zlib/deflate.c",
            "${srcPath}/third_party/zlib/gzclose.c",
            "${srcPath}/third_party/zlib/gzlib.c",
            "${srcPath}/third_party/zlib/gzread.c",
            "${srcPath}/third_party/zlib/gzwrite.c",
            "${srcPath}/third_party/zlib/infback.c",
            "${srcPath}/third_party/zlib/inffast.c",
            "${srcPath}/third_party/zlib/inflate.c",
            "${srcPath}/third_party/zlib/inftrees.c",
            "${srcPath}/third_party/zlib/trees.c",
            // harfbuzz
            "${srcPath}/third_party/harfbuzz-ng/src/hb-buffer-serialize.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-common.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-face.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-fallback-shape.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-font.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-font.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-layout.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-map.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape-complex-arabic.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape-complex-default.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape-complex-hangul.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape-complex-hebrew.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape-complex-indic.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape-complex-indic-table.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape-complex-myanmar.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape-complex-thai.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape-complex-tibetan.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape-complex-use.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape-complex-use-table.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape-fallback.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-shape-normalize.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-ot-tag.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-set.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-shape.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-shape-plan.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-shaper.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-warning.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-blob.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-buffer.cc",
            "${srcPath}/third_party/harfbuzz-ng/src/hb-unicode.cc",
            //--fontconfig
            "${srcPath}/third_party/fontconfig/src/src/fcatomic.c",
            "${srcPath}/third_party/fontconfig/src/src/fccache.c",
            "${srcPath}/third_party/fontconfig/src/src/fccfg.c",
            "${srcPath}/third_party/fontconfig/src/src/fccharset.c",
            "${srcPath}/third_party/fontconfig/src/src/fccompat.c",
            "${srcPath}/third_party/fontconfig/src/src/fcdbg.c",
            "${srcPath}/third_party/fontconfig/src/src/fcdefault.c",
            "${srcPath}/third_party/fontconfig/src/src/fcdir.c",
            "${srcPath}/third_party/fontconfig/src/src/fcformat.c",
            "${srcPath}/third_party/fontconfig/src/src/fcfreetype.c",
            "${srcPath}/third_party/fontconfig/src/src/fcfs.c",
            "${srcPath}/third_party/fontconfig/src/src/fchash.c",
            "${srcPath}/third_party/fontconfig/src/src/fcinit.c",
            "${srcPath}/third_party/fontconfig/src/src/fclang.c",
            "${srcPath}/third_party/fontconfig/src/src/fclist.c",
            "${srcPath}/third_party/fontconfig/src/src/fcmatch.c",
            "${srcPath}/third_party/fontconfig/src/src/fcmatrix.c",
            "${srcPath}/third_party/fontconfig/src/src/fcname.c",
            "${srcPath}/third_party/fontconfig/src/src/fcobjs.c",
            "${srcPath}/third_party/fontconfig/src/src/fcpat.c",
            "${srcPath}/third_party/fontconfig/src/src/fcptrlist.c",
            "${srcPath}/third_party/fontconfig/src/src/fcrange.c",
            "${srcPath}/third_party/fontconfig/src/src/fcserialize.c",
            "${srcPath}/third_party/fontconfig/src/src/fcstat.c",
            "${srcPath}/third_party/fontconfig/src/src/fcstr.c",
            "${srcPath}/third_party/fontconfig/src/src/fcweight.c",
            "${srcPath}/third_party/fontconfig/src/src/fcxml.c",
            "${srcPath}/third_party/fontconfig/src/src/ftglue.c"
        ],
        // 
        "cmd":[
            //"--target=x86_64-linux-guneabi",
            "-std=c++14",
            "-fms-extensions",
            "-D_GNU_SOURCE",
            "-DHAVE_CONFIG_H",
            "-DOS_LINUX_FOR_WIN",
            "-DSFNTLY_NO_EXCEPTION",
            "-DPNG_NO_CONFIG_H",
            "-DHAVE_OT",
            "-DHB_NO_MT",
            "-DHB_NO_UNICODE_FUNCS"
        ],
        "objdir":"${srcPath}/out/tmp/third_party_util/${targetDir}",
        "outdir":"${srcPath}/out/${targetDir}",
        "target":"libthird_party_util.a",
        "beginLibs":[
        ],
        "linkerCmd":[],
        "endLibs":[
        ],
        "linker":"${ndkBinPath}/ar.exe"
    }
}];

if ("aarch64-linux-guneabi" == constVal.target) { // ARM64
    //json[0].compile.cmd.push("-DWEBP_USE_NEON");
    json[0].compile.cmd.push("-DPNG_ARM_NEON_OPT");
    json[0].compile.cmd.push("-D__ARM_NEON");
}

buildCommonSetting(json);
