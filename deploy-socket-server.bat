@echo off
echo =====================================
echo   RAILWAY SOCKET SERVER DEPLOYMENT
echo =====================================
echo.

echo Step 1: Navigating to socket-server directory...
cd /d "c:\Users\dell\Desktop\jharufy\socket-server"
echo Current directory: %cd%
echo.

echo Step 2: Checking Railway CLI...
railway --version
if %errorlevel% neq 0 (
    echo ERROR: Railway CLI not found. Installing...
    npm install -g @railway/cli
)
echo.

echo Step 3: Checking current directory contents...
dir
echo.

echo Step 4: Starting Railway authentication...
echo This will open your browser for authentication.
railway login
echo.

echo Step 5: Initializing Railway project...
railway init
echo.

echo Step 6: Deploying to Railway...
railway up
echo.

echo Step 7: Getting deployment URL...
railway domain
echo.

echo =====================================
echo   DEPLOYMENT COMPLETE!
echo =====================================
echo.
echo Next steps:
echo 1. Copy the Railway URL shown above
echo 2. Update frontend/.env with: VITE_SOCKET_URL=your-railway-url
echo 3. Test your socket server at the provided URL
echo.
pause
