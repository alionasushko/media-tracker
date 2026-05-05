#!/usr/bin/env bash
# Regenerate raster app icons from SVG sources.
# Requires: rsvg-convert (brew install librsvg).
set -euo pipefail

cd "$(dirname "$0")/.."
SRC=icons
OUT=../assets/images

rsvg-convert -w 1024 -h 1024 "$SRC/icon.svg"            -o "$OUT/icon.png"
rsvg-convert -w 1024 -h 1024 "$SRC/adaptive-icon.svg"   -o "$OUT/adaptive-icon.png"
rsvg-convert -w 1024 -h 1024 "$SRC/monochrome-icon.svg" -o "$OUT/monochrome-icon.png"
rsvg-convert -w 1024 -h 1024 "$SRC/splash-icon.svg"     -o "$OUT/splash-icon.png"
rsvg-convert -w 64   -h 64   "$SRC/favicon.svg"         -o "$OUT/favicon.png"

echo "Icons regenerated."
