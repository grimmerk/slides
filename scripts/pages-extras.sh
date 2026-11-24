#!/usr/bin/env bash
# GitHub Pages extras for an open-slide build in dist/.
#   - 404.html: open-slide uses BrowserRouter, so unknown paths fall back to the app shell.
#   - s/<deck>.html: a real file per deck, so /s/<deck> answers 200 (not the 404 fallback),
#     which plain HTTP clients and crawlers treat as a working page.
#   - llms.txt: an index for agents, pointing at the static HTML export of each deck.
#   - CNAME, .nojekyll.
set -euo pipefail
DIST=${1:-dist}
DOMAIN=${2:-slides.grimmer.io}

cp "$DIST/index.html" "$DIST/404.html"
mkdir -p "$DIST/s"
{
  echo "# Slides at https://$DOMAIN"
  echo
  echo "Each deck has a presenting view (JavaScript) and a static HTML export with the slide text and image/video URLs."
  echo
} > "$DIST/llms.txt"
for dir in slides/*/; do
  deck=$(basename "$dir")
  [ -f "slides/$deck/index.tsx" ] || continue
  cp "$DIST/index.html" "$DIST/s/$deck.html"
  echo "- $deck: https://$DOMAIN/s/$deck (present) · https://$DOMAIN/static/$deck.html (static text and images)" >> "$DIST/llms.txt"
done
echo "$DOMAIN" > "$DIST/CNAME"
touch "$DIST/.nojekyll"
