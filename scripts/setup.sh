#!/bin/bash
echo "🚀 Avvio setup Rintraccio Analytics..."

# 1. Controllo Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Errore: Node.js non è installato. Scaricalo da https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js trovato: $(node -v)"

# 2. Setup Variabili d'Ambiente
if [ ! -f .env ]; then
    echo "📝 Creazione file .env da .env.example..."
    cp .env.example .env
    echo "✅ File .env creato."
fi

# 3. Installazione Dipendenze
echo "📦 Installazione dipendenze npm..."
npm install

# 4. Avvio
echo "✨ Setup completato! Avvio del server di sviluppo..."
npm run dev
