# Script para DESINSTALAR o sistema universal (se precisar)

Write-Host ""
Write-Host "====================================================" -ForegroundColor Yellow
Write-Host "         DESINSTALADOR - PROTECAO UNIVERSAL        " -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Yellow
Write-Host ""

$scriptsPath = "$env:USERPROFILE\.autoprojeto"
$profilePath = $PROFILE.CurrentUserAllHosts

$confirmacao = Read-Host "Tem certeza que deseja DESINSTALAR a protecao universal? (s/n)"

if ($confirmacao -ne "s" -and $confirmacao -ne "S") {
    Write-Host ""
    Write-Host "Cancelado pelo usuario." -ForegroundColor Gray
    Write-Host ""
    exit
}

# Remove pasta de scripts
if (Test-Path $scriptsPath) {
    Remove-Item -Path $scriptsPath -Recurse -Force
    Write-Host "OK Scripts removidos" -ForegroundColor Green
}

# Remove do profile
if (Test-Path $profilePath) {
    $conteudo = Get-Content $profilePath -Raw
    $conteudo = $conteudo -replace "(?s)# ===== PROTECAO AUTOMATICA UNIVERSAL =====.*?# ==========================================\s*", ""
    Set-Content -Path $profilePath -Value $conteudo
    Write-Host "OK PowerShell Profile limpo" -ForegroundColor Green
}

# Para todos os jobs de backup
Get-Job | Where-Object { $_.Name -like "AutoBackup_*" } | Stop-Job
Get-Job | Where-Object { $_.Name -like "AutoBackup_*" } | Remove-Job
Write-Host "OK Jobs de backup parados" -ForegroundColor Green

Write-Host ""
Write-Host "DESINSTALADO COM SUCESSO!" -ForegroundColor Green
Write-Host ""
Write-Host "A protecao automatica foi removida." -ForegroundColor Gray
Write-Host "Para reinstalar, execute: .\INSTALAR_UNIVERSAL.ps1" -ForegroundColor Gray
Write-Host ""





