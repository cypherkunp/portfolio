#!/bin/bash
# Cursor may start hooks with a PATH that does not include nvm.
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    # nvm uses unset vars and non-zero exits as normal control flow.
    set +euo pipefail
    # shellcheck disable=SC1091
    . "$NVM_DIR/nvm.sh"
    set -euo pipefail
  fi
fi

if ! command -v node >/dev/null 2>&1; then
  echo "[chat-checks] node is not on PATH" >&2
  if [ "${1:-}" = "stop" ]; then
    printf '%s\n' '{}'
  fi
  exit 0
fi

script_dir="$(cd "$(dirname "$0")" && pwd)"
exec node "$script_dir/chat-checks.mjs" "$@"
