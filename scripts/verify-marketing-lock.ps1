# Ensures marketing patch scripts stay archived and Landing.tsx is not corrupted.
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

Write-Host "Marketing website lock check..." -ForegroundColor Cyan

$errors = 0

$forbidden = @(
  "fix-landing.mjs",
  "fix-landing-final.mjs",
  "fix-landing-tags.mjs",
  "patch-landing.mjs",
  "patch-mobile-marketing.mjs",
  "fix-motion-div-closes.mjs"
)

foreach ($name in $forbidden) {
  if (Test-Path (Join-Path $root "scripts\$name")) {
    Write-Host "[ERROR] Active patch script must be archived: scripts\$name" -ForegroundColor Red
    $errors++
  }
}

$landingPath = Join-Path $root "src\pages\Landing.tsx"
$landing = Get-Content $landingPath -Raw

# fix-landing.mjs bug: mockup column is div but wrongly closed with motion.div
$badClose = "</" + "motion.div>"
if ($landing -match ("HeroDashboardMockup\s*/>\s*" + [regex]::Escape($badClose))) {
  Write-Host "[ERROR] Landing.tsx: mockup column closed with motion.div tag." -ForegroundColor Red
  Write-Host "        Run: git checkout HEAD -- src/pages/Landing.tsx" -ForegroundColor Yellow
  $errors++
}

if ($landing -notmatch "marketing-landing-hero") {
  Write-Host "[ERROR] Landing.tsx missing marketing-landing-hero section." -ForegroundColor Red
  $errors++
}

$cssPath = Join-Path $root "src\index.css"
$css = Get-Content $cssPath -Raw
if ($css -match "88svh") {
  Write-Host "[WARN] index.css may use full-viewport hero (88svh). Prefer fixed px heights." -ForegroundColor Yellow
}

if ($errors -gt 0) {
  Write-Host ""
  Write-Host "See docs/MARKETING_WEBSITE_LOCK.md" -ForegroundColor Red
  exit 1
}

Write-Host "[OK] Marketing lock checks passed." -ForegroundColor Green
exit 0
