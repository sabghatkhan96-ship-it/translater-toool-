# ============================================================================
# TranslateHub — GitHub Push & Vercel Ready Script
# Target Repo: https://github.com/sabghatkhan96-ship-it/translater-toool-.git
# ============================================================================

Set-Location "e:\all\testing 3"

if (-not (Test-Path ".git")) {
    git init
}

git branch -M main

# Configure remote origin
$existingRemote = git remote
if ($existingRemote -contains "origin") {
    git remote set-url origin "https://github.com/sabghatkhan96-ship-it/translater-toool-.git"
} else {
    git remote add origin "https://github.com/sabghatkhan96-ship-it/translater-toool-.git"
}

git add .
git commit -m "Deploy TranslateHub: Full Animated AI Translation Web App with Urdu & 7,100+ Languages"
git push -u origin main --force

Write-Host "=====================================================" -ForegroundColor Green
Write-Host " Successfully pushed TranslateHub to GitHub!" -ForegroundColor Cyan
Write-Host " Repo: https://github.com/sabghatkhan96-ship-it/translater-toool-" -ForegroundColor Yellow
Write-Host " Ready to import directly into Vercel!" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
