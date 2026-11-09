#!/bin/sh
# Pone un sello de versión a barra.css y barra.js para que los navegadores tomen siempre la última versión.
V=$(date +%Y%m%d%H%M)
sed -i -E "s/barra\.(css|js)(\?v=[0-9]+)?\"/barra.\1?v=$V\"/g" index.html gestoria.html marketing.html novedades.html jurisprudencia.html
echo "versión $V"
