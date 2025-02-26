/*
 * Copyright 2006 The Android Open Source Project
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

#include "SkFontMgr_custom.h"
#include "SkFontDescriptor.h"
#include "SkFontHost_FreeType_common.h"
#include "SkFontMgr.h"
#include "SkFontStyle.h"
#include "SkOSFile.h"
#include "SkRefCnt.h"
#include "SkStream.h"
#include "SkString.h"
#include "SkTArray.h"
#include "SkTemplates.h"
#include "SkTypeface.h"
#include "SkTypefaceCache.h"
#include "SkTypes.h"
#include "SkString.h"

#include "third_party/fontconfig/src/fontconfig/fontconfig.h"
#include <limits>
#include <memory>

class SkData;

/** The base SkTypeface implementation for the custom font manager. */
class SkTypeface_Custom : public SkTypeface_FreeType {
public:
    SkTypeface_Custom(const SkFontStyle& style, bool isFixedPitch,
        bool sysFont, const SkString familyName, int index)
        : INHERITED(style, SkTypefaceCache::NewFontID(), isFixedPitch)
        , fIsSysFont(sysFont)
        , fFamilyName(familyName)
        , fIndex(index)
    {
    }

    bool isSysFont() const { return fIsSysFont; }

    const SkString* getFamilyName2() const
    {
        return &fFamilyName;
    }

protected:
    void onGetFamilyName(SkString* familyName) const override
    {
        *familyName = fFamilyName;
    }

    void onGetFontDescriptor(SkFontDescriptor* desc, bool* isLocal) const override
    {
        desc->setFamilyName(fFamilyName.c_str());
        *isLocal = !this->isSysFont();
    }

    int getIndex() const { return fIndex; }

private:
    const bool fIsSysFont;
    const SkString fFamilyName;
    const int fIndex;

    typedef SkTypeface_FreeType INHERITED;
};

/** The empty SkTypeface implementation for the custom font manager.
 *  Used as the last resort fallback typeface.
 */
class SkTypeface_Empty : public SkTypeface_Custom {
public:
    SkTypeface_Empty()
        : INHERITED(SkFontStyle(), false, true, SkString(), 0)
    {
    }

protected:
    SkStreamAsset* onOpenStream(int*) const override { return nullptr; }

private:
    typedef SkTypeface_Custom INHERITED;
};

/** The stream SkTypeface implementation for the custom font manager. */
class SkTypeface_Stream : public SkTypeface_Custom {
public:
    SkTypeface_Stream(std::unique_ptr<SkFontData> fontData,
        const SkFontStyle& style, bool isFixedPitch, bool sysFont,
        const SkString familyName)
        : INHERITED(style, isFixedPitch, sysFont, familyName, fontData->getIndex())
        , fData(std::move(fontData))
    {
    }

protected:
    SkStreamAsset* onOpenStream(int* ttcIndex) const override
    {
        *ttcIndex = fData->getIndex();
        return fData->duplicateStream();
    }

    SkFontData* onCreateFontData() const override
    {
        return new SkFontData(*fData.get());
    }

private:
    std::unique_ptr<const SkFontData> fData;

    typedef SkTypeface_Custom INHERITED;
};

/** The file SkTypeface implementation for the custom font manager. */
class SkTypeface_File : public SkTypeface_Custom {
public:
    SkTypeface_File(const SkFontStyle& style, bool isFixedPitch, bool sysFont,
        const SkString familyName, const char path[], int index)
        : INHERITED(style, isFixedPitch, sysFont, familyName, index)
        , fPath(path)
    {
    }

protected:
    SkStreamAsset* onOpenStream(int* ttcIndex) const override
    {
        *ttcIndex = this->getIndex();
        return SkStream::NewFromFile(fPath.c_str());
    }

private:
    SkString fPath;

    typedef SkTypeface_Custom INHERITED;
};

///////////////////////////////////////////////////////////////////////////////

/**
 *  SkFontStyleSet_Custom
 *
 *  This class is used by SkFontMgr_Custom to hold SkTypeface_Custom families.
 */
class SkFontStyleSet_Custom : public SkFontStyleSet {
public:
    explicit SkFontStyleSet_Custom(const SkString familyName)
        : fFamilyName(familyName)
    {
    }

