// parse_probe.cpp — node-side validation: the REAL SDK TraceReader opens a
// synthetic fixture (gen_fixture.py) on the Emscripten FS and reports frames.
// No game assets, no GPU. Run: em++ ... --preload-file synth.xtr@/trace/synth.xtr
#include <cstdio>

#include <rex/graphics/trace_reader.h>

int main() {
  rex::graphics::TraceReader reader;
  if (!reader.Open("/trace/synth.xtr")) {
    std::printf("OPEN FAILED\n");
    return 1;
  }
  std::printf("frames=%d\n", reader.frame_count());
  int draws = 0, swaps = 0;
  for (int f = 0; f < reader.frame_count(); ++f) {
    const auto* frame = reader.frame(f);
    std::printf("frame %d commands=%zu\n", f, frame->commands.size());
    for (const auto& cmd : frame->commands) {
      if (cmd.type == rex::graphics::TraceReader::Frame::Command::Type::kDraw) {
        ++draws;
      } else {
        ++swaps;
      }
    }
  }
  std::printf("draws=%d swaps=%d\n", draws, swaps);
  return (reader.frame_count() == 2 && draws == 2 && swaps == 2) ? 0 : 1;
}
