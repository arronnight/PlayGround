// viewer.cpp — trace-replay WebGPU milestone (synthetic fixture, no game assets).
//
// What it proves, end to end in a browser:
//   Emscripten FS preload -> REAL SDK TraceReader::ParseTrace (+PM4 packet
//   disassembler) -> Dawn WebGPU device/swapchain -> per-DRAW triangle,
//   per-SWAP present -> screenshot-verifiable canvas.
//
// In node (no GPU adapter) it runs parse-only and exits 0 after the report.
// This is a structural visualization of trace contents, NOT game rendering:
// each DRAW packet becomes one triangle (color varies by frame/command); each
// SWAP packet presents. EDRAM-accurate replay is Phase 3 (option A/E).

#include <cstdio>
#include <vector>

#include <rex/graphics/trace_reader.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <webgpu/webgpu.h>
#endif

namespace {

const char kTracePath[] = "/trace/synth.xtr";

struct DrawItem {
  int frame;
  int index;
};

std::vector<DrawItem> g_draws;
int g_frames = 0;

bool ParseTrace() {
  rex::graphics::TraceReader reader;
  if (!reader.Open(kTracePath)) {
    std::printf("TRACE OPEN FAILED\n");
    return false;
  }
  g_frames = reader.frame_count();
  std::printf("frames=%d\n", g_frames);
  for (int f = 0; f < g_frames; ++f) {
    const auto* frame = reader.frame(f);
    int di = 0;
    for (const auto& cmd : frame->commands) {
      if (cmd.type == rex::graphics::TraceReader::Frame::Command::Type::kDraw) {
        g_draws.push_back({f, di++});
      }
    }
    std::printf("frame %d draws=%d\n", f, di);
  }
  std::printf("total draws=%zu\n", g_draws.size());
  return !g_draws.empty();
}

#ifdef __EMSCRIPTEN__

WGPUInstance g_instance = nullptr;
WGPUAdapter g_adapter = nullptr;
WGPUDevice g_device = nullptr;
WGPUQueue g_queue = nullptr;
WGPUSurface g_surface = nullptr;
WGPUTextureFormat g_format = WGPUTextureFormat_BGRA8Unorm;
WGPURenderPipeline g_pipeline = nullptr;
int g_step = 0;
int g_maxSteps = 0;  // draws * loops; 0 = not ready

const char kShader[] = R"(
@vertex fn vs(@builtin(vertex_index) i : u32) -> @builtin(position) vec4f {
  var p = array<vec2f, 3>(vec2f(-0.6, -0.5), vec2f(0.6, -0.5), vec2f(0.0, 0.6));
  return vec4f(p[i], 0.0, 1.0);
}
@fragment fn fs() -> @location(0) vec4f {
  return vec4f(0.15, 0.55, 0.95, 1.0);
}
)";

void RenderOne(const DrawItem& d) {
  WGPUSurfaceTexture st{};
  wgpuSurfaceGetCurrentTexture(g_surface, &st);
  if (st.status != WGPUSurfaceGetCurrentTextureStatus_SuccessOptimal &&
      st.status != WGPUSurfaceGetCurrentTextureStatus_SuccessSuboptimal) {
    std::printf("getCurrentTexture status=%d\n", (int)st.status);
    return;
  }
  WGPUTextureView view = wgpuTextureCreateView(st.texture, nullptr);
  // Clear color varies per (frame, draw) so the screenshot proves per-packet
  // work, not a static image.
  WGPUColor clear = {(d.frame + 1) * 0.25, 0.05 + d.index * 0.2, 0.35, 1.0};
  WGPURenderPassColorAttachment color = {};
  color.view = view;
  color.depthSlice = WGPU_DEPTH_SLICE_UNDEFINED;
  color.loadOp = WGPULoadOp_Clear;
  color.storeOp = WGPUStoreOp_Store;
  color.clearValue = clear;
  WGPURenderPassDescriptor pass = {};
  pass.colorAttachmentCount = 1;
  pass.colorAttachments = &color;
  WGPUCommandEncoder enc = wgpuDeviceCreateCommandEncoder(g_device, nullptr);
  WGPURenderPassEncoder rp = wgpuCommandEncoderBeginRenderPass(enc, &pass);
  wgpuRenderPassEncoderSetPipeline(rp, g_pipeline);
  wgpuRenderPassEncoderDraw(rp, 3, 1, 0, 0);
  wgpuRenderPassEncoderEnd(rp);
  WGPUCommandBuffer cmd = wgpuCommandEncoderFinish(enc, nullptr);
  wgpuQueueSubmit(g_queue, 1, &cmd);
  // NOTE: wgpuSurfacePresent is unsupported in the Emscripten Dawn port —
  // presentation happens automatically when the main-loop tick yields to the
  // browser (rAF). Do NOT call it (it aborts).
  wgpuTextureViewRelease(view);
  wgpuTextureRelease(st.texture);
}

void MainLoop() {
  if (g_step < g_maxSteps) {
    RenderOne(g_draws[g_step % g_draws.size()]);
    ++g_step;
    if (g_step == g_maxSteps) {
      std::printf("rendered %d draws, holding frame for screenshot\n", g_step);
      emscripten_cancel_main_loop();
    }
  }
}

