# Forcer la console PowerShell à afficher correctement les accents
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Définition des chemins
$galerieDir = Join-Path $PSScriptRoot "img\galerie"
$outputFile = Join-Path $PSScriptRoot "galerie-data.js"
$extensions = @(".jpg", ".jpeg", ".png", ".jfif")

if (-not (Test-Path $galerieDir)) {
    Write-Error "Le dossier $galerieDir est introuvable."
    exit
}

# Récupérer tous les sous-dossiers dans img/galerie
$dossiers = Get-ChildItem -Path $galerieDir -Directory
$albumsData = @()

foreach ($dossier in $dossiers) {
    $dossierNom = $dossier.Name
    
    # Récupérer les fichiers images du dossier
    $fichiers = Get-ChildItem -Path $dossier.FullName -File | Where-Object { 
        $extensions -contains $_.Extension.ToLower() 
    }
    
    if ($fichiers.Count -gt 0) {
        # Création de l'ID (minuscules, espaces en tirets)
        $id = $dossierNom.ToLower() -replace '\s+', '-'
        
        # Formater un titre propre (remplacer les tirets par des espaces)
        $titre = $dossierNom -replace '-', ' '
        
        # Première image comme couverture
        $couverture = $fichiers[0].Name
        
        # Liste des noms de fichiers
        $photos = @($fichiers | Select-Object -ExpandProperty Name)

        # Objet représentant l'album
        $albumObj = [PSCustomObject]@{
            id = $id
            titre = $titre
            dossier = "img/galerie/$dossierNom/"
            couverture = $couverture
            photos = $photos
        }
        $albumsData += $albumObj
    }
}

# Convertir les albums en format JSON (valide en JavaScript)
$albumsJson = $albumsData | ConvertTo-Json -Depth 5

# Récupérer la partie YouTube existante en UTF-8 si le fichier existe
$youtubeContent = @"
// Liste de vos vidéos YouTube
const youtubeVideos = [
  {
    id: "ouwUcJG_Wgc",
    titre: "Concert Live - Morceau 1"
  }
];
"@

if (Test-Path $outputFile) {
    # Lecture sécurisée en UTF-8
    $ancienContenu = [System.IO.File]::ReadAllText($outputFile, [System.Text.Encoding]::UTF8)
    if ($ancienContenu -match 'const youtubeVideos = \[([\s\S]*?)\];') {
        $youtubeContent = "const youtubeVideos = [" + $Matches[1] + "];"
    }
}

# Assembler le contenu final du fichier JS
$contenuFinal = "// Généré automatiquement par PowerShell le $(Get-Date)`n" +
                "const galerieAlbums = $albumsJson;`n`n`n" +
                "$youtubeContent"

# Écriture forcée en UTF-8 pur (sans BOM corrupteur)
[System.IO.File]::WriteAllText($outputFile, $contenuFinal, [System.Text.Encoding]::UTF8)

Write-Host "Succès ! Le fichier galerie-data.js a été mis à jour en UTF-8." -ForegroundColor Green