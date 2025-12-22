# Inicia o sistema de protecao em segundo plano
# Use este comando quando comecar a trabalhar

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "     SISTEMA DE PROTECAO AUTOMATICA" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""

Write-Host "OK Arquivos salvam automaticamente" -ForegroundColor Cyan
Write-Host "OK Backup a cada 5 minutos" -ForegroundColor Cyan
Write-Host "OK Sincroniza com GitHub" -ForegroundColor Cyan
Write-Host ""

# Verifica se ja esta rodando
$jaRodando = Get-Job | Where-Object { $_.Name -eq "AutoBackup" -and $_.State -eq "Running" }

if ($jaRodando) {
    Write-Host "AVISO: Protecao ja esta ativa!" -ForegroundColor Yellow
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
    
    Write-Host "Protecao ATIVADA! Trabalhando em segundo plano..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Agora voce pode trabalhar tranquilo!" -ForegroundColor Yellow
    Write-Host "Seu trabalho esta sendo salvo automaticamente" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Ver atividade: Receive-Job -Name AutoBackup" -ForegroundColor Cyan
    Write-Host ""
}

