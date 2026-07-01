#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VIDEO="$ROOT/public/assets/herosection/hero.mp4"
OUT="$ROOT/public/assets/herosection/frames"
FPS=12
# Native video resolution — no downscale
WIDTH=1280

mkdir -p "$OUT"
rm -f "$OUT"/frame_*.jpg

ffmpeg -y -i "$VIDEO" -vf "fps=${FPS}" -q:v 1 "$OUT/frame_%04d.jpg"

FRAME_COUNT=$(ls -1 "$OUT"/frame_*.jpg | wc -l | tr -d ' ')

cat > "$OUT/manifest.json" <<EOF
{
  "frameCount": ${FRAME_COUNT},
  "fps": ${FPS},
  "extension": ".jpg",
  "basePath": "/assets/herosection/frames/frame_",
  "padding": 4
}
EOF

echo "Extracted ${FRAME_COUNT} frames to ${OUT}"
