# Script PowerShell pour uploader l'image via l'API
param(
    [Parameter(Mandatory=$true)]
    [string]$ImagePath
)

# Vérifier que le fichier existe (gérer l'encodage)
$resolvedPath = $ImagePath
try {
    $file = Get-Item -LiteralPath $ImagePath -ErrorAction Stop
    $resolvedPath = $file.FullName
    Write-Host "Fichier trouve: $resolvedPath" -ForegroundColor Green
} catch {
    Write-Host "Fichier introuvable: $ImagePath" -ForegroundColor Red
    exit 1
}

# URL de l'API (assurez-vous que le serveur est démarré)
$baseUrl = "http://localhost:3000"
$uploadUrl = "$baseUrl/api/upload"

Write-Host "Upload de l'image vers R2..." -ForegroundColor Cyan

try {
    # Créer FormData avec PowerShell
    $fileBytes = [System.IO.File]::ReadAllBytes($resolvedPath)
    $fileName = [System.IO.Path]::GetFileName($resolvedPath)
    $boundary = [System.Guid]::NewGuid().ToString()
    
    $bodyLines = New-Object System.Collections.ArrayList
    $bodyLines.Add("--$boundary") | Out-Null
    $bodyLines.Add("Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"") | Out-Null
    $bodyLines.Add("Content-Type: image/png") | Out-Null
    $bodyLines.Add("") | Out-Null
    
    # Convertir les bytes en string pour le body
    $encoding = [System.Text.Encoding]::GetEncoding("iso-8859-1")
    $fileString = $encoding.GetString($fileBytes)
    $bodyLines.Add($fileString) | Out-Null
    $bodyLines.Add("--$boundary--") | Out-Null
    
    $body = $bodyLines -join "`r`n"
    $bodyBytes = $encoding.GetBytes($body)
    
    $headers = @{
        "Content-Type" = "multipart/form-data; boundary=$boundary"
    }
    
    $response = Invoke-RestMethod -Uri $uploadUrl -Method Post -Body $bodyBytes -Headers $headers
    
    if ($response.success) {
        Write-Host "Image uploadée avec succès!" -ForegroundColor Green
        Write-Host "URL: $($response.fileUrl)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Ajoutez cette ligne dans votre fichier .env.local:" -ForegroundColor Yellow
        Write-Host "NEXT_PUBLIC_LAYOUT_ONE_IMAGE=$($response.fileUrl)" -ForegroundColor White
        
        # Afficher aussi pour copier-coller
        Write-Host ""
        Write-Host "Variable d'environnement:" -ForegroundColor Yellow
        Write-Host "NEXT_PUBLIC_LAYOUT_ONE_IMAGE=$($response.fileUrl)"
    } else {
        Write-Host "Erreur: $($response.error)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Erreur lors de l'upload: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Assurez-vous que:" -ForegroundColor Yellow
    Write-Host "1. Le serveur Next.js est démarré (npm run dev)" -ForegroundColor White
    Write-Host "2. Les variables R2 sont configurées dans .env.local" -ForegroundColor White
    exit 1
}

