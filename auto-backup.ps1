# 🛡️ Sistema de Backup Automático
# Este script salva automaticamente seu trabalho a cada 5 minutos

Write-Host "🛡️ Iniciando proteção automática..." -ForegroundColor Green
Write-Host "📁 Projeto: $(Get-Location)" -ForegroundColor Cyan
Write-Host "⏰ Backup automático a cada 5 minutos" -ForegroundColor Yellow
Write-Host "❌ Pressione Ctrl+C para parar`n" -ForegroundColor Red

$contador = 0

while ($true) {
    Start-Sleep -Seconds 300  # 5 minutos
    $contador++
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "`n[$timestamp] 🔄 Verificando alterações..." -ForegroundColor Yellow
    
    # Verifica se há alterações
    $status = git status --porcelain
    
    if ($status) {
        Write-Host "💾 Salvando alterações..." -ForegroundColor Cyan
        
        git add .
        $data = Get-Date -Format "yyyy-MM-dd HH:mm"
        git commit -m "auto-backup: $data"
        
        Write-Host "✅ Backup #$contador salvo localmente!" -ForegroundColor Green
        
        # Tenta fazer push (se tiver internet)
        try {
            git push 2>$null
            Write-Host "☁️ Enviado para nuvem (GitHub)!" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️ Backup local OK (sem conexão com GitHub)" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "✓ Nenhuma alteração detectada" -ForegroundColor Gray
    }
    
    Write-Host "⏰ Próximo backup em 5 minutos..." -ForegroundColor DarkGray
}






