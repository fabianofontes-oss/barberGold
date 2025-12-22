# Script para commit rápido
# Uso: .\commit-rapido.ps1 "sua mensagem aqui"

param(
    [string]$mensagem = "Update: alterações automáticas"
)

Write-Host "🔄 Adicionando arquivos..." -ForegroundColor Yellow
git add .

Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
git commit -m $mensagem

Write-Host "✅ Commit realizado com sucesso!" -ForegroundColor Green
Write-Host "📊 Status atual:" -ForegroundColor Cyan
git status --short

# Perguntar se quer fazer push
$push = Read-Host "`n🚀 Deseja enviar para o GitHub? (s/n)"
if ($push -eq "s" -or $push -eq "S") {
    Write-Host "📤 Enviando para o GitHub..." -ForegroundColor Yellow
    git push
    Write-Host "✅ Push concluído!" -ForegroundColor Green
}



