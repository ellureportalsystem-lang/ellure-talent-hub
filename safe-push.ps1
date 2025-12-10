# Safe Git Push Script
# This script performs a safe push by:
# 1. Checking for uncommitted changes
# 2. Pulling latest changes
# 3. Pushing to remote

Write-Host "=== Safe Git Push ===" -ForegroundColor Cyan

# Check for uncommitted changes
Write-Host "`nChecking for uncommitted changes..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "WARNING: You have uncommitted changes:" -ForegroundColor Red
    Write-Host $status
    $response = Read-Host "Do you want to commit these changes first? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        $commitMsg = Read-Host "Enter commit message"
        git add .
        git commit -m $commitMsg
        Write-Host "Changes committed successfully." -ForegroundColor Green
    } else {
        Write-Host "Skipping commit. Proceeding with push..." -ForegroundColor Yellow
    }
} else {
    Write-Host "No uncommitted changes found." -ForegroundColor Green
}

# Get current branch
$currentBranch = git branch --show-current
Write-Host "`nCurrent branch: $currentBranch" -ForegroundColor Cyan

# Fetch latest changes
Write-Host "`nFetching latest changes from remote..." -ForegroundColor Yellow
git fetch origin

# Check if local branch is behind remote
$localCommit = git rev-parse HEAD
$remoteCommit = git rev-parse "origin/$currentBranch" 2>$null

if ($remoteCommit -and $localCommit -ne $remoteCommit) {
    Write-Host "`nLocal branch is behind remote. Pulling changes..." -ForegroundColor Yellow
    git pull origin $currentBranch --no-edit
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Pull failed due to conflicts. Please resolve conflicts manually." -ForegroundColor Red
        exit 1
    }
    Write-Host "Successfully pulled latest changes." -ForegroundColor Green
} else {
    Write-Host "Local branch is up to date with remote." -ForegroundColor Green
}

# Push to remote
Write-Host "`nPushing to remote..." -ForegroundColor Yellow
git push origin $currentBranch

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully pushed to remote!" -ForegroundColor Green
} else {
    Write-Host "`nPush failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}

