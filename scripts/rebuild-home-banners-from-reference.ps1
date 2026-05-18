# Rebuild public/banner-1.jpg … banner-3.jpg from repo-root reference captures (1.PNG, 2.PNG, 3.PNG).
# Crops below the navbar and uses the RIGHT portion of the frame so baked-in hero text is excluded
# (full-frame screenshots would duplicate the live React headline).
# Requires: npx sharp-cli (same as other image tasks in this repo).

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

$nav = 88
$left = 540
$w = 1920 - $left

$crops = @(
  @{ File = "1.PNG";  H = 695; Out = "public\banner-1.jpg" },
  @{ File = "2.PNG";  H = 683; Out = "public\banner-2.jpg" },
  @{ File = "3.PNG";  H = 686; Out = "public\banner-3.jpg" }
)

foreach ($c in $crops) {
  $inPath = Join-Path $root $c.File
  if (-not (Test-Path $inPath)) {
    Write-Host "[SKIP] Missing $($c.File)" -ForegroundColor Yellow
    continue
  }
  $tmp = Join-Path $root "public\_banner-crop-tmp.jpg"
  $outPath = Join-Path $root $c.Out
  npx --yes sharp-cli extract $nav $left $w $c.H -i $inPath -o $tmp
  npx --yes sharp-cli resize 1600 896 -i $tmp -o $outPath --fit cover --position centre
  Remove-Item $tmp -Force
  Write-Host "[OK] $($c.Out)" -ForegroundColor Green
}

Write-Host "Done. Hard-refresh the homepage to load new JPGs." -ForegroundColor Cyan
