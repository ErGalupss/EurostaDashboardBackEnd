#!/bin/bash
echo "🛑 Arresto server di sviluppo..."
# Trova il processo che sta usando la porta 5173 e lo killa
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    kill -9 $(lsof -t -i:5173)
    echo "✅ Server fermato."
else
    echo "⚠️ Nessun server in esecuzione sulla porta 5173."
fi
