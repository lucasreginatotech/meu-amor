param([switch]$RebuildThumbnails)
# Atualiza a lista de fotos novas sem alterar os arquivos originais.
$projectPath = Split-Path -Parent $PSScriptRoot
$photosPath = Join-Path $projectPath 'fotos.jpg'
$knownFiles = @('IMG_0344.jpeg','IMG_6497.jpeg','IMG_8208.jpeg','IMG_9692.jpeg','177c4dae-eeb3-46c1-b18f-471dbbb61ef0.jpg','6b858032-3098-44cb-8d99-a814eea7028e.jpg','7a4c7bca-dbeb-409f-945c-05993084753f.jpg','9225dabc-935e-4b27-bd5b-697745755529.jpg','dc5441ca-7a17-4cca-b8d4-5ce5e5bc2765.jpg','f1c32d47-0dba-4670-90bc-767a2f0d9f83.jpg')
$captions = @('mais um pedacinho de nós','eu guardaria esse instante','com você, a vida é mais bonita','a nossa história continua','um momento, tanto amor','que sorte a minha ter você','mais uma razão pra sorrir','essa lembrança mora em mim','meu lugar é ao seu lado','nós, do nosso jeitinho','o melhor é dividir com você','um pouquinho do nosso infinito','a vida acontecendo com você','mais um capítulo favorito','se eu pudesse voltar, voltaria aqui','um instante que eu escolhi guardar','entre tantas coisas, nós','meu amor em forma de lembrança','hoje eu escolheria você de novo','mais um dia para chamar de nosso')
$photoFiles = @(Get-ChildItem -LiteralPath $photosPath -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp)$' -and $_.Name -notin $knownFiles } | Sort-Object Name)
Add-Type -AssemblyName System.Drawing
$thumbnailDirectory = Join-Path $projectPath 'assets/photos'
New-Item -ItemType Directory -Path $thumbnailDirectory -Force | Out-Null
$thumbnailManifest = [ordered]@{}
$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$allPhotoFiles = @(Get-ChildItem -LiteralPath $photosPath -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp)$' })
foreach ($albumPhoto in $allPhotoFiles) {
  try {
    $hashAlgorithm = [System.Security.Cryptography.SHA256]::Create()
    $filenameHash = ([BitConverter]::ToString($hashAlgorithm.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($albumPhoto.Name)))).Replace('-','').Substring(0,16).ToLowerInvariant()
    $hashAlgorithm.Dispose()
    $thumbnailPath = Join-Path $thumbnailDirectory ($filenameHash + '.jpg')
    $sourceImage = [System.Drawing.Image]::FromFile($albumPhoto.FullName)
    # Corrige a orientação das miniaturas quando a câmera gravou EXIF.
    if ($sourceImage.PropertyIdList -contains 274) {
      $orientation = [BitConverter]::ToUInt16($sourceImage.GetPropertyItem(274).Value,0)
      $rotation = switch ($orientation) { 2 {4} 3 {2} 4 {6} 5 {5} 6 {1} 7 {7} 8 {3} default {0} }
      $sourceImage.RotateFlip([System.Drawing.RotateFlipType]$rotation)
    }
    $resizeRatio = [Math]::Min([double]1,[Math]::Min(640.0/[double]$sourceImage.Width,900.0/[double]$sourceImage.Height))
    $outputWidth = [Math]::Max(1,[int]($sourceImage.Width*$resizeRatio))
    $outputHeight = [Math]::Max(1,[int]($sourceImage.Height*$resizeRatio))
    if ($RebuildThumbnails -or !(Test-Path -LiteralPath $thumbnailPath) -or (Get-Item -LiteralPath $thumbnailPath).LastWriteTimeUtc -lt $albumPhoto.LastWriteTimeUtc) {
      $thumbnailImage = New-Object System.Drawing.Bitmap($outputWidth,$outputHeight)
      $thumbnailCanvas = [System.Drawing.Graphics]::FromImage($thumbnailImage)
      $thumbnailCanvas.Clear([System.Drawing.Color]::White)
      $thumbnailCanvas.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $thumbnailCanvas.DrawImage($sourceImage,0,0,$outputWidth,$outputHeight)
      $jpegParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $jpegParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality,[long]82)
      $thumbnailImage.Save($thumbnailPath,$jpegEncoder,$jpegParameters)
      $jpegParameters.Dispose();$thumbnailCanvas.Dispose();$thumbnailImage.Dispose()
    }
    $sourceImage.Dispose()
    $thumbnailManifest[$albumPhoto.Name] = @{src=('assets/photos/'+$filenameHash+'.jpg');width=$outputWidth;height=$outputHeight}
  } catch {
    if ($sourceImage) { $sourceImage.Dispose() }
    Write-Warning ('Miniatura indisponível para '+$albumPhoto.Name+'; usando a foto original.')
  }
}
$personalCaptions = @{
 'nossa primeira foto.jpg' = 'o começo do meu melhor nós'
 'nossa primeira foto se beijando.jpg' = 'nosso primeiro beijo registrado'
 'o dia que dei as alianças.jpg' = 'um sim que eu daria todo dia'
 'elas e as garras.jpg' = 'minha mão escolheu a sua'
 'escola.jpg' = 'você deixa tudo mais divertido'
 'na sala de aula.jpg' = 'minha matéria favorita: nós'
 'inicial dela no cabelo.jpg' = 'você até nos meus detalhes'
 'nosa rede.jpg' = 'um beijo e o mundo desacelera'
 'rede.jpg' = 'meu descanso tem seu abraço'
 'barbadoskkk.jpg' = 'a gente e nossas versões favoritas'
 'ano novo.jpg' = 'meu desejo pra todos os anos: nós'
 'buque que dei pra ela.jpg' = 'flores pra minha pessoa favorita'
 'dormindo.jpg' = 'meu carinho também cuida do seu descanso'
 'risonha.jpg' = 'esse sorriso me ganha de novo'
 'shopping.jpg' = 'qualquer passeio fica melhor com você'
 'nike tn.jpg' = 'até nos pequenos detalhes, nós'
 'copa.jpg' = 'mais uma lembrança do nosso jeitinho'
}
$detailsPath = Join-Path $PSScriptRoot 'photo-details.json'
$photoDetails = if (Test-Path -LiteralPath $detailsPath) { Get-Content -LiteralPath $detailsPath -Raw -Encoding UTF8 | ConvertFrom-Json } else { [PSCustomObject]@{} }
$additionalPhotos = @()
for ($photoNumber = 0; $photoNumber -lt $photoFiles.Count; $photoNumber++) {
  $additionalPhotos += [ordered]@{file=$photoFiles[$photoNumber].Name;caption=$(if ($personalCaptions.ContainsKey($photoFiles[$photoNumber].Name)) {$personalCaptions[$photoFiles[$photoNumber].Name]} else {$captions[$photoNumber % $captions.Count]});alt=('Uma lembrança do nosso álbum, foto ' + ($photoNumber + 11));position='50% 50%'}
  $detailProperty = $photoDetails.PSObject.Properties[$photoFiles[$photoNumber].Name]
  if ($detailProperty) {
    $detail = $detailProperty.Value
    $additionalPhotos[-1].caption = $detail.caption
    $additionalPhotos[-1].alt = $detail.alt
    $additionalPhotos[-1].position = $detail.position
  }
}
$manifestJson = ConvertTo-Json -InputObject $additionalPhotos -Depth 3
Set-Content -LiteralPath (Join-Path $projectPath 'photos-manifest.js') -Value ('window.additionalMemories = ' + $manifestJson + ';' + [Environment]::NewLine + 'window.photoThumbnails = ' + (ConvertTo-Json -InputObject $thumbnailManifest -Depth 3) + ';') -Encoding UTF8
Write-Output ($photoFiles.Count.ToString() + ' fotos novas incluídas no álbum.')
