#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VIDEO="$ROOT/public/assets/platform/bottle.mp4"
RAW="$ROOT/public/assets/platform/bottle-frames-raw"
OUT="$ROOT/public/assets/platform/bottle-frames"
FPS=12
VENV="$ROOT/.venv-bottle"

mkdir -p "$RAW" "$OUT"
rm -f "$RAW"/frame_*.png "$OUT"/frame_*.webp

ffmpeg -y -i "$VIDEO" -vf "fps=${FPS},scale=560:-1" "$RAW/frame_%04d.png"

if [[ ! -x "$VENV/bin/python" ]]; then
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install -q rembg pillow onnxruntime
fi

"$VENV/bin/python" "$ROOT/scripts/remove-bottle-bg.py" "$RAW" "$OUT"

FRAME_COUNT=$(ls -1 "$OUT"/frame_*.webp | wc -l | tr -d ' ')

cat > "$OUT/manifest.json" <<EOF
{
  "frameCount": ${FRAME_COUNT},
  "fps": ${FPS},
  "extension": ".webp",
  "basePath": "/assets/platform/bottle-frames/frame_",
  "padding": 4
}
EOF

rm -rf "$RAW"
echo "Extracted ${FRAME_COUNT} transparent bottle frames to ${OUT}"
