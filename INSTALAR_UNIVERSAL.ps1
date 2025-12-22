# ========================================
#  INSTALADOR UNIVERSAL DE PROTECAO
#  Funciona em TODOS os projetos com Git
# ========================================

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "    INSTALADOR UNIVERSAL DE PROTECAO AUTOMATICA    " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Pasta onde vao ficar os scripts universais
$scriptsPath = "$env:USERPROFILE\.autoprojeto"

# Cria a pasta se nao existir
if (!(Test-Path $scriptsPath)) {
    New-Item -Path $scriptsPath -ItemType Directory -Force | Out-Null
    Write-Host "OK Pasta de scripts criada: $scriptsPath" -ForegroundColor Green
}

# ========================================
# 1. CRIAR SCRIPT DE BACKUP UNIVERSAL
# ========================================

$autoBackupScript = @'
# Sistema de Backup Automatico Universal
Write-Host "[PROTECAO] Iniciando backup automatico..." -ForegroundColor Green
Write-Host "[PROTECAO] Projeto: $(Get-Location)" -ForegroundColor Cyan
Write-Host "[PROTECAO] Backup a cada 5 minutos" -ForegroundColor Yellow
Write-Host ""

$contador = 0

while ($true) {
    Start-Sleep -Seconds 300  # 5 minutos
    $contador++
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] Verificando alteracoes..." -ForegroundColor Yellow
    
    $status = git status --porcelain 2>$null
    
    if ($status) {
        Write-Host "[$timestamp] Salvando alteracoes..." -ForegroundColor Cyan
        
        git add . 2>$null
        $data = Get-Date -Format "yyyy-MM-dd HH:mm"
        git commit -m "auto-backup: $data" 2>$null
        
        Write-Host "[$timestamp] Backup #$contador salvo!" -ForegroundColor Green
        
        # Tenta push
        $branch = git branch --show-current 2>$null
        if ($branch) {
            git push origin $branch 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[$timestamp] Enviado para nuvem!" -ForegroundColor Green
            }
        }
    }
    else {
        Write-Host "[$timestamp] Sem alteracoes" -ForegroundColor Gray
    }
}
'@

Set-Content -Path "$scriptsPath\auto-backup.ps1" -Value $autoBackupScript -Encoding UTF8
Write-Host "OK Script de backup criado" -ForegroundColor Green

# ========================================
# 2. CRIAR SCRIPT DE INICIO
# ========================================

$startScript = @'
# Inicia protecao automatica
$projectName = Split-Path (Get-Location) -Leaf

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "  PROTECAO AUTOMATICA ATIVADA" -ForegroundColor Green
Write-Host "  Projeto: $projectName" -ForegroundColor White
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

# Verifica se ja esta rodando
$jobName = "AutoBackup_$projectName"
$jaRodando = Get-Job | Where-Object { $_.Name -eq $jobName -and $_.State -eq "Running" }

if ($jaRodando) {
    Write-Host "AVISO: Protecao ja esta ativa neste projeto!" -ForegroundColor Yellow
}
else {
    $scriptPath = "$env:USERPROFILE\.autoprojeto\auto-backup.ps1"
    
    Start-Job -Name $jobName -ScriptBlock {
        param($path, $scriptPath)
        Set-Location $path
        & $scriptPath
    } -ArgumentList (Get-Location).Path, $scriptPath | Out-Null
    
    Write-Host "OK Backup automatico a cada 5 minutos" -ForegroundColor Cyan
    Write-Host "OK Sincronizacao com repositorio remoto" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Trabalhe tranquilo! Tudo esta sendo salvo automaticamente" -ForegroundColor Yellow
    Write-Host ""
}
'@

Set-Content -Path "$scriptsPath\start-protecao.ps1" -Value $startScript -Encoding UTF8
Write-Host "OK Script de inicio criado" -ForegroundColor Green

# ========================================
# 3. CONFIGURAR POWERSHELL PROFILE
# ========================================

$profilePath = $PROFILE.CurrentUserAllHosts

# Cria o diretorio se nao existir
$profileDir = Split-Path $profilePath -Parent
if (!(Test-Path $profileDir)) {
    New-Item -Path $profileDir -ItemType Directory -Force | Out-Null
}

# Cria o arquivo se nao existir
if (!(Test-Path $profilePath)) {
    New-Item -Path $profilePath -ItemType File -Force | Out-Null
}

# Verifica se ja esta configurado
$conteudo = Get-Content $profilePath -Raw -ErrorAction SilentlyContinue

if ($conteudo -and $conteudo -match "PROTECAO AUTOMATICA UNIVERSAL") {
    Write-Host ""
    Write-Host "JA ESTA INSTALADO!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "O sistema ja funciona em todos os projetos!" -ForegroundColor Gray
    Write-Host ""
    exit
}

# Adiciona configuracao ao profile
$profileConfig = @"

# ===== PROTECAO AUTOMATICA UNIVERSAL =====
# Detecta projetos Git e inicia protecao automaticamente
if (Test-Path ".git") {
    `$scriptPath = "`$env:USERPROFILE\.autoprojeto\start-protecao.ps1"
    if (Test-Path `$scriptPath) {
        & `$scriptPath
    }
}
# ==========================================

"@

Add-Content -Path $profilePath -Value $profileConfig -Encoding UTF8
Write-Host "OK PowerShell Profile configurado" -ForegroundColor Green

# ========================================
# 4. AUTO-SAVE: CRIAR ARQUIVO DE CONFIG
# ========================================

$autoSaveConfig = @"
CONFIGURACAO DO AUTO-SAVE NO CURSOR:

1. Pressione: Ctrl + ,
2. Digite na busca: auto save
3. Encontre: Files: Auto Save
4. Mude para: afterDelay
5. Pronto!

Arquivos vao salvar automaticamente a cada 1 segundo!
"@

Set-Content -Path "$scriptsPath\COMO_ATIVAR_AUTOSAVE.txt" -Value $autoSaveConfig -Encoding UTF8

# ========================================
# FINALIZACAO
# ========================================

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "          INSTALACAO CONCLUIDA COM SUCESSO!         " -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "O QUE FOI INSTALADO:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Scripts instalados em:" -ForegroundColor White
Write-Host "  $scriptsPath" -ForegroundColor Gray
Write-Host ""
Write-Host "  PowerShell configurado em:" -ForegroundColor White
Write-Host "  $profilePath" -ForegroundColor Gray
Write-Host ""
Write-Host "COMO FUNCIONA AGORA:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  - Sempre que voce abrir um projeto com Git" -ForegroundColor White
Write-Host "  - A protecao automatica inicia SOZINHA" -ForegroundColor White
Write-Host "  - Funciona em QUALQUER projeto!" -ForegroundColor White
Write-Host "  - Voce nao precisa fazer NADA!" -ForegroundColor White
Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Feche este terminal" -ForegroundColor White
Write-Host "  2. Abra um novo terminal" -ForegroundColor White
Write-Host "  3. Pronto! Ja vai funcionar!" -ForegroundColor White
Write-Host ""
Write-Host "  Para testar: va em qualquer projeto com Git" -ForegroundColor Gray
Write-Host "  e abra o terminal - vai ver a protecao iniciar!" -ForegroundColor Gray
Write-Host ""
Write-Host "NAO ESQUECA:" -ForegroundColor Yellow
Write-Host "  Configure o Auto-Save no Cursor (Ctrl + ,)" -ForegroundColor White
Write-Host "  Procure por 'auto save' e mude para 'afterDelay'" -ForegroundColor White
Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

