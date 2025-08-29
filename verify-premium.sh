#!/usr/bin/env bash
set -euo pipefail
CONTENT_JS=(content-data3*.js content-data4*.js)
UNCENSORED_DIR="uncensored"
shopt -s nullglob
JS_LIST=()
for p in "${CONTENT_JS[@]}"; do for f in $p; do JS_LIST+=("$f"); done; done
shopt -u nullglob
((${#JS_LIST[@]} > 0)) || { echo "No encontré content-data3/4"; exit 1; }
[ -d "$UNCENSORED_DIR" ] || { echo "No existe '$UNCENSORED_DIR'"; exit 1; }
TMP="$(mktemp -d)"
EXPECTED="$TMP/expected.txt"; ACTUAL="$TMP/actual.txt"
: >"$EXPECTED"
for js in "${JS_LIST[@]}"; do
  perl -ne 'while (/"([^"]+)"/g){ print "$1\n" } while (/'\''([^'\'']+)'\''/g){ print "$1\n" }' "$js" \
  | awk '{name=$0; sub(/^.*\//,"",name); if (name !~ /\.webp$/) name=name".webp"; if (name ~ /^[A-Za-z0-9._-]+\.webp$/) print name}' \
  >> "$EXPECTED"
done
sort -u "$EXPECTED" -o "$EXPECTED"
find "$UNCENSORED_DIR" -type f -name '*.webp' -print | sed 's|.*/||' | sort -u > "$ACTUAL"
comm -23 "$EXPECTED" "$ACTUAL" | sed 's/^/FALTA: /' || true
comm -13 "$EXPECTED" "$ACTUAL" | sed 's/^/SOBRA: /' || true
echo "OK verificación (consulta arriba si hay FALTA/SOBRA)."
