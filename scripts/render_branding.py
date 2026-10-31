from pathlib import Path
import cairosvg

root = Path(__file__).resolve().parents[1]
assets = root / "assets"
for source, target, width in (
    ("meam-pfp.svg", "meam-pfp.png", 1024),
    ("meam-banner.svg", "meam-banner.png", 1600),
):
    cairosvg.svg2png(url=str(assets / source), write_to=str(assets / target), output_width=width)
    print(f"Rendered {source} -> {target}")
