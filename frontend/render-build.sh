# Build Command en Render: bash render-build.sh
set -e

echo "==> Instalando dependencias..."
npm install

echo "==> Compilando Angular..."
npm run build

echo "==> Localizando config.json generado..."
CONFIG_PATH=$(find dist/frontend -name "config.json" | head -1)

if [ -z "$CONFIG_PATH" ]; then
  echo "WARN: config.json no encontrado en dist/, copiando desde public/..."
  cp public/config.json dist/frontend/browser/config.json
  CONFIG_PATH="dist/frontend/browser/config.json"
fi

echo "==> Reemplazando URLs en: $CONFIG_PATH"
sed -i \
  -e 's|http://localhost:8080/api/v1|https://bolsadetrabajo-1t58.onrender.com/api/v1|g' \
  -e 's|http://localhost:8080/uploads|https://bolsadetrabajo-1t58.onrender.com/uploads|g' \
  -e 's|ws://localhost:8080/ws|https://bolsadetrabajo-1t58.onrender.com/ws|g' \
  "$CONFIG_PATH"

echo "==> config.json final:"
cat "$CONFIG_PATH"
echo ""
echo "==> Build completado."
echo ""
echo "IMPORTANTE: Para evitar 404 al recargar rutas (SPA), asegúrate de tener esta regla en Render:"
echo "  Redirects/Rewrites → Source: /* → Destination: /index.html → Action: Rewrite"
echo "  (o usa frontend/render.yaml como Blueprint)"