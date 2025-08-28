#!/usr/bin/env bash
set -euo pipefail

# Si tu proyecto ya expone window.ENV vía env-inline.js, no hacemos nada extra.
# Solo generamos decorative-images.json para el banner si hay assets locales.
if ls decorative-images/* >/dev/null 2>&1; then
  python3 - <<'PY'
import os, json, glob
files=[]
for pat in ("*.jpg","*.jpeg","*.png","*.webp","*.gif"):
  files+=glob.glob(os.path.join("decorative-images", pat))
files=[f.replace("\\","/") for f in files]
print(json.dumps(files, ensure_ascii=False))
PY
else
  echo "[]"
fi > decorative-images.json

echo OK