    /** Should only be called during the inital build phase. */
    void appendTypeface(sk_sp<SkTypeface_Custom> typeface)
    {
        std::string output = typeface->getFamilyName2()->c_str();
        for (size_t i = 0; i < output.size(); ++i) {
            char c = output[i];
            if (c >= 'A' && c <= 'Z') {
                c = c + 'a' - 'A';
                output[i] = c;
            }
        }
        if (/*std::string::npos != output.find("simsun") ||*/ std::string::npos != output.find("song"))
            printf("SkFontStyleSet_Custom::appendTypeface: %s\n", typeface->getFamilyName2()->c_str());
        fStyles.emplace_back(std::move(typeface));
    }

    int count() override
    {
        return fStyles.count();
    }

    void getStyle(int index, SkFontStyle* style, SkString* name) override
    {
        SkASSERT(index < fStyles.count());
        if (style) {
            *style = fStyles[index]->fontStyle();
        }
        if (name) {
            name->reset();
        }
    }

    SkTypeface* createTypeface(int index) override
    {
        SkASSERT(index < fStyles.count());
        return SkRef(fStyles[index].get());
    }

    SkTypeface* matchStyle(const SkFontStyle& pattern) override
    {
        return this->matchStyleCSS3(pattern);
    }

    SkString getFamilyName() { return fFamilyName; }

private:
    SkTArray<sk_sp<SkTypeface_Custom>> fStyles;
    SkString fFamilyName;

    friend class SkFontMgr_Custom;
};

/**
 *  SkFontMgr_Custom
 *
 *  This class is essentially a collection of SkFontStyleSet_Custom,
 *  one SkFontStyleSet_Custom for each family. This class may be modified
 *  to load fonts from any source by changing the initialization.
 */
class SkFontMgr_Custom : public SkFontMgr {
public:
    typedef SkTArray<sk_sp<SkFontStyleSet_Custom>> Families;
    class SystemFontLoader {
    public:
        virtual ~SystemFontLoader() { }
        virtual void loadSystemFonts(const SkTypeface_FreeType::Scanner&, Families*) const = 0;
    };
    explicit SkFontMgr_Custom(const SystemFontLoader& loader)
        : fDefaultFamily(nullptr)
    {
        loader.loadSystemFonts(fScanner, &fFamilies);

        // Try to pick a default font.
        static const char* defaultNames[] = {
            "Song", "Arial", "Verdana", "Times New Roman", "Droid Sans", "Simsun", "Open Sans", nullptr
        };
        for (size_t i = 0; i < SK_ARRAY_COUNT(defaultNames); ++i) {
            sk_sp<SkFontStyleSet_Custom> set(this->onMatchFamily(defaultNames[i]));
            if (nullptr == set) {
                continue;
            }

            sk_sp<SkTypeface> tf(set->matchStyle(SkFontStyle(SkFontStyle::kNormal_Weight,
                SkFontStyle::kNormal_Width,
                SkFontStyle::kUpright_Slant)));
            if (nullptr == tf) {
                continue;
            }

            fDefaultFamily = set.get();
            break;
        }
        if (nullptr == fDefaultFamily) {
            fDefaultFamily = fFamilies[0].get();
        }
    }

protected:
    int onCountFamilies() const override
    {
        return fFamilies.count();
    }

    void onGetFamilyName(int index, SkString* familyName) const override
    {
        SkASSERT(index < fFamilies.count());
        familyName->set(fFamilies[index]->getFamilyName());
    }

    SkFontStyleSet_Custom* onCreateStyleSet(int index) const override
    {
        SkASSERT(index < fFamilies.count());
        return SkRef(fFamilies[index].get());
    }

    SkFontStyleSet_Custom* onMatchFamily(const char familyName[]) const override
    {
        for (int i = 0; i < fFamilies.count(); ++i) {
            if (fFamilies[i]->getFamilyName().equals(familyName))
                return SkRef(fFamilies[i].get());
        }
        return nullptr;
    }

    SkTypeface* onMatchFamilyStyle(const char familyName[],
        const SkFontStyle& fontStyle) const override
    {
        SkAutoTUnref<SkFontStyleSet> sset(this->matchFamily(familyName));
        return sset->matchStyle(fontStyle);
    }

