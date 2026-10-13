#!/usr/bin/env python3
"""Static server with COOP/COEP headers (required for wasm threads / SAB)."""
import functools
import http.server
import sys


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        super().end_headers()

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    root = sys.argv[1] if len(sys.argv) > 1 else "."
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8931
    http.server.ThreadingHTTPServer(
        ("127.0.0.1", port),
        functools.partial(Handler, directory=root)).serve_forever()
