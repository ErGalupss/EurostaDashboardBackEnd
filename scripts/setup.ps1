Write-Host "🚀 Avvio setup Rintraccio Analytics..." -ForegroundColor Cyan

# 1. Controllo Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Errore: Node.js non è installato. Scaricalo da https://nodejs.org/" -ForegroundColor Red
    exit 1
}
$nodeVer = node -v
Write-Host "✅ Node.js trovato: $nodeVer" -ForegroundColor Green

# 2. Setup Variabili d'Ambiente
if (!(Test-Path .env)) {
    Write-Host "📝 Creazione file .env da .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example -Destination .env
    Write-Host "✅ File .env creato." -ForegroundColor Green
}

# 3. Installazione Dipendenze
Write-Host "📦 Installazione dipendenze npm..." -ForegroundColor Cyan
npm install

# 4. Avvio
Write-Host "✨ Setup completato! Avvio del server di sviluppo..." -ForegroundColor Green
npm run dev
