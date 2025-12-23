# Pre-Push Banner Check
# Run this before pushing to ensure banners are committed

Write-Host "Pre-Push Banner Verification..." -ForegroundColor Cyan
Write-Host ""

$banners = @(
    "banner-1.jpg",
    "banner-2.jpg", 
    "banner-3.jpg",
    "cta-banner.jpg",
    "about-banner.jpg",
    "about-cta-banner.jpg",
    "services-banner.jpg",
    "services-cta-banner.jpg",
    "features-banner.jpg",
    "features-cta-banner.jpg",
    "industries-banner.jpg",
    "industries-cta-banner.jpg",
    "contact-banner.jpg",
    "contact-business-hours-banner.jpg"
)

$errors = 0

foreach ($banner in $banners) {
    $path = "public\$banner"
    
    # Check if file exists
    if (-not (Test-Path $path)) {
        Write-Host "[ERROR] MISSING: $banner" -ForegroundColor Red
        $errors++
        continue
    }
    
    # Check if tracked in git
    $gitCheck = git ls-files $path 2>&1
    if ($LASTEXITCODE -ne 0 -or $gitCheck -eq "") {
        Write-Host "[WARNING] NOT TRACKED: $banner - Adding to git..." -ForegroundColor Yellow
        git add $path
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Added $banner to git" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] Failed to add $banner" -ForegroundColor Red
            $errors++
        }
    } else {
        Write-Host "[OK] $banner is tracked" -ForegroundColor Green
    }
}

if ($errors -gt 0) {
    Write-Host ""
    Write-Host "Found $errors issues. Please fix before pushing." -ForegroundColor Red
    Write-Host "Run: git add public\*.jpg && git commit -m 'Add banner images'" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "All banners verified! Safe to push." -ForegroundColor Green
exit 0
