Write-Host "🛑 Arresto server di sviluppo..." -ForegroundColor Yellow
$process = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
    Write-Host "✅ Server fermato." -ForegroundColor Green
} else {
    Write-Host "⚠️ Nessun server in esecuzione sulla porta 5173." -ForegroundColor Yellow
}
