# 🔧 Configurar para iniciar AUTOMATICAMENTE quando abrir o terminal
# Execute este script UMA VEZ para configurar

Write-Host "🔧 Configurando inicialização automática..." -ForegroundColor Cyan

$profilePath = $PROFILE
$scriptPath = Join-Path $PWD "iniciar-protecao.ps1"

# Cria o profile se não existir
if (!(Test-Path $profilePath)) {
    New-Item -Path $profilePath -ItemType File -Force | Out-Null
    Write-Host "✅ Arquivo de perfil criado" -ForegroundColor Green
}

# Verifica se já está configurado
$conteudo = Get-Content $profilePath -Raw -ErrorAction SilentlyContinue
if ($conteudo -match "iniciar-protecao.ps1") {
    Write-Host "⚠️ Já está configurado!" -ForegroundColor Yellow
    exit
}

# Adiciona ao profile
$codigo = @"

# 🛡️ Auto-proteção BarberGold
if (Test-Path "$scriptPath") {
    if ((Get-Location).Path -eq "$PWD") {
        & "$scriptPath"
    }
}
"@

Add-Content -Path $profilePath -Value $codigo

Write-Host @"

✅ Configurado com sucesso!

🎯 Agora, toda vez que você abrir o terminal neste projeto,
   a proteção automática vai iniciar sozinha!

📝 Para aplicar agora: . `$PROFILE

"@ -ForegroundColor Green

