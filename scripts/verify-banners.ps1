# Banner Verification Script
# This script verifies all banner images exist and are tracked in git

Write-Host "Verifying Banner Assets..." -ForegroundColor Cyan
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

$missing = @()
$notTracked = @()

foreach ($banner in $banners) {
    $path = "public\$banner"
    
    if (Test-Path $path) {
        Write-Host "[OK] $banner exists" -ForegroundColor Green
        
        # Check if tracked in git
        $gitCheck = git ls-files $path 2>&1
        if ($LASTEXITCODE -ne 0 -or $gitCheck -eq "") {
            Write-Host "[WARNING] $banner is NOT tracked in git!" -ForegroundColor Yellow
            $notTracked += $banner
        }
    } else {
        Write-Host "[ERROR] $banner MISSING!" -ForegroundColor Red
        $missing += $banner
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "Total banners: $($banners.Count)"
Write-Host "Found: $($banners.Count - $missing.Count)" -ForegroundColor Green
if ($missing.Count -gt 0) {
    Write-Host "Missing: $($missing.Count)" -ForegroundColor Red
} else {
    Write-Host "Missing: 0" -ForegroundColor Green
}
if ($notTracked.Count -gt 0) {
    Write-Host "Not tracked in git: $($notTracked.Count)" -ForegroundColor Yellow
} else {
    Write-Host "Not tracked in git: 0" -ForegroundColor Green
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "Missing banners:" -ForegroundColor Red
    foreach ($b in $missing) {
        Write-Host "  - $b" -ForegroundColor Red
    }
    exit 1
}

if ($notTracked.Count -gt 0) {
    Write-Host ""
    Write-Host "Banners not tracked in git:" -ForegroundColor Yellow
    foreach ($b in $notTracked) {
        Write-Host "  - $b" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Run: git add public\$($notTracked -join ' public\')" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "All banners verified and tracked!" -ForegroundColor Green
exit 0