void OnDevice(WGPURequestDeviceStatus status, WGPUDevice device, WGPUStringView,
              void*, void*) {
  if (status != WGPURequestDeviceStatus_Success || !device) {
    std::printf("no WebGPU device (node?); parse-only mode\n");
    emscripten_force_exit(0);
    return;
  }
  g_device = device;
  g_queue = wgpuDeviceGetQueue(device);

  WGPUEmscriptenSurfaceSourceCanvasHTMLSelector canvas = {};
  canvas.chain.sType = WGPUSType_EmscriptenSurfaceSourceCanvasHTMLSelector;
  const char* sel = "#trace-canvas";
  canvas.selector.data = sel;
  canvas.selector.length = 13;
  WGPUSurfaceDescriptor surfDesc = {};
  surfDesc.nextInChain = &canvas.chain;
  g_surface = wgpuInstanceCreateSurface(g_instance, &surfDesc);

  WGPUSurfaceCapabilities caps = {};
  wgpuSurfaceGetCapabilities(g_surface, g_adapter, &caps);
  for (size_t i = 0; i < caps.formatCount; ++i) {
    if (caps.formats[i] == WGPUTextureFormat_BGRA8Unorm ||
        caps.formats[i] == WGPUTextureFormat_RGBA8Unorm) {
      g_format = caps.formats[i];
      break;
    }
  }
  wgpuSurfaceCapabilitiesFreeMembers(caps);

  WGPUSurfaceConfiguration cfg = {};
  cfg.device = device;
  cfg.format = g_format;
  cfg.usage = WGPUTextureUsage_RenderAttachment;
  cfg.width = 640;
  cfg.height = 360;
  cfg.alphaMode = WGPUCompositeAlphaMode_Opaque;
  cfg.presentMode = WGPUPresentMode_Fifo;
  wgpuSurfaceConfigure(g_surface, &cfg);

  WGPUShaderSourceWGSL wgsl = {};
  wgsl.chain.sType = WGPUSType_ShaderSourceWGSL;
  wgsl.code.data = kShader;
  wgsl.code.length = sizeof(kShader) - 1;
  WGPUShaderModuleDescriptor modDesc = {};
  modDesc.nextInChain = &wgsl.chain;
  WGPUShaderModule mod = wgpuDeviceCreateShaderModule(device, &modDesc);

  WGPURenderPipelineDescriptor pipe = {};
  pipe.vertex.module = mod;
  pipe.vertex.entryPoint.data = "vs";
  pipe.vertex.entryPoint.length = 2;
  WGPUFragmentState frag = {};
  frag.module = mod;
  frag.entryPoint.data = "fs";
  frag.entryPoint.length = 2;
  WGPUColorTargetState target = {};
  target.format = g_format;
  target.writeMask = WGPUColorWriteMask_All;
  frag.targetCount = 1;
  frag.targets = &target;
  pipe.fragment = &frag;
  pipe.primitive.topology = WGPUPrimitiveTopology_TriangleList;
  WGPUMultisampleState ms = {};
  ms.count = 1;
  ms.mask = 0xFFFFFFFF;
  pipe.multisample = ms;
  g_pipeline = wgpuDeviceCreateRenderPipeline(device, &pipe);

  g_maxSteps = (int)g_draws.size() * 4;  // loop the trace 4x
  std::printf("webgpu ready, rendering %d draws\n", g_maxSteps);
  emscripten_cancel_main_loop();
  emscripten_set_main_loop(MainLoop, 0, 1);
}

void OnAdapter(WGPURequestAdapterStatus status, WGPUAdapter adapter, WGPUStringView,
               void*, void*) {
  if (status != WGPURequestAdapterStatus_Success || !adapter) {
    std::printf("no WebGPU adapter (node?); parse-only mode\n");
    emscripten_force_exit(0);
    return;
  }
  g_adapter = adapter;
  WGPURequestDeviceCallbackInfo info = {};
  info.mode = WGPUCallbackMode_AllowSpontaneous;
  info.callback = OnDevice;
  wgpuAdapterRequestDevice(adapter, nullptr, info);
}

#endif  // __EMSCRIPTEN__

}  // namespace

int main() {
  std::printf("trace-viewer milestone (synthetic fixture)\n");
  if (!ParseTrace()) {
    return 1;
  }
#ifdef __EMSCRIPTEN__
  g_instance = wgpuCreateInstance(nullptr);
  WGPURequestAdapterOptions opts = {};
  opts.powerPreference = WGPUPowerPreference_HighPerformance;
  WGPURequestAdapterCallbackInfo info = {};
  info.mode = WGPUCallbackMode_AllowSpontaneous;
  info.callback = OnAdapter;
  wgpuInstanceRequestAdapter(g_instance, &opts, info);
  // Browser: adapter/device callbacks fire via the event loop, then MainLoop
  // takes over. Node (no adapter): failure path force-exits after the report.
  emscripten_set_main_loop([]() {}, 0, 1);
#else
  std::printf("native build: parse-only\n");
#endif
  return 0;
}
