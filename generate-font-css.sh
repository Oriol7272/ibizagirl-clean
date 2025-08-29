#!/usr/bin/env bash
set -euo pipefail
OUT="css/premium-fonts.css"
DIR="decorative-images"

echo "/* generado */" > "$OUT"

# Construir lista de candidatos (sin mapfile)
TMP="$(mktemp)"
( ls "$DIR"/Sexy* "$DIR"/sexy* 2>/dev/null || true ) > "$TMP"

if [ ! -s "$TMP" ]; then
  cat >> "$OUT" <<CSS
/* No se encontraron fuentes Sexy* en $DIR; usando system-ui */
:root { --premium-font: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
CSS
else
  echo "@font-face{ font-family:'Sexy Beachy'; font-display:swap; src:" >> "$OUT"
  SEP=""
  while IFS= read -r f; do
    ext="${f##*.}"
    url="/${f}"
    fmt=""
    case "$ext" in
      woff2) fmt="format('woff2')" ;;
      woff)  fmt="format('woff')" ;;
      otf)   fmt="format('opentype')" ;;
      ttf)   fmt="format('truetype')" ;;
      *)     fmt="" ;;
    esac
    if [ -n "$fmt" ]; then
      # separador entre múltiples fuentes
      if [ -n "$SEP" ]; then echo "," >> "$OUT"; fi
      printf "  url('%s') %s" "$url" "$fmt" >> "$OUT"
      SEP="yes"
    fi
  done < "$TMP"
  echo "; }" >> "$OUT"
  echo ":root { --premium-font: 'Sexy Beachy', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }" >> "$OUT"
fi
