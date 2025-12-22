# 🚀 Inicia o sistema de proteção em segundo plano
# Use este comando quando começar a trabalhar

Write-Host @"

╔════════════════════════════════════════════════╗
║   🛡️  SISTEMA DE PROTEÇÃO AUTOMÁTICA 🛡️      ║
╔════════════════════════════════════════════════╗

"@ -ForegroundColor Green

Write-Host "✅ Arquivos salvam automaticamente" -ForegroundColor Cyan
Write-Host "✅ Backup a cada 5 minutos" -ForegroundColor Cyan
Write-Host "✅ Sincroniza com GitHub" -ForegroundColor Cyan
Write-Host ""

# Verifica se já está rodando
$jaRodando = Get-Job | Where-Object { $_.Name -eq "AutoBackup" -and $_.State -eq "Running" }

if ($jaRodando) {
    Write-Host "⚠️ Proteção já está ativa!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para ver status: Get-Job" -ForegroundColor Gray
    Write-Host "Para parar: Stop-Job -Name AutoBackup; Remove-Job -Name AutoBackup" -ForegroundColor Gray
}
else {
    # Inicia em segundo plano
    Start-Job -Name "AutoBackup" -ScriptBlock {
        Set-Location $using:PWD
        & "$using:PWD\auto-backup.ps1"
    } | Out-Null
    
    Write-Host "🚀 Proteção ATIVADA! Trabalhando em segundo plano..." -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 Agora você pode trabalhar tranquilo!" -ForegroundColor Yellow
    Write-Host "   Seu trabalho está sendo salvo automaticamente" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📊 Ver atividade: " -NoNewline -ForegroundColor Cyan
    Write-Host "Receive-Job -Name AutoBackup" -ForegroundColor White
    Write-Host ""
}

