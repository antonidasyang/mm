/*
 * Copyright 2009 The Android Open Source Project
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
#if defined(SK_ARM_HAS_NEON)

#include "SkBitmapProcState.h"
#include "SkBitmapScaler.h"
#include "SkColorPriv.h"
#include "SkPaint.h"
#include "SkTypes.h"
#include "SkUtils.h"
#include "SkUtilsArm.h"

#include "SkConvolver.h"

void SkBitmapProcState::platformProcs() { }

///////////////////////////////////////////////////////////////////////////////

extern void platformConvolutionProcs_arm_neon(SkConvolutionProcs* procs);

void platformConvolutionProcs_arm(SkConvolutionProcs* procs)
{
}

void SkBitmapScaler::PlatformConvolutionProcs(SkConvolutionProcs* procs)
{
    SK_ARM_NEON_WRAP(platformConvolutionProcs_arm)
    (procs);
}
#endif // #if defined(SK_ARM_HAS_NEON)
