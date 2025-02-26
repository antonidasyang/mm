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
//            "${sdkPath}/sysroot/usr/include",
//            "${sdkPath}/sysroot/usr/",
//            "${sdkPath}/sysroot/usr/include/linux",
            ...constVal.includePaths,
            "${srcPath}/linux",
            "${srcPath}/gen/v8_7_5",
            "${srcPath}/gen/v8_7_5/include",
            "${srcPath}/v8_7_5",
            "${srcPath}/v8_7_5/include",
            "${srcPath}",
        ],
        "prebuildSrc":[
            //"${srcPath}/gen/v8_7_5/torque-generated/builtins-array-from-dsl-gen-x64.cc",
            //"${srcPath}/v8_7_5/src/builtins/generate-bytecodes-builtins-list.cc",
            "${srcPath}/v8_7_5/src/api.cc",
            //"${srcPath}/v8_7_5/src/trap-handler/handler-inside-posix.cc",
            //"${srcPath}/v8_7_5/src/trap-handler/handler-shared.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-compiler.cc",
            "${srcPath}/v8_7_5/src/execution.cc",
        ],
        "src":[
            "${srcPath}/v8_7_5/src/objects/managed.cc",
            "${srcPath}/v8_7_5/src/objects/map.cc",
            "${srcPath}/v8_7_5/src/objects/module.cc",
            "${srcPath}/v8_7_5/src/objects/ordered-hash-table.cc",
            "${srcPath}/v8_7_5/src/objects/scope-info.cc",
            "${srcPath}/v8_7_5/src/objects/stack-frame-info.cc",
            "${srcPath}/v8_7_5/src/objects/string.cc",
            "${srcPath}/v8_7_5/src/objects/string-comparator.cc",
            "${srcPath}/v8_7_5/src/objects/template-objects.cc",
            "${srcPath}/v8_7_5/src/objects/bigint.cc",
            "${srcPath}/v8_7_5/src/objects/code.cc",
            "${srcPath}/v8_7_5/src/objects/debug-objects.cc",
            "${srcPath}/v8_7_5/src/objects/embedder-data-array.cc",
            "${srcPath}/v8_7_5/src/objects/js-array-buffer.cc",
            "${srcPath}/v8_7_5/src/objects/js-objects.cc",
            "${srcPath}/v8_7_5/src/parsing/expression-scope-reparenter.cc",
            "${srcPath}/v8_7_5/src/parsing/func-name-inferrer.cc",
            "${srcPath}/v8_7_5/src/parsing/parse-info.cc",
            "${srcPath}/v8_7_5/src/parsing/parser.cc",
            "${srcPath}/v8_7_5/src/parsing/parsing.cc",
            "${srcPath}/v8_7_5/src/parsing/preparse-data.cc",
            "${srcPath}/v8_7_5/src/parsing/preparser.cc",
            "${srcPath}/v8_7_5/src/parsing/rewriter.cc",
            "${srcPath}/v8_7_5/src/parsing/scanner.cc",
            "${srcPath}/v8_7_5/src/parsing/scanner-character-streams.cc",
            "${srcPath}/v8_7_5/src/parsing/token.cc",
            "${srcPath}/v8_7_5/src/zone/zone-segment.cc",
            "${srcPath}/v8_7_5/src/zone/accounting-allocator.cc",
            "${srcPath}/v8_7_5/src/zone/zone.cc",
            "${srcPath}/v8_7_5/src/wasm/graph-builder-interface.cc",
            "${srcPath}/v8_7_5/src/wasm/jump-table-assembler.cc",
            "${srcPath}/v8_7_5/src/wasm/local-decl-encoder.cc",
            "${srcPath}/v8_7_5/src/wasm/memory-tracing.cc",
            "${srcPath}/v8_7_5/src/wasm/module-compiler.cc",
            "${srcPath}/v8_7_5/src/wasm/module-decoder.cc",
            "${srcPath}/v8_7_5/src/wasm/module-instantiate.cc",
            "${srcPath}/v8_7_5/src/wasm/signature-map.cc",
            "${srcPath}/v8_7_5/src/wasm/streaming-decoder.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-code-manager.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-debug.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-engine.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-external-refs.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-features.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-import-wrapper-cache.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-interpreter.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-js.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-memory.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-module.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-module-builder.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-objects.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-opcodes.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-result.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-serialization.cc",
            "${srcPath}/v8_7_5/src/wasm/wasm-text.cc",
            "${srcPath}/v8_7_5/src/wasm/function-body-decoder.cc",
            "${srcPath}/v8_7_5/src/wasm/function-compiler.cc",
            "${srcPath}/v8_7_5/src/wasm/baseline/liftoff-compiler.cc",
            "${srcPath}/v8_7_5/src/wasm/baseline/liftoff-assembler.cc",
            "${srcPath}/v8_7_5/src/trap-handler/handler-inside-posix.cc",
            "${srcPath}/v8_7_5/src/trap-handler/handler-outside.cc",
            "${srcPath}/v8_7_5/src/trap-handler/handler-shared.cc",
            "${srcPath}/v8_7_5/src/trap-handler/handler-inside.cc",
            "${srcPath}/v8_7_5/src/tracing/tracing-category-observer.cc",
            "${srcPath}/v8_7_5/src/tracing/traced-value.cc",
            "${srcPath}/v8_7_5/src/tracing/trace-event.cc",
            "${srcPath}/v8_7_5/src/torque/declarable.cc",
            "${srcPath}/v8_7_5/src/torque/declarations.cc",
            "${srcPath}/v8_7_5/src/torque/declaration-visitor.cc",
            "${srcPath}/v8_7_5/src/torque/earley-parser.cc",
            "${srcPath}/v8_7_5/src/torque/file-visitor.cc",
            "${srcPath}/v8_7_5/src/torque/implementation-visitor.cc",
            "${srcPath}/v8_7_5/src/torque/instructions.cc",
            "${srcPath}/v8_7_5/src/torque/server-data.cc",
            "${srcPath}/v8_7_5/src/torque/source-positions.cc",
            "${srcPath}/v8_7_5/src/torque/torque-compiler.cc",
            "${srcPath}/v8_7_5/src/torque/torque-parser.cc",
            "${srcPath}/v8_7_5/src/torque/type-oracle.cc",
            "${srcPath}/v8_7_5/src/torque/types-torque.cc",
            "${srcPath}/v8_7_5/src/torque/utils-torque.cc",
            "${srcPath}/v8_7_5/src/torque/cfg.cc",
            "${srcPath}/v8_7_5/src/torque/csa-generator.cc",
            "${srcPath}/v8_7_5/src/torque/ls/message-handler.cc",
            "${srcPath}/v8_7_5/src/torque/ls/json.cc",
            "${srcPath}/v8_7_5/src/torque/ls/json-parser-torque.cc",
            "${srcPath}/v8_7_5/src/third_party/vtune/jitprofiling.cc",
            "${srcPath}/v8_7_5/src/third_party/vtune/vtune-jit.cc",
            "${srcPath}/v8_7_5/src/third_party/siphash/halfsiphash.cc",
            "${srcPath}/v8_7_5/src/snapshot/deserializer-allocator.cc",
            "${srcPath}/v8_7_5/src/snapshot/embedded-data.cc",
            "${srcPath}/v8_7_5/src/snapshot/embedded-empty.cc",
            "${srcPath}/v8_7_5/src/snapshot/embedded-file-writer.cc",
            "${srcPath}/v8_7_5/src/snapshot/natives-common.cc",
            "${srcPath}/v8_7_5/src/snapshot/object-deserializer.cc",
            "${srcPath}/v8_7_5/src/snapshot/partial-deserializer.cc",
            "${srcPath}/v8_7_5/src/snapshot/partial-serializer.cc",
            "${srcPath}/v8_7_5/src/snapshot/read-only-deserializer.cc",
            "${srcPath}/v8_7_5/src/snapshot/read-only-serializer.cc",
            "${srcPath}/v8_7_5/src/snapshot/roots-serializer.cc",
            "${srcPath}/v8_7_5/src/snapshot/serializer.cc",
            "${srcPath}/v8_7_5/src/snapshot/serializer-allocator.cc",
            "${srcPath}/v8_7_5/src/snapshot/serializer-common.cc",
            "${srcPath}/v8_7_5/src/snapshot/snapshot-common.cc",
            "${srcPath}/v8_7_5/src/snapshot/snapshot-empty.cc",
            "${srcPath}/v8_7_5/src/snapshot/snapshot-source-sink.cc",
            "${srcPath}/v8_7_5/src/snapshot/startup-deserializer.cc",
            "${srcPath}/v8_7_5/src/snapshot/startup-serializer.cc",
            "${srcPath}/v8_7_5/src/snapshot/code-serializer.cc",
            "${srcPath}/v8_7_5/src/snapshot/deserializer.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-classes.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-collections.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-compiler.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-date.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-debug.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-forin.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-function.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-futex.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-generator.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-internal.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-interpreter.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-literals.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-module.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-numbers.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-object.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-operators.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-promise.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-proxy.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-regexp.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-scopes.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-strings.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-symbol.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-test.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-typedarray.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-wasm.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-weak-refs.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-array.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-atomics.cc",
            "${srcPath}/v8_7_5/src/runtime/runtime-bigint.cc",
            "${srcPath}/v8_7_5/src/regexp/x64/regexp-macro-assembler-x64.cc",
            "${srcPath}/v8_7_5/src/regexp/arm64/regexp-macro-assembler-arm64.cc",
            "${srcPath}/v8_7_5/src/regexp/regexp-macro-assembler-tracer.cc",
            "${srcPath}/v8_7_5/src/regexp/regexp-parser.cc",
            "${srcPath}/v8_7_5/src/regexp/regexp-stack.cc",
            "${srcPath}/v8_7_5/src/regexp/regexp-utils.cc",
            "${srcPath}/v8_7_5/src/regexp/interpreter-irregexp.cc",
            "${srcPath}/v8_7_5/src/regexp/jsregexp.cc",
            "${srcPath}/v8_7_5/src/regexp/property-sequences.cc",
            "${srcPath}/v8_7_5/src/regexp/regexp-ast.cc",
            "${srcPath}/v8_7_5/src/regexp/regexp-macro-assembler.cc",
            "${srcPath}/v8_7_5/src/regexp/regexp-macro-assembler-irregexp.cc",
            "${srcPath}/v8_7_5/src/regexp/ia32/regexp-macro-assembler-ia32.cc",
            "${srcPath}/v8_7_5/src/profiler/cpu-profiler.cc",
            "${srcPath}/v8_7_5/src/profiler/heap-profiler.cc",
            "${srcPath}/v8_7_5/src/profiler/heap-snapshot-generator.cc",
            "${srcPath}/v8_7_5/src/profiler/profile-generator.cc",
            "${srcPath}/v8_7_5/src/profiler/profiler-listener.cc",
            "${srcPath}/v8_7_5/src/profiler/sampling-heap-profiler.cc",
            "${srcPath}/v8_7_5/src/profiler/strings-storage.cc",
            "${srcPath}/v8_7_5/src/profiler/tick-sample.cc",
            "${srcPath}/v8_7_5/src/profiler/tracing-cpu-profiler.cc",
            "${srcPath}/v8_7_5/src/profiler/allocation-tracker.cc",
            "${srcPath}/gen/v8_7_5/src/inspector/protocol/ConsoleV8.cpp",
            "${srcPath}/gen/v8_7_5/src/inspector/protocol/DebuggerV8.cpp",
            "${srcPath}/gen/v8_7_5/src/inspector/protocol/HeapProfilerV8.cpp",
            "${srcPath}/gen/v8_7_5/src/inspector/protocol/ProfilerV8.cpp",
            "${srcPath}/gen/v8_7_5/src/inspector/protocol/ProtocolV8.cpp",
            "${srcPath}/gen/v8_7_5/src/inspector/protocol/RuntimeV8.cpp",
            "${srcPath}/gen/v8_7_5/src/inspector/protocol/SchemaV8.cpp",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-arguments-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-copywithin-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-filter-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-find-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-findindex-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-foreach-from-dsl-gen.cc",
            //"${srcPath}/gen/v8_7_5/torque-generated/builtins-array-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-from-dsl-gen-x64.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-join-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-lastindexof-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-map-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-of-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-reverse-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-shift-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-slice-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-splice-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-array-unshift-from-dsl-gen.cc",
            //"${srcPath}/gen/v8_7_5/torque-generated/builtins-base-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-base-from-dsl-gen-x64.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-collections-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-data-view-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-extras-utils-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-growable-fixed-array-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-iterator-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-object-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-proxy-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-regexp-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-regexp-replace-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-string-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-string-html-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-string-repeat-from-dsl-gen.cc",
            //"${srcPath}/gen/v8_7_5/torque-generated/builtins-test-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-test-from-dsl-gen-x64.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-typed-array-createtypedarray-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-typed-array-every-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-typed-array-filter-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-typed-array-find-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-typed-array-findindex-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-typed-array-foreach-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-typed-array-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-typed-array-reduce-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-typed-array-reduceright-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-typed-array-slice-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-typed-array-some-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/builtins-typed-array-subarray-from-dsl-gen.cc",
            "${srcPath}/gen/v8_7_5/torque-generated/objects-printer-from-dsl.cc",
            "${srcPath}/gen/v8_7_5/extras-libraries.cc",
            "${srcPath}/v8_7_5/src/address-map.cc",
            "${srcPath}/v8_7_5/src/allocation.cc",
            "${srcPath}/v8_7_5/src/api.cc",
            "${srcPath}/v8_7_5/src/api-arguments.cc",
            "${srcPath}/v8_7_5/src/api-natives.cc",
            "${srcPath}/v8_7_5/src/arguments.cc",
            "${srcPath}/v8_7_5/src/assembler.cc",
            "${srcPath}/v8_7_5/src/assert-scope.cc",
            "${srcPath}/v8_7_5/src/async-hooks-wrapper.cc",
            "${srcPath}/v8_7_5/src/bailout-reason.cc",
            "${srcPath}/v8_7_5/src/basic-block-profiler.cc",
            "${srcPath}/v8_7_5/src/bignum.cc",
            "${srcPath}/v8_7_5/src/bignum-dtoa.cc",
            "${srcPath}/v8_7_5/src/bit-vector.cc",
            "${srcPath}/v8_7_5/src/bootstrapper.cc",
            "${srcPath}/v8_7_5/src/cached-powers.cc",
            "${srcPath}/v8_7_5/src/cancelable-task.cc",
            "${srcPath}/v8_7_5/src/code-comments.cc",
            "${srcPath}/v8_7_5/src/code-desc.cc",
            "${srcPath}/v8_7_5/src/code-factory.cc",
            "${srcPath}/v8_7_5/src/code-reference.cc",
            "${srcPath}/v8_7_5/src/code-stub-assembler.cc",
            "${srcPath}/v8_7_5/src/compilation-cache.cc",
            "${srcPath}/v8_7_5/src/compilation-statistics.cc",
            "${srcPath}/v8_7_5/src/compiler.cc",
            "${srcPath}/v8_7_5/src/constant-pool.cc",
            "${srcPath}/v8_7_5/src/contexts.cc",
            "${srcPath}/v8_7_5/src/conversions.cc",
            "${srcPath}/v8_7_5/src/counters.cc",
            "${srcPath}/v8_7_5/src/d8-console.cc",
            "${srcPath}/v8_7_5/src/d8-js.cc",
            "${srcPath}/v8_7_5/src/d8-platforms.cc",
            "${srcPath}/v8_7_5/src/d8-windows.cc",
            "${srcPath}/v8_7_5/src/date.cc",
            "${srcPath}/v8_7_5/src/dateparser.cc",
            "${srcPath}/v8_7_5/src/deoptimizer.cc",
            "${srcPath}/v8_7_5/src/deoptimize-reason.cc",
            "${srcPath}/v8_7_5/src/detachable-vector.cc",
            "${srcPath}/v8_7_5/src/disassembler.cc",
            "${srcPath}/v8_7_5/src/diy-fp.cc",
            "${srcPath}/v8_7_5/src/dtoa.cc",
            "${srcPath}/v8_7_5/src/eh-frame.cc",
            "${srcPath}/v8_7_5/src/elements.cc",
            "${srcPath}/v8_7_5/src/elements-kind.cc",
            "${srcPath}/v8_7_5/src/execution.cc",
            "${srcPath}/v8_7_5/src/external-reference.cc",
            "${srcPath}/v8_7_5/src/external-reference-table.cc",
            "${srcPath}/v8_7_5/src/fast-dtoa.cc",
            "${srcPath}/v8_7_5/src/feedback-vector.cc",
            "${srcPath}/v8_7_5/src/field-type.cc",
            "${srcPath}/v8_7_5/src/fixed-dtoa.cc",
            "${srcPath}/v8_7_5/src/flags.cc",
            "${srcPath}/v8_7_5/src/flush-instruction-cache.cc",
            "${srcPath}/v8_7_5/src/frames.cc",
            "${srcPath}/v8_7_5/src/futex-emulation.cc",
            "${srcPath}/v8_7_5/src/gdb-jit.cc",
            "${srcPath}/v8_7_5/src/global-handles.cc",
            "${srcPath}/v8_7_5/src/handler-table.cc",
            "${srcPath}/v8_7_5/src/handles.cc",
            "${srcPath}/v8_7_5/src/icu_util.cc",
            "${srcPath}/v8_7_5/src/identity-map.cc",
            "${srcPath}/v8_7_5/src/interface-descriptors.cc",
            "${srcPath}/v8_7_5/src/isolate.cc",
            "${srcPath}/v8_7_5/src/isolate-allocator.cc",
            "${srcPath}/v8_7_5/src/json-parser.cc",
            "${srcPath}/v8_7_5/src/json-stringifier.cc",
            "${srcPath}/v8_7_5/src/keys.cc",
            "${srcPath}/v8_7_5/src/layout-descriptor.cc",
            "${srcPath}/v8_7_5/src/log.cc",
            "${srcPath}/v8_7_5/src/log-utils.cc",
            "${srcPath}/v8_7_5/src/lookup.cc",
            "${srcPath}/v8_7_5/src/lookup-cache.cc",
            "${srcPath}/v8_7_5/src/machine-type.cc",
            "${srcPath}/v8_7_5/src/map-updater.cc",
            "${srcPath}/v8_7_5/src/math-random.cc",
            "${srcPath}/v8_7_5/src/memcopy.cc",
            "${srcPath}/v8_7_5/src/messages.cc",
            "${srcPath}/v8_7_5/src/microtask-queue.cc",
            "${srcPath}/v8_7_5/src/objects.cc",
            "${srcPath}/v8_7_5/src/objects-debug.cc",
            "${srcPath}/v8_7_5/src/objects-printer.cc",
            "${srcPath}/v8_7_5/src/optimized-compilation-info.cc",
            "${srcPath}/v8_7_5/src/ostreams.cc",
            "${srcPath}/v8_7_5/src/pending-compilation-error-handler.cc",
            "${srcPath}/v8_7_5/src/perf-jit.cc",
            "${srcPath}/v8_7_5/src/property.cc",
            "${srcPath}/v8_7_5/src/property-descriptor.cc",
            "${srcPath}/v8_7_5/src/register-configuration.cc",
            "${srcPath}/v8_7_5/src/reloc-info.cc",
            "${srcPath}/v8_7_5/src/roots.cc",
            "${srcPath}/v8_7_5/src/runtime-profiler.cc",
            "${srcPath}/v8_7_5/src/safepoint-table.cc",
            "${srcPath}/v8_7_5/src/setup-isolate-full.cc",
            "${srcPath}/v8_7_5/src/simulator-base.cc",
            "${srcPath}/v8_7_5/src/source-position.cc",
            "${srcPath}/v8_7_5/src/source-position-table.cc",
            "${srcPath}/v8_7_5/src/startup-data-util.cc",
            "${srcPath}/v8_7_5/src/string-builder.cc",
            "${srcPath}/v8_7_5/src/string-case.cc",
            "${srcPath}/v8_7_5/src/string-constants.cc",
            "${srcPath}/v8_7_5/src/string-stream.cc",
            "${srcPath}/v8_7_5/src/strtod.cc",
            "${srcPath}/v8_7_5/src/task-utils.cc",
            "${srcPath}/v8_7_5/src/thread-id.cc",
            "${srcPath}/v8_7_5/src/thread-local-top.cc",
            "${srcPath}/v8_7_5/src/transitions.cc",
            "${srcPath}/v8_7_5/src/turbo-assembler.cc",
            "${srcPath}/v8_7_5/src/type-hints.cc",
            "${srcPath}/v8_7_5/src/unicode.cc",
            "${srcPath}/v8_7_5/src/unicode-decoder.cc",
            "${srcPath}/v8_7_5/src/unoptimized-compilation-info.cc",
            "${srcPath}/v8_7_5/src/unwinder.cc",
            "${srcPath}/v8_7_5/src/unwinding-info-win64.cc",
            "${srcPath}/v8_7_5/src/uri.cc",
            "${srcPath}/v8_7_5/src/utils.cc",
            "${srcPath}/v8_7_5/src/v8.cc",
            "${srcPath}/v8_7_5/src/v8dll-main.cc",
            "${srcPath}/v8_7_5/src/v8threads.cc",
            "${srcPath}/v8_7_5/src/value-serializer.cc",
            "${srcPath}/v8_7_5/src/vector-slot-pair.cc",
            "${srcPath}/v8_7_5/src/version.cc",
            "${srcPath}/v8_7_5/src/visitors.cc",
            "${srcPath}/v8_7_5/src/accessors.cc",
            "${srcPath}/v8_7_5/src/debug/liveedit.cc",
            "${srcPath}/v8_7_5/src/base/platform/platform-linux.cc",
            "${srcPath}/v8_7_5/src/base/platform/platform-posix.cc",
            "${srcPath}/v8_7_5/src/base/platform/platform-posix-time.cc",
            "${srcPath}/v8_7_5/src/compiler/backend/x64/code-generator-x64.cc",
            "${srcPath}/v8_7_5/src/compiler/backend/x64/instruction-scheduler-x64.cc",
            "${srcPath}/v8_7_5/src/compiler/backend/x64/instruction-selector-x64.cc",
            "${srcPath}/v8_7_5/src/compiler/backend/x64/unwinding-info-writer-x64.cc",
            "${srcPath}/v8_7_5/src/compiler/backend/arm64/code-generator-arm64.cc",
            "${srcPath}/v8_7_5/src/compiler/backend/arm64/instruction-scheduler-arm64.cc",
            "${srcPath}/v8_7_5/src/compiler/backend/arm64/instruction-selector-arm64.cc",
            "${srcPath}/v8_7_5/src/compiler/backend/arm64/unwinding-info-writer-arm64.cc",
            "${srcPath}/v8_7_5/src/x64/assembler-x64.cc",
            "${srcPath}/v8_7_5/src/x64/cpu-x64.cc",
            "${srcPath}/v8_7_5/src/x64/disasm-x64.cc",
            "${srcPath}/v8_7_5/src/x64/eh-frame-x64.cc",
            "${srcPath}/v8_7_5/src/x64/frame-constants-x64.cc",
            "${srcPath}/v8_7_5/src/x64/interface-descriptors-x64.cc",
            "${srcPath}/v8_7_5/src/x64/macro-assembler-x64.cc",
            "${srcPath}/v8_7_5/src/x64/deoptimizer-x64.cc",
            "${srcPath}/v8_7_5/src/arm64/assembler-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/cpu-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/decoder-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/deoptimizer-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/disasm-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/eh-frame-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/cpu-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/frame-constants-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/instructions-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/instructions-arm64-constants.cc",
            "${srcPath}/v8_7_5/src/arm64/instrument-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/interface-descriptors-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/macro-assembler-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/register-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/simulator-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/simulator-logic-arm64.cc",
            "${srcPath}/v8_7_5/src/arm64/utils-arm64.cc",
                
        ],
        // 
        "cmd":[
            "-fno-exceptions",
            //"--target=x86_64-linux-guneabi", 
            "-std=c++14",
            "-fms-extensions",
            //"-fshort-wchar",
            "-D_GLIBCXX17_INLINE=inline",
            "-D_GNU_SOURCE",
            "-DUSE_AURA",
            "-DOS_LINUX_FOR_WIN",
            "-DINSIDE_BLINK",
            "-DBLINK_IMPLEMENTATION",
            "-DSK_SUPPORT_LEGACY_CREATESHADER_PTR",
            "-DENABLE_WKE",
            "-D_HAS_CONSTEXPR=0",
            "-D_CRT_SECURE_NO_WARNINGS",
            "-DSUPPORT_XP_CODE=1",
            //"-DV8_TARGET_ARCH_X64",
            "-DV8_EMBEDDED_BUILTINS=1",
            "-DV8_TYPED_ARRAY_MAX_SIZE_IN_HEAP=0",
            "-DV8_PROMISE_INTERNAL_FIELD_COUNT=1",
            "-DDISABLE_UNTRUSTED_CODE_MITIGATIONS",
            "-DICU_UTIL_DATA_IMPL=ICU_UTIL_DATA_SHARED",
            "-DUCONFIG_NO_SERVICE=1",
            "-DUCONFIG_NO_REGULAR_EXPRESSIONS=1",
            "-DU_ENABLE_DYLOAD=0",
            "-DU_STATIC_IMPLEMENTATION=1",
            "-DU_HAVE_STD_STRING=1",
            "-DUCONFIG_NO_BREAK_ITERATION=0",
            "-D_CRT_SECURE_NO_DEPRECATE",
            "-D_CRT_NONSTDC_NO_DEPRECATE",
            "-DV8_NO_FAST_TLS",
            "-DV8_DEPRECATION_WARNINGS",
            "-DBUILDING_V8_SHARED=1"
        ],
        "objdir":"${srcPath}/out/tmp/v8_7_5/${targetDir}",
        "outdir":"${srcPath}/out/${targetDir}",
                
        "target":"libv8_7_5_2.a",
        "beginLibs":[
        ],
        "linkerCmd":[],
        "endLibs":[
        ],
        "linker":"${ndkBinPath}/ar.exe"
    }
}];

if ("aarch64-linux-guneabi" == constVal.target) {
    json[0].compile.cmd.push("-DV8_TARGET_ARCH_ARM64");
} else {
    json[0].compile.cmd.push("-DV8_TARGET_ARCH_X64");
}

buildCommonSetting(json);
