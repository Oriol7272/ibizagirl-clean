#!/usr/bin/env bash
set -euo pipefail

DIR="uncensored"
OUT3="content-data3.js"
OUT4="content-data4.js"

[ -d "$DIR" ] || { echo "ERROR: falta directorio $DIR" >&2; exit 1; }

TMP="$(mktemp -d)"
ALL="$TMP/all.txt"
FIL="$TMP/filtered.txt"

# 1) Listar .webp reales (orden único)
find "$DIR" -type f -name '*.webp' -print 2>/dev/null | sed 's|.*/||' | sort -u > "$ALL"

# 2) Filtrar nombres problemáticos:
#    - sin espacios
#    - sin paréntesis
#    - que NO empiecen por "Sin " (títulos “Sin título...”), para evitar rarezas
: > "$FIL"
while IFS= read -r f; do
  case "$f" in
    *" "*|*"("*|*")"*) continue;;
    Sin\ *) continue;;
  esac
  printf '%s\n' "$f" >> "$FIL"
done < "$ALL"

N="$(wc -l < "$FIL" | tr -d ' ')"
[ "$N" -gt 0 ] || { echo "ERROR: no hay .webp válidos tras el filtro" >&2; exit 1; }

# punto de corte
MID=$(( (N+1)/2 ))

esc() {
  # escapar comillas y backslashes para cadena JS
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

# 3) Generar content-data3.js (primer tramo)
{
  echo "/* generado auto desde /uncensored (parte 1) */"
  echo "window.IBG_PREMIUM_P1 = ["
  nl -ba "$FIL" | awk -v mid="$MID" '
    $1<=mid { $1=""; sub(/^[ \t]+/, "", $0); print $0 }
  ' | while IFS= read -r name; do
    q="$(esc "$name")"
    echo "  \"$q\","
  done
  echo "];"
  echo "console.info('📦 Cargando módulo content-data3.js - Imágenes premium parte 1...');"
  echo "console.info('✅', ${MID}, 'imágenes premium parte 1 cargadas desde /uncensored/');"
} > "$OUT3"

# 4) Generar content-data4.js (segundo tramo)
{
  echo "/* generado auto desde /uncensored (parte 2) */"
  echo "window.IBG_PREMIUM_P2 = ["
  nl -ba "$FIL" | awk -v mid="$MID" '
    $1>mid { $1=""; sub(/^[ \t]+/, "", $0); print $0 }
  ' | while IFS= read -r name; do
    q="$(esc "$name")"
    echo "  \"$q\","
  done
  echo "];"
  echo "console.info('📦 Cargando módulo content-data4.js - Imágenes premium parte 2...');"
  echo "console.info('✅', '"$((N-MID))"', 'imágenes premium parte 2 cargadas desde /uncensored/');"
} > "$OUT4"

echo "OK: reconstruidos $OUT3 y $OUT4 con $N elementos (split $MID + $((N-MID)))"
