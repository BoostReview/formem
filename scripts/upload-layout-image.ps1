# Script PowerShell pour uploader l'image de layout sur Cloudflare R2
# Usage: .\scripts\upload-layout-image.ps1 "chemin-vers-image"

param(
    [Parameter(Mandatory=$true)]
    [string]$ImagePath
)

# Charger les variables d'environnement depuis .env.local
$envFile = ".env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

# Vérifier que le fichier existe
if (-not (Test-Path $ImagePath)) {
    Write-Host "❌ Fichier introuvable: $ImagePath" -ForegroundColor Red
    exit 1
}

# Lire le fichier
$fileBytes = [System.IO.File]::ReadAllBytes($ImagePath)
$fileName = "layout-one-by-one-$(Get-Date -Format 'yyyyMMddHHmmss').png"

Write-Host "📤 Upload de l'image vers R2..." -ForegroundColor Cyan

# Créer FormData
$boundary = [System.Guid]::NewGuid().ToString()
$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
    "Content-Type: image/png",
    "",
    [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes),
    "--$boundary--"
)
$body = $bodyLines -join "`r`n"
$bodyBytes = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($body)

# URL de l'API
$baseUrl = $env:NEXT_PUBLIC_APP_URL
if (-not $baseUrl) {
    $baseUrl = "http://localhost:3000"
}

$uploadUrl = "$baseUrl/api/upload"

try {
    $response = Invoke-RestMethod -Uri $uploadUrl -Method Post -Body $bodyBytes -ContentType "multipart/form-data; boundary=$boundary"
    
    if ($response.success) {
        Write-Host "✅ Image uploadée avec succès!" -ForegroundColor Green
        Write-Host "📎 URL: $($response.fileUrl)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "💾 Ajoutez cette ligne dans votre fichier .env.local:" -ForegroundColor Yellow
        Write-Host "NEXT_PUBLIC_LAYOUT_ONE_IMAGE=$($response.fileUrl)" -ForegroundColor White
    } else {
        Write-Host "❌ Erreur: $($response.error)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Erreur lors de l'upload: $_" -ForegroundColor Red
    exit 1
}

