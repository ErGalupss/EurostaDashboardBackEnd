Write-Host "🩺 Rintraccio Analytics Doctor" -ForegroundColor Cyan
Write-Host "------------------------------"

# Check Node
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVer = node -v
    Write-Host "✅ Node.js: OK ($nodeVer)" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js: MANCANTE (Installa da nodejs.org)" -ForegroundColor Red
}

# Check ENV
if (Test-Path .env) {
    Write-Host "✅ File .env: OK" -ForegroundColor Green
} else {
    Write-Host "❌ File .env: MANCANTE (Esegui: Copy-Item .env.example .env)" -ForegroundColor Red
}

# Check Node Modules
if (Test-Path node_modules) {
    Write-Host "✅ Dipendenze: OK" -ForegroundColor Green
} else {
    Write-Host "❌ Dipendenze: MANCANTI (Esegui: npm install)" -ForegroundColor Red
}

# Check Port 5173
$portInUse = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️ Porta 5173: OCCUPATA (Il server è già in esecuzione o la porta è usata da un'altra app)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Porta 5173: LIBERA" -ForegroundColor Green
}

Write-Host "------------------------------"
Write-Host "💡 Suggerimento: Se tutto è OK, esegui 'npm run dev' per avviare." -ForegroundColor Cyan
