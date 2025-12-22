# INSTALADOR - Execute UMA VEZ para configurar inicio automatico

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "         INSTALADOR DE PROTECAO AUTOMATICA        " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

$profilePath = $PROFILE.CurrentUserAllHosts

# Cria o diretorio se nao existir
$profileDir = Split-Path $profilePath -Parent
if (!(Test-Path $profileDir)) {
    New-Item -Path $profileDir -ItemType Directory -Force | Out-Null
}

# Cria o arquivo se nao existir
if (!(Test-Path $profilePath)) {
    New-Item -Path $profilePath -ItemType File -Force | Out-Null
    Write-Host "OK Arquivo de perfil criado" -ForegroundColor Green
}

# Verifica se ja esta configurado
$conteudo = Get-Content $profilePath -Raw -ErrorAction SilentlyContinue

if ($conteudo -and $conteudo -match "BarberGold.*START\.ps1") {
    Write-Host ""
    Write-Host "JA ESTA INSTALADO!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "A protecao ja inicia automaticamente quando" -ForegroundColor Gray
    Write-Host "voce abre o terminal neste projeto!" -ForegroundColor Gray
    Write-Host ""
    exit
}

# Adiciona configuracao
$projectPath = $PWD.Path
$codigo = @"

# ===== PROTECAO AUTOMATICA - BarberGold =====
if ((Get-Location).Path -eq "$projectPath") {
    if (Test-Path "$projectPath\START.ps1") {
        Write-Host ""
        Write-Host "Iniciando protecao automatica..." -ForegroundColor Yellow
        & "$projectPath\START.ps1"
    }
}
# ============================================

"@

Add-Content -Path $profilePath -Value $codigo

Write-Host ""
Write-Host "INSTALADO COM SUCESSO!" -ForegroundColor Green
Write-Host ""
Write-Host "O que acontece agora:" -ForegroundColor Cyan
Write-Host "  - Toda vez que voce abrir o terminal NESTE projeto" -ForegroundColor White
Write-Host "  - A protecao automatica vai iniciar SOZINHA" -ForegroundColor White
Write-Host "  - Voce nao precisa fazer NADA!" -ForegroundColor White
Write-Host ""
Write-Host "Para testar agora:" -ForegroundColor Yellow
Write-Host "  1. Feche este terminal" -ForegroundColor Gray
Write-Host "  2. Abra um novo terminal" -ForegroundColor Gray
Write-Host "  3. Pronto! Vai iniciar sozinho!" -ForegroundColor Gray
Write-Host ""
Write-Host "OU execute agora: .\START.ps1" -ForegroundColor Cyan
Write-Host ""

