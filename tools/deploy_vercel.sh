#!/usr/bin/env bash
set -euo pipefail

# 1) Comprobar login
if ! vercel whoami >/dev/null 2>&1; then
  vercel login
fi

# 2) Linkear proyecto (idempotente)
vercel link --yes --project ibizagirl-clean || true

# 3) (Opcional) Traer vars del proyecto producción para el build
vercel pull --yes --environment=production || true

# 4) Deploy producción con lo que hay en el working dir (sin necesidad de commit)
LOG="$(mktemp)"
vercel deploy --prod --yes | tee "$LOG"

# 5) Extraer la URL final *.vercel.app
DEPLOY_URL="$(grep -Eo 'https://[a-z0-9.-]+\.vercel\.app' "$LOG" | tail -1)"
if [ -z "${DEPLOY_URL:-}" ]; then
  echo "ERROR: no pude detectar la URL de deploy en Vercel"; exit 1
fi
echo "✅ Deploy URL: $DEPLOY_URL"

# 6) Añadir dominios al proyecto (idempotente)
vercel domains add ibizagirl.pics    || true
vercel domains add www.ibizagirl.pics || true

# 7) Asignar alias a las dos raíces
vercel alias set "$DEPLOY_URL" ibizagirl.pics      || true
vercel alias set "$DEPLOY_URL" www.ibizagirl.pics  || true

# 8) Mostrar instrucciones DNS si hiciera falta
echo
echo "==> Si Vercel indica que faltan DNS, configura en Porkbun:"
echo "   @     A      76.76.21.21"
echo "   www   CNAME  cname.vercel-dns.com"
echo
echo "Para verificar estado DNS:"
echo "   vercel domains inspect ibizagirl.pics"
echo "   vercel domains inspect www.ibizagirl.pics"