    SkTypeface* onMatchFamilyStyleCharacter(const char familyName[], const SkFontStyle&,
        const char* bcp47[], int bcp47Count,
        SkUnichar character) const override
    {
        return nullptr;
    }

    SkTypeface* onMatchFaceStyle(const SkTypeface* familyMember,
        const SkFontStyle& fontStyle) const override
    {
        for (int i = 0; i < fFamilies.count(); ++i) {
            for (int j = 0; j < fFamilies[i]->fStyles.count(); ++j) {
                if (fFamilies[i]->fStyles[j].get() == familyMember) {
                    return fFamilies[i]->matchStyle(fontStyle);
                }
            }
        }
        return nullptr;
    }

    SkTypeface* onCreateFromData(SkData* data, int ttcIndex) const override
    {
        return this->createFromStream(new SkMemoryStream(data), ttcIndex);
    }

    SkTypeface* onCreateFromStream(SkStreamAsset* bareStream, int ttcIndex) const override
    {
        return this->createFromStream(bareStream, FontParameters().setCollectionIndex(ttcIndex));
    }

    SkTypeface* onCreateFromStream(SkStreamAsset* s, const FontParameters& params) const override
    {
        using Scanner = SkTypeface_FreeType::Scanner;
        SkAutoTDelete<SkStreamAsset> stream(s);
        bool isFixedPitch;
        SkFontStyle style;
        SkString name;
        Scanner::AxisDefinitions axisDefinitions;
        if (!fScanner.scanFont(stream, params.getCollectionIndex(), &name, &style, &isFixedPitch,
                &axisDefinitions)) {
            return nullptr;
        }

        int paramAxisCount;
        const FontParameters::Axis* paramAxes = params.getAxes(&paramAxisCount);
        SkAutoSTMalloc<4, SkFixed> axisValues(axisDefinitions.count());
        Scanner::computeAxisValues(axisDefinitions, paramAxes, paramAxisCount, axisValues, name);

        std::unique_ptr<SkFontData> data(new SkFontData(stream.release(),
            params.getCollectionIndex(),
            axisValues.get(), axisDefinitions.count()));
        return new SkTypeface_Stream(std::move(data), style, isFixedPitch, false, name);
    }

    SkTypeface* onCreateFromFontData(SkFontData* data) const override
    {
        bool isFixedPitch;
        SkFontStyle style;
        SkString name;
        if (!fScanner.scanFont(data->getStream(), data->getIndex(),
                &name, &style, &isFixedPitch, nullptr)) {
            return nullptr;
        }
        std::unique_ptr<SkFontData> unique_data(data);
        return new SkTypeface_Stream(std::move(unique_data), style, isFixedPitch, false, name);
    }

    SkTypeface* onCreateFromFile(const char path[], int ttcIndex) const override
    {
        SkAutoTDelete<SkStreamAsset> stream(SkStream::NewFromFile(path));
        return stream.get() ? this->createFromStream(stream.release(), ttcIndex) : nullptr;
    }

    SkTypeface* onLegacyCreateTypeface(const char familyName[], SkFontStyle style) const override
    {
        SkTypeface* tf = nullptr;

        if (familyName) {
            tf = this->onMatchFamilyStyle(familyName, style);
        }

        if (nullptr == tf) {
            tf = fDefaultFamily->matchStyle(style);
        }

        printf("SkFontMgr_Custom::onLegacyCreateTypeface: %p, %s\n", tf, familyName);
        return tf;
    }

private:
    Families fFamilies;
    SkFontStyleSet_Custom* fDefaultFamily;
    SkTypeface_FreeType::Scanner fScanner;
};

///////////////////////////////////////////////////////////////////////////////

