#!/usr/bin/env bash
set -euo pipefail

# === Config ===
CONTENT_JS=(content-data3*.js content-data4*.js)
UNCENSORED_DIR="uncensored"

die(){ echo "ERROR: $*" >&2; exit 1; }

# 1. Comprobar archivos y directorio
shopt -s nullglob
JS_LIST=()
for p in "${CONTENT_JS[@]}"; do
  for f in $p; do JS_LIST+=("$f"); done
done
shopt -u nullglob

((${#JS_LIST[@]} > 0)) || die "No encontré content-data3*.js / content-data4*.js en $(pwd)"
[ -d "$UNCENSORED_DIR" ] || die "No existe el directorio '$UNCENSORED_DIR'"

TMP_DIR="$(mktemp -d)"
EXPECTED_TXT="$TMP_DIR/expected.txt"
ACTUAL_TXT="$TMP_DIR/actual.txt"
MISSING="$TMP_DIR/missing.txt"
EXTRA="$TMP_DIR/extra.txt"

: >"$EXPECTED_TXT"

# 2. Extraer nombres de los content-data
for js in "${JS_LIST[@]}"; do
  perl -ne '
    while (/"([^"]+)"/g){ print "$1\n" }
    while (/'\''([^'\'']+)'\''/g){ print "$1\n" }
  ' "$js" \
  | awk '{
      name=$0
      gsub(/^[ \t]+|[ \t]+$/, "", name)
      sub(/^.*\//,"",name)
      if (name !~ /\.webp$/) { name = name ".webp" }
      if (name ~ /^[A-Za-z0-9._-]+\.webp$/) print name
    }' >> "$EXPECTED_TXT"
done

sort -u "$EXPECTED_TXT" -o "$EXPECTED_TXT"

# 3. Listar realmente lo que hay en /uncensored
find "$UNCENSORED_DIR" -type f -name '*.webp' -print \
  | sed 's|.*/||' \
  | sort -u > "$ACTUAL_TXT"

# 4. Comparar
comm -23 "$EXPECTED_TXT" "$ACTUAL_TXT" > "$MISSING" || true
comm -13 "$EXPECTED_TXT" "$ACTUAL_TXT" > "$EXTRA"   || true

# 5. Resumen
echo "== Verificación PREMIUM (.webp) =="
echo "JS analizados     : ${#JS_LIST[@]} -> ${JS_LIST[*]}"
echo "Esperados (JS)    : $(wc -l < "$EXPECTED_TXT" | tr -d ' ')"
echo "Reales (uncensored): $(wc -l < "$ACTUAL_TXT"   | tr -d ' ')"

MIS_N=$(wc -l < "$MISSING" | tr -d ' ')
EXT_N=$(wc -l < "$EXTRA"   | tr -d ' ')
echo "Faltantes (referenciados pero no existen): $MIS_N"
[ "$MIS_N" -gt 0 ] && head -n 50 "$MISSING"
echo "Sobrantes (existen pero no se referencian): $EXT_N"
[ "$EXT_N" -gt 0 ] && head -n 50 "$EXTRA"

echo
echo "Archivos completos:"
echo "  -> Faltantes: $MISSING"
echo "  -> Sobrantes: $EXTRA"
echo "  -> Esperados (todos): $EXPECTED_TXT"
echo "  -> Reales (todos)   : $ACTUAL_TXT"
