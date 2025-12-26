# Script para adicionar null checks em todos os componentes que usam currentUser

$files = @(
    "src\modules\finance\components\RegisterClosureModal.tsx",
    "src\modules\clients\MyReferralsPanel.tsx"
)

foreach ($file in $files) {
    $fullPath = "d:\projetos\Antigravity\barbergold\barberGold\$file"
    if (Test-Path $fullPath) {
        Write-Host "Processando: $file"
        $content = Get-Content $fullPath -Raw
        
        # Adicionar validação após useBarber() se ainda não existe
        if ($content -notmatch "if \(\!currentUser\) return null;") {
            $content = $content -replace "(const \{[^}]+currentUser[^}]+\} = useBarber\(\);)", "`$1`n`n  if (!currentUser) return null;"
            Set-Content -Path $fullPath -Value $content -NoNewline
            Write-Host "  ✓ Adicionado null check"
        } else {
            Write-Host "  - Já tem null check"
        }
    }
}

Write-Host "`nConcluído!"