// int main1()
// {
//     DIR* dirp = opendir("/usr/share/fonts/dejavu/");
//     if (!dirp) {
//         printf("open dir failed.\r\n");
//         return -1;
//     }
// 
//     printf("open dir: \n");
//     struct dirent* dirent;
//     while ((dirent = readdir(dirp))) {
//         if (!strcmp(dirent->d_name, ".") || !strcmp(dirent->d_name, ".."))
//             continue;
// 
//         std::string temp = "/usr/share/fonts/dejavu/";
//         temp += dirent->d_name;
// 
//         struct stat st;
//         int ret = stat(temp.c_str(), &st);
//         printf("stat: %s, %s\n", temp.c_str(), strerror(errno));
//     }
//     printf("\n");
// 
//     closedir(dirp);
// 
//     struct stat st;
//     int ret = stat("/usr/share/fonts/dejavu/DejaVuSerif.ttf", &st);
//     printf("error: %s with errno: %d\n", strerror(errno), errno);
//     DIR* dir = opendir("/usr/share/fonts/dejavu/");
// 
//     FILE* file = fopen("/usr/share/fonts/dejavu/DejaVuSerif.ttf", "r");
//     printf("wkexe main:::::::::::::::: %d, %p, %p\n", ret, dir, file);
// 
//     __debugbreak();
// }

class DirectorySystemFontLoader : public SkFontMgr_Custom::SystemFontLoader {
public:
    DirectorySystemFontLoader(const char* dir)
    {
        SkStrSplit(dir, "|", &fBaseDirectorys);
    }

    void loadOneDirSystemFonts(const SkString& dir, const SkTypeface_FreeType::Scanner& scanner, SkFontMgr_Custom::Families* families) const
    {
        load_directory_fonts(scanner, dir, ".ttf", families);
        load_directory_fonts(scanner, dir, ".ttc", families);
        load_directory_fonts(scanner, dir, ".otf", families);
        load_directory_fonts(scanner, dir, ".pfb", families);

        if (families->empty()) {
            SkFontStyleSet_Custom* family = new SkFontStyleSet_Custom(SkString());
            families->push_back().reset(family);
            family->appendTypeface(sk_make_sp<SkTypeface_Empty>());
        }
    }

    void loadSystemFonts(const SkTypeface_FreeType::Scanner& scanner, SkFontMgr_Custom::Families* families) const override
    {
        for (size_t i = 0; i < fBaseDirectorys.count(); ++i) {
            loadOneDirSystemFonts(fBaseDirectorys[i], scanner, families);
        }
    }

private:
    static SkFontStyleSet_Custom* find_family(SkFontMgr_Custom::Families& families,
        const char familyName[])
    {
        for (int i = 0; i < families.count(); ++i) {
            if (families[i]->getFamilyName().equals(familyName)) {
                return families[i].get();
            }
        }
        return nullptr;
    }

    static void load_directory_fonts(const SkTypeface_FreeType::Scanner& scanner,
        const SkString& directory, const char* suffix,
        SkFontMgr_Custom::Families* families)
    {
        SkOSFile::Iter iter(directory.c_str(), suffix);
        SkString name;
        //printf("load_directory_fonts 0: %s, %s\n", directory.c_str(), suffix);

        while (iter.next(&name, false)) {
            SkString filename(SkOSPath::Join(directory.c_str(), name.c_str()));
            //printf("load_directory_fonts 1: %s\n", filename.c_str());
            SkAutoTDelete<SkStream> stream(SkStream::NewFromFile(filename.c_str()));
            if (!stream.get()) {
                //SkDebugf("---- failed to open <%s>\n", filename.c_str());
                continue;
            }

            int numFaces;
            if (!scanner.recognizedFont(stream, &numFaces)) {
                //SkDebugf("---- failed to open <%s> as a font\n", filename.c_str());
                continue;
            }

            for (int faceIndex = 0; faceIndex < numFaces; ++faceIndex) {
                bool isFixedPitch;
                SkString realname;
                SkFontStyle style = SkFontStyle(); // avoid uninitialized warning
                if (!scanner.scanFont(stream, faceIndex, &realname, &style, &isFixedPitch, nullptr)) {
                    //SkDebugf("---- failed to open <%s> <%d> as a font\n", filename.c_str(), faceIndex);
                    continue;
                }                

                SkFontStyleSet_Custom* addTo = find_family(*families, realname.c_str());
                //printf("load_directory_fonts: %p, %s\n", addTo, realname.c_str());
                if (nullptr == addTo) {
                    addTo = new SkFontStyleSet_Custom(realname);
                    families->push_back().reset(addTo);
                }
                addTo->appendTypeface(sk_make_sp<SkTypeface_File>(style, isFixedPitch, true,
                    realname, filename.c_str(),
                    faceIndex));
            }
        }

        //printf("load_directory_fonts 2: %s\n", directory.c_str());
        SkOSFile::Iter dirIter(directory.c_str());
        while (dirIter.next(&name, true)) {
            if (name.startsWith(".")) {
                continue;
            }
            SkString dirname(SkOSPath::Join(directory.c_str(), name.c_str()));
            //printf("load_directory_fonts 3: %s\n", dirname.c_str());
            load_directory_fonts(scanner, dirname, suffix, families);
        }
        //printf("load_directory_fonts end\n");
    }

