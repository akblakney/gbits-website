#!/usr/bin/env bash

set -euo pipefail

SRC_DIR="site/md-reports"
OUT_DIR="site/reports"
CSS_FILE="report.css"

mkdir -p "$OUT_DIR"

for md in "$SRC_DIR"/*.md; do
    # Skip if no markdown files exist
    [[ -e "$md" ]] || continue

    base="$(basename "$md" .md)"
    out="$OUT_DIR/${base}.html"

    echo "Generating $out"

    pandoc \
        -s \
        --css="$CSS_FILE" \
        "$md" \
        -o "$out"
done

echo "Done."