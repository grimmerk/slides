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
# Aliases: an extra URL that redirects to a deck, keeping ?p=N and #hash.
# One "alias:deck" per word; the alias page is plain HTML, independent of open-slide.
# memsaga-ja: the Fukuoka deck's first Japanese-only URL (2026-11-28), now one bilingual deck.
ALIASES="memsaga-taipei-2026-11:memsaga memsaga-ja:memsaga-fukuoka"
for pair in $ALIASES; do
  alias=${pair%%:*}
  deck=${pair#*:}
  cat > "$DIST/s/$alias.html" <<EOF
<!doctype html>
<meta charset="utf-8">
<title>Redirecting to /s/$deck</title>
<link rel="canonical" href="https://$DOMAIN/s/$deck">
<meta http-equiv="refresh" content="0; url=/s/$deck">
<script>location.replace('/s/$deck' + location.search + location.hash)</script>
<a href="/s/$deck">/s/$deck</a>
EOF
done
echo "$DOMAIN" > "$DIST/CNAME"
touch "$DIST/.nojekyll"