    SkTArray<SkString> fBaseDirectorys;
};

void getFontList3()
{
    FcInit();
    FcConfig* config = FcInitLoadConfigAndFonts();
    FcPattern* pat = FcPatternCreate();
    FcObjectSet* os = FcObjectSetBuild(FC_FAMILY, FC_STYLE, FC_LANG, FC_FILE, (char*)0);
    FcFontSet* fs = FcFontList(config, pat, os);

    printf("Total matching fonts: %d\n", fs->nfont);
    for (int i = 0; fs && i < fs->nfont; ++i) {
        FcPattern* font = fs->fonts[i];
        FcChar8* file, * style, * family;
        if (FcPatternGetString(font, FC_FILE, 0, &file) == FcResultMatch &&
            FcPatternGetString(font, FC_FAMILY, 0, &family) == FcResultMatch &&
            FcPatternGetString(font, FC_STYLE, 0, &style) == FcResultMatch) {
            printf("Filename: %s (family %s, style %s)\n", file, family, style);
        }
    }
    if (fs) FcFontSetDestroy(fs);
}

void getFontList2()
{
    FcPattern* pat;
    FcFontSet* fs;
    FcObjectSet* os;
    FcChar8* s, * file;
    FcConfig* config;
    FcBool result;
    int i;

    result = FcInit();
    config = FcConfigGetCurrent();
    FcConfigSetRescanInterval(config, 0);

    // show the fonts (debugging)
    pat = FcPatternCreate();
    os = FcObjectSetBuild(FC_FAMILY, FC_STYLE, FC_LANG, (char*)0);
    fs = FcFontList(config, pat, os);

    printf("Total fonts: %d\n", fs->nfont);

    for (i = 0; fs && i < fs->nfont; i++) {
        FcPattern* font = fs->fonts[i];//FcFontSetFont(fs, i);
        //FcPatternPrint(font);
        FcChar8* str = FcNameUnparse(font);
        if (FcPatternGetString(font, FC_FILE, 0, &file) == FcResultMatch) {
            printf("Filename: [%s]\n", file);
        }

        FcChar8* lang;
        if (FcPatternGetString(font, FC_LANG, 0, &lang) == FcResultMatch)
            printf("(lang: %s)\n", lang);

        printf("Font: [%s]\n", str);
        free(str);
    }
    if (fs)
        FcFontSetDestroy(fs);
}

void getFontList()
{
    const FcChar8* format = NULL;
    int			nfont = 0;
    int			i;
    FcObjectSet* os = 0;
    FcFontSet* fs;
    FcPattern* pat;

    FcInit();
    FcConfig* fc = FcInitLoadConfigAndFonts();
    pat = FcNameParse((FcChar8*)"lang=zh");

    if (!pat) {
        printf("Unable to parse the pattern\n");
        return;
    }

    os = FcObjectSetBuild(FC_FAMILY, FC_STYLE, FC_FILE, (char*)0);
    format = (const FcChar8*)"%{=fclist}\n";

    fs = FcFontList(fc, pat, os);
    if (os)
        FcObjectSetDestroy(os);
    if (pat)
        FcPatternDestroy(pat);

    printf("getFontList: %d %d\n", fs->nfont, fs->sfont);

    int	j;
    for (j = 0; j < fs->nfont; j++) {
        FcChar8* s;
        s = FcPatternFormat(fs->fonts[j], format);
        if (s) {
            printf("%s", s);
            FcStrFree(s);
        }
    }

    if (fs) {
        nfont = fs->nfont;
        FcFontSetDestroy(fs);
    }

    FcFini();

    __debugbreak();
}


