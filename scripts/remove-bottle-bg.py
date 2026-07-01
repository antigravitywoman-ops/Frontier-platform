#!/usr/bin/env python3
"""Remove background from bottle frame PNGs and write transparent WebPs."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image
from rembg import remove


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: remove-bottle-bg.py <input_dir> <output_dir>")

    src_dir = Path(sys.argv[1])
    dst_dir = Path(sys.argv[2])
    dst_dir.mkdir(parents=True, exist_ok=True)

    frames = sorted(src_dir.glob("frame_*.png"))
    if not frames:
        raise SystemExit(f"No frames found in {src_dir}")

    for index, frame_path in enumerate(frames, start=1):
        image = Image.open(frame_path).convert("RGBA")
        cutout = remove(image)
        out_path = dst_dir / f"{frame_path.stem}.webp"
        cutout.save(out_path, "WEBP", quality=90, method=6)
        if index % 12 == 0 or index == len(frames):
            print(f"Processed {index}/{len(frames)}", flush=True)


if __name__ == "__main__":
    main()
