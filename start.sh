#!/usr/bin/env bash
set -euo pipefail

started_at="$(date +%s)"
trap 'rc=$?; printf "[start.sh] exit %s after %ss\n" "$rc" "$(( $(date +%s) - started_at ))"' EXIT

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
project_dir="${PROJECT_DIR:-$script_dir}"
web_dir="${OPENCODE_WEB_DIR:-${RUNNER_TEMP:-/tmp}/omgithub-web}"
port="${PORT:-3000}"

/usr/bin/time -p mkdir -p "$web_dir"
cd "$project_dir"
/usr/bin/time -p printf '[start.sh] project %s\n' "$project_dir"

if [[ "$port" =~ ^[0-9]+$ ]] && (( port > 0 && port < 65536 )); then
  :
else
  /usr/bin/time -p printf '[start.sh] invalid PORT %s\n' "$port" >&2
  exit 1
fi

serve_dir="$project_dir"
if [[ -f package.json ]]; then
  if [[ -f package-lock.json ]]; then
    /usr/bin/time -p npm ci --no-audit --no-fund
  else
    /usr/bin/time -p npm install --no-audit --no-fund
  fi
  if /usr/bin/time -p node -e 'const p=require("./package.json");process.exit(p.scripts&&p.scripts.build?0:1)'; then
    /usr/bin/time -p npm run build
  fi
  if [[ -d dist ]]; then
    serve_dir="$project_dir/dist"
  fi
fi

serve_dir="$(/usr/bin/time -p realpath "$serve_dir")"
case "$serve_dir" in
  "$project_dir"|"$project_dir"/*) ;;
  *)
    /usr/bin/time -p printf '[start.sh] refusing to serve outside PROJECT_DIR: %s\n' "$serve_dir" >&2
    exit 1
    ;;
esac
/usr/bin/time -p test -f "$serve_dir/index.html"

/usr/bin/time -p python3 - "$project_dir" "$serve_dir" "$web_dir/deployment-output.json" <<'PY'
import json
import os
import sys

project, directory, output = sys.argv[1:4]
value = {
    "project": os.path.realpath(project),
    "directory": os.path.realpath(directory),
}
os.makedirs(os.path.dirname(output), exist_ok=True)
with open(output, "w", encoding="utf-8") as handle:
    json.dump(value, handle, separators=(",", ":"))
    handle.write("\n")
print(f"[start.sh] wrote {output}: {value}")
PY

/usr/bin/time -p printf '[start.sh] serving %s on 0.0.0.0:%s (foreground)\n' "$serve_dir" "$port"
cd "$serve_dir"
export PYTHONUNBUFFERED=1
exec /usr/bin/time -p python3 -m http.server "$port" --bind 0.0.0.0