SK_API SkFontMgr* SkFontMgr_New_Custom_Directory(const char* dir)
{
    //getFontList2();
    return new SkFontMgr_Custom(DirectorySystemFontLoader(dir));
}

///////////////////////////////////////////////////////////////////////////////

struct SkEmbeddedResource {
    const uint8_t* data;
    size_t size;
};
struct SkEmbeddedResourceHeader {
    const SkEmbeddedResource* entries;
    int count;
};

class EmbeddedSystemFontLoader : public SkFontMgr_Custom::SystemFontLoader {
public:
    EmbeddedSystemFontLoader(const SkEmbeddedResourceHeader* header)
        : fHeader(header)
    {
    }

    void loadSystemFonts(const SkTypeface_FreeType::Scanner& scanner,
        SkFontMgr_Custom::Families* families) const override
    {
        for (int i = 0; i < fHeader->count; ++i) {
            const SkEmbeddedResource& fontEntry = fHeader->entries[i];
            load_embedded_font(scanner, fontEntry.data, fontEntry.size, i, families);
        }

        if (families->empty()) {
            SkFontStyleSet_Custom* family = new SkFontStyleSet_Custom(SkString());
            families->push_back().reset(family);
            family->appendTypeface(sk_make_sp<SkTypeface_Empty>());
        }
    }

private:
    static SkFontStyleSet_Custom* find_family(SkFontMgr_Custom::Families& families,
        const char familyName[])
    {
        for (int i = 0; i < families.count(); ++i) {
            if (families[i]->getFamilyName().equals(familyName)) {
                return families[i].get();
            }
        }
        return nullptr;
    }

    static void load_embedded_font(const SkTypeface_FreeType::Scanner& scanner,
        const uint8_t* data, size_t size, int index,
        SkFontMgr_Custom::Families* families)
    {
        SkAutoTDelete<SkMemoryStream> stream(new SkMemoryStream(data, size, false));

        int numFaces;
        if (!scanner.recognizedFont(stream, &numFaces)) {
            SkDebugf("---- failed to open <%d> as a font\n", index);
            return;
        }

        for (int faceIndex = 0; faceIndex < numFaces; ++faceIndex) {
            bool isFixedPitch;
            SkString realname;
            SkFontStyle style = SkFontStyle(); // avoid uninitialized warning
            if (!scanner.scanFont(stream, faceIndex, &realname, &style, &isFixedPitch, nullptr)) {
                SkDebugf("---- failed to open <%d> <%d> as a font\n", index, faceIndex);
                return;
            }

            SkFontStyleSet_Custom* addTo = find_family(*families, realname.c_str());
            if (nullptr == addTo) {
                addTo = new SkFontStyleSet_Custom(realname);
                families->push_back().reset(addTo);
            }
            std::unique_ptr<SkFontData> data(
                new SkFontData(stream.release(), faceIndex, nullptr, 0));
            addTo->appendTypeface(sk_make_sp<SkTypeface_Stream>(std::move(data),
                style, isFixedPitch,
                true, realname));
        }
    }

    const SkEmbeddedResourceHeader* fHeader;
};

SkFontMgr* SkFontMgr_New_Custom_Embedded(const SkEmbeddedResourceHeader* header)
{
    return new SkFontMgr_Custom(EmbeddedSystemFontLoader(header));
}

///////////////////////////////////////////////////////////////////////////////

class EmptyFontLoader : public SkFontMgr_Custom::SystemFontLoader {
public:
    EmptyFontLoader() { }

    void loadSystemFonts(const SkTypeface_FreeType::Scanner& scanner,
        SkFontMgr_Custom::Families* families) const override
    {
        SkFontStyleSet_Custom* family = new SkFontStyleSet_Custom(SkString());
        families->push_back().reset(family);
        family->appendTypeface(sk_make_sp<SkTypeface_Empty>());
    }
};

SK_API SkFontMgr* SkFontMgr_New_Custom_Empty()
{
    return new SkFontMgr_Custom(EmptyFontLoader());
}
