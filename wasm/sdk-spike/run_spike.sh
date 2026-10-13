#!/usr/bin/env bash
# Reproducible Phase-1 SDK/Emscripten spike (docs/EMSDK-SPIKE.md).
# Prereqs: _deps/emsdk installed+activated, _deps/rexglue-sdk @ bd9b5191
# (scripts/fetch_upstream.sh), emcc on PATH.
# All tests are parse/compile-only; SDK tree is never modified.
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SDK="$ROOT/_deps/rexglue-sdk"
OUT="$ROOT/out/wasm-spike"
SHIM="$OUT/shim"

pass=0; fail=0
check() { # check <name> <expected:0|nonzero> <exitcode>
  if { [ "$2" = 0 ] && [ "$3" = 0 ]; } || { [ "$2" != 0 ] && [ "$3" != 0 ]; }; then
    echo "PASS: $1"; pass=$((pass+1));
  else
    echo "FAIL: $1 (expected exit $2, got $3)"; fail=$((fail+1));
  fi
}

command -v emcc >/dev/null || { echo "emcc not on PATH: source _deps/emsdk/emsdk_env.sh"; exit 2; }
[ -f "$SDK/include/rex/platform.h" ] || { echo "missing SDK: run scripts/fetch_upstream.sh"; exit 2; }

git -C "$SDK" submodule update --init --depth 1 \
  thirdparty/imgui thirdparty/fmt thirdparty/spdlog thirdparty/xxHash \
  thirdparty/tomlplusplus thirdparty/simde >/dev/null 2>&1

mkdir -p "$SHIM/rex/platform" "$OUT/src"
cp "$ROOT/wasm/sdk-spike/shims/rex/platform/fpscr.h" "$SHIM/rex/platform/fpscr.h"
cp "$ROOT/wasm/sdk-spike/shims/chrono_primary.h" "$SHIM/chrono_primary.h"
python3 "$ROOT/wasm/sdk-spike/apply_shims.py" --sdk "$SDK" \
  --out "$SHIM/rex/ppc/intrinsics.h" || exit 1

INCS="-I$SHIM -I$SDK/include -I$SDK/thirdparty/fmt/include \
  -I$SDK/thirdparty/spdlog/include -I$SDK/thirdparty/imgui \
  -I$SDK/thirdparty/xxHash -I$SDK/thirdparty/tomlplusplus/include \
  -I$SDK/thirdparty/simde"
BASE="emcc -std=c++23 -D__gnu_linux__ -Wno-deprecated-pragma -include $SHIM/chrono_primary.h $INCS"

printf '#include <rex/platform.h>\nint main(){return 0;}\n' > "$OUT/src/s1.cpp"
printf '#include <rex/rex_app.h>\nint main(){return 0;}\n' > "$OUT/src/s2.cpp"
printf '#include <rex/graphics/graphics_system.h>\n#include <rex/graphics/command_processor.h>\nint main(){return 0;}\n' > "$OUT/src/s3.cpp"
cat > "$OUT/src/s5.cpp" <<'EOF'
#include <rex/graphics/graphics_system.h>
#include <rex/graphics/command_processor.h>
class NullGraphicsSystem : public rex::graphics::GraphicsSystem {
 public:
  std::string name() const override { return "Null (wasm spike)"; }
 protected:
  void CreateProvider(bool) override {}
  std::unique_ptr<rex::graphics::CommandProcessor> CreateCommandProcessor() override {
    return nullptr;
  }
};
int main() { return 0; }
EOF
printf '#include <rex/ppc/intrinsics.h>\n#include <rex/ppc/context.h>\nint main(){return 0;}\n' > "$OUT/src/s6.cpp"
printf '#include <webgpu/webgpu.h>\nint main(){return 0;}\n' > "$OUT/src/s7.cpp"

# S1: expected to FAIL (platform.h rejects emscripten) — documents patch #1.
emcc -std=c++23 -I"$SDK/include" -fsyntax-only "$OUT/src/s1.cpp" >/dev/null 2>&1
check "S1 platform.h rejects wasm (expect fail)" nonzero $?
$BASE -fsyntax-only "$OUT/src/s2.cpp" >/dev/null 2>&1
check "S2 rex_app.h parses" 0 $?
$BASE -fsyntax-only "$OUT/src/s3.cpp" >/dev/null 2>&1
check "S3 graphics headers parse" 0 $?
$BASE -c "$SDK/src/core/memory_posix.cpp" -o /dev/null >/dev/null 2>&1
check "S4 memory_posix.cpp compiles" 0 $?
$BASE -fsyntax-only "$OUT/src/s5.cpp" >/dev/null 2>&1
check "S5 NullGraphicsSystem subclass compiles" 0 $?
$BASE -fsyntax-only "$OUT/src/s6.cpp" >/dev/null 2>&1
check "S6 ppc intrinsics+context parse" 0 $?
emcc -std=c++23 --use-port=emdawnwebgpu -fsyntax-only "$OUT/src/s7.cpp" >/dev/null 2>&1
check "S7 Dawn webgpu.h parses" 0 $?

echo "---- $pass passed, $fail failed ----"
[ "$fail" = 0 ]
