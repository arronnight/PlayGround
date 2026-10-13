// SPIKE ONLY (forced via -include): Emscripten's libc++ has no
// std::chrono::clock_time_conversion primary template (libc++ never
// implemented clock_time_cast). libstdc++/MSVC provide it, which is what
// upstream SDK assumes. Real fix: SDK defines its own trait.
// See docs/EMSDK-SPIKE.md.
#pragma once
#include <chrono>
namespace std::chrono {
template <class Dest, class Source>
struct clock_time_conversion {};
}  // namespace std::chrono
