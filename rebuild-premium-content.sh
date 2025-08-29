#!/usr/bin/env bash
set -euo pipefail
DIR="uncensored"; OUT3="content-data3.js"; OUT4="content-data4.js"
mapfile -t ALL < <(find "$DIR" -type f -name '*.webp' -print | sed 's|.*/||' | sort -u)
FILTERED=()
for f in "${ALL[@]}"; do
  # solo nombres válidos
  if [[ "$f" =~ ^[A-Za-z0-9._-]+\.webp$ ]]; then FILTERED+=("$f"); fi
done
N=${#FILTERED[@]}
MID=$((N/2))
esc(){ printf '"%s"' "$1"; }
{
  echo "/* generado auto desde /uncensored (parte 1) */"
  echo "window.IBG_PREMIUM_P1 = ["
  for ((i=0; i<MID; i++)); do q=$(esc "${FILTERED[$i]}"); echo "  $q,"; done
  echo "];"
  echo "console.info('📦 Cargando módulo content-data3.js - Imágenes premium parte 1...');"
  echo "console.info('✅', $MID, 'imágenes premium parte 1 cargadas desde /uncensored/');"
} > "$OUT3"
{
  echo "/* generado auto desde /uncensored (parte 2) */"
  echo "window.IBG_PREMIUM_P2 = ["
  for ((i=MID; i<N; i++)); do q=$(esc "${FILTERED[$i]}"); echo "  $q,"; done
  echo "];"
  echo "console.info('📦 Cargando módulo content-data4.js - Imágenes premium parte 2...');"
  echo "console.info('✅', $((N-MID)), 'imágenes premium parte 2 cargadas desde /uncensored/');"
} > "$OUT4"
echo "OK: reconstruidos $OUT3 y $OUT4 con $N elementos (split $MID + $((N-MID)))"
