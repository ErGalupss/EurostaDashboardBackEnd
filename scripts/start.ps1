Write-Host "🚀 Avvio Rintraccio Analytics..." -ForegroundColor Cyan

if (!(Test-Path node_modules)) {
    Write-Host "⚠️ Dipendenze mancanti. Eseguo npm install..." -ForegroundColor Yellow
    npm install
}

Write-Host "Avvio server di sviluppo..." -ForegroundColor Green
npm run dev
