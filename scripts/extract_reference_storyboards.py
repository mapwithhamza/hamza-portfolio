from __future__ import annotations

import math
import sys
from pathlib import Path

TOOLS = Path(".codex-video-tools").resolve()
if TOOLS.exists():
    sys.path.insert(0, str(TOOLS))

import imageio.v2 as imageio
from PIL import Image, ImageDraw, ImageFont


ROOT = Path("references")
OUT = Path(".codex-reference-storyboards")
FRAME_COUNT = 8
THUMB_WIDTH = 320


def fit_frame(frame, width: int = THUMB_WIDTH) -> Image.Image:
    image = Image.fromarray(frame)
    ratio = width / image.width
    return image.resize((width, max(1, int(image.height * ratio))), Image.Resampling.LANCZOS)


def read_metadata(path: Path) -> tuple[float, float]:
    reader = imageio.get_reader(str(path), "ffmpeg")
    meta = reader.get_meta_data()
    reader.close()
    duration = float(meta.get("duration") or 0)
    fps = float(meta.get("fps") or 30)
    return duration, fps


def extract_frames(path: Path, duration: float, fps: float):
    if duration <= 0:
        times = [0]
    else:
        start = min(0.25, duration * 0.08)
        end = max(start, duration - min(0.25, duration * 0.08))
        times = [start + (end - start) * i / max(1, FRAME_COUNT - 1) for i in range(FRAME_COUNT)]

    frames = []
    reader = imageio.get_reader(str(path), "ffmpeg")
    for time in times:
        frame_index = max(0, int(time * fps))
        try:
            frame = reader.get_data(frame_index)
        except Exception:
            frame = reader.get_data(0)
        frames.append((time, fit_frame(frame)))
    reader.close()
    return frames


def make_storyboard(path: Path) -> dict[str, str | float | int]:
    duration, fps = read_metadata(path)
    frames = extract_frames(path, duration, fps)

    label_height = 32
    gap = 10
    columns = 4
    rows = math.ceil(len(frames) / columns)
    thumb_h = max(frame.height for _, frame in frames)
    canvas = Image.new(
        "RGB",
        (columns * THUMB_WIDTH + (columns - 1) * gap, rows * (thumb_h + label_height) + (rows - 1) * gap),
        "#101010",
    )
    draw = ImageDraw.Draw(canvas)

    for index, (time, frame) in enumerate(frames):
        col = index % columns
        row = index // columns
        x = col * (THUMB_WIDTH + gap)
        y = row * (thumb_h + label_height + gap)
        canvas.paste(frame, (x, y))
        draw.text((x + 8, y + frame.height + 8), f"{time:0.2f}s", fill="#d8d8d8")

    OUT.mkdir(exist_ok=True)
    output = OUT / f"{path.stem}.jpg"
    canvas.save(output, quality=88)

    return {
        "name": path.name,
        "duration": round(duration, 2),
        "fps": round(fps, 2),
        "storyboard": str(output),
    }


def main() -> None:
    videos = sorted(ROOT.glob("*.mp4"))
    for video in videos:
        info = make_storyboard(video)
        print(f"{info['name']}\t{info['duration']}s\t{info['fps']}fps\t{info['storyboard']}")


if __name__ == "__main__":
    main()
