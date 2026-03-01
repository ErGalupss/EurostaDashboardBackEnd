#!/bin/bash
# scripts/doctor.sh
echo "🩺 Rintraccio Analytics Doctor"
echo "------------------------------"

# Check Node
if command -v node &> /dev/null; then
    echo "✅ Node.js: OK ($(node -v))"
else
    echo "❌ Node.js: MANCANTE (Installa da nodejs.org)"
fi

# Check ENV
if [ -f .env ]; then
    echo "✅ File .env: OK"
else
    echo "❌ File .env: MANCANTE (Esegui: cp .env.example .env)"
fi

# Check Node Modules
if [ -d node_modules ]; then
    echo "✅ Dipendenze: OK"
else
    echo "❌ Dipendenze: MANCANTI (Esegui: npm install)"
fi

# Check Port 5173
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Porta 5173: OCCUPATA (Il server è già in esecuzione o la porta è usata da un'altra app)"
else
    echo "✅ Porta 5173: LIBERA"
fi

echo "------------------------------"
echo "💡 Suggerimento: Se tutto è OK, esegui 'npm run dev' per avviare."
