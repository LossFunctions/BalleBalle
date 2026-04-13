#!/bin/sh

set -eu

PORT="${PORT:-3000}"
HOST="${HOST:-127.0.0.1}"
URL="http://${HOST}:${PORT}"

npm run build

npm run start -- --hostname "$HOST" --port "$PORT" &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

until curl -sf "$URL" >/dev/null; do
  sleep 1
done

open "$URL"
wait "$SERVER_PID"
