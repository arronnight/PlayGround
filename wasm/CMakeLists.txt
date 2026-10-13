cmake_minimum_required(VERSION 3.25)
project(nhl_wasm_scaffold LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(nhl_wasm_stub wasm_main.cpp)

if(EMSCRIPTEN)
  # Phase-1/3 opt-ins live here explicitly so nobody enables them by accident.
  # -sUSE_PTHREADS=1 needs COOP/COEP serve headers (emrun handles this).
  # WebGPU (-sUSE_WEBGPU=1) is reserved for the Phase-3 EDRAM-fold backend spike.
  # Today the stub builds without either: null graphics/audio headless heartbeat.
  set_target_properties(nhl_wasm_stub PROPERTIES OUTPUT_NAME nhl_wasm SUFFIX ".js")
  target_compile_options(nhl_wasm_stub PRIVATE -O2)
  target_link_options(nhl_wasm_stub PRIVATE
    -O2
    -sENVIRONMENT=web
    -sALLOW_MEMORY_GROWTH=1
    --shell-file=${CMAKE_CURRENT_SOURCE_DIR}/wasm_shell.html)
endif()
