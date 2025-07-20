# Railway Socket Server Deployment Script
Write-Host "=====================================" -ForegroundColor Green
Write-Host "   RAILWAY SOCKET SERVER DEPLOYMENT" -ForegroundColor Green  
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Navigating to socket-server directory..." -ForegroundColor Yellow
Set-Location "c:\Users\dell\Desktop\jharufy\socket-server"
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 2: Checking Railway CLI..." -ForegroundColor Yellow
try {
    $version = railway --version
    Write-Host "Railway CLI version: $version" -ForegroundColor Green
} catch {
    Write-Host "Railway CLI not found. Installing..." -ForegroundColor Red
    npm install -g @railway/cli
}
Write-Host ""

Write-Host "Step 3: Checking socket server files..." -ForegroundColor Yellow
Get-ChildItem | Format-Table Name, Length
Write-Host ""

Write-Host "Step 4: Starting Railway authentication..." -ForegroundColor Yellow
Write-Host "This will open your browser for authentication." -ForegroundColor Cyan
railway login
Write-Host ""

Write-Host "Step 5: Initializing Railway project..." -ForegroundColor Yellow
railway init
Write-Host ""

Write-Host "Step 6: Deploying to Railway..." -ForegroundColor Yellow
railway up
Write-Host ""

Write-Host "Step 7: Getting deployment URL..." -ForegroundColor Yellow
$domain = railway domain
Write-Host "Your Railway URL: $domain" -ForegroundColor Green
Write-Host ""

Write-Host "=====================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the Railway URL shown above" -ForegroundColor White
Write-Host "2. Update frontend/.env with: VITE_SOCKET_URL=your-railway-url" -ForegroundColor White
Write-Host "3. Test your socket server at the provided URL" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue..."
