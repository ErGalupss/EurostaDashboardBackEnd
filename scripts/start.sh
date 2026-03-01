#!/bin/bash
echo "🚀 Avvio Rintraccio Analytics..."

if [ ! -d node_modules ]; then
    echo "⚠️ Dipendenze mancanti. Eseguo npm install..."
    npm install
fi

echo "Avvio server di sviluppo..."
npm run dev
