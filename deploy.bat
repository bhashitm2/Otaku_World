@echo off
REM 🚀 Anime Portal Deployment Script for Windows
REM Choose your deployment method

echo 🎌 Anime Portal Deployment
echo ==========================
echo.
echo Choose deployment method:
echo 1) Quick Deploy (Vercel + Railway)
echo 2) Docker Compose (Local/VPS)
echo 3) Manual Setup Guide
echo.

set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    echo 🚀 Quick Deploy Mode
    echo ===================
    
    REM Check if Node.js is installed
    node --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ Node.js not found. Please install Node.js first.
        pause
        exit /b 1
    )
    
    REM Install CLI tools
    echo Installing deployment tools...
    npm install -g vercel @railway/cli
    
    REM Deploy Frontend
    echo 📦 Deploying Frontend to Vercel...
    cd client
    vercel --prod
    cd ..
    
    REM Deploy Backend  
    echo ⚙️ Deploying Backend to Railway...
    cd server
    railway login
    railway add
    railway up
    cd ..
    
    echo ✅ Deployment Complete!
    echo Frontend: Check Vercel dashboard for URL
    echo Backend: Check Railway dashboard for URL
    
) else if "%choice%"=="2" (
    echo 🐳 Docker Deployment
    echo ===================
    
    REM Check if Docker is installed
    docker --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ Docker not found. Please install Docker Desktop first.
        pause
        exit /b 1
    )
    
    echo Building and starting containers...
    docker-compose up --build -d
    
    echo ✅ Deployment Complete!
    echo Frontend: http://localhost:3000
    echo Backend: http://localhost:5000
    echo MongoDB: localhost:27017
    
) else if "%choice%"=="3" (
    echo 📖 Manual Setup Guide
    echo ====================
    echo.
    echo Frontend (Vercel):
    echo 1. Go to vercel.com and create account
    echo 2. Connect GitHub repo
    echo 3. Set build command: npm run build
    echo 4. Set output directory: dist
    echo 5. Add environment variables
    echo.
    echo Backend (Railway/Heroku):
    echo 1. Create account on railway.app
    echo 2. Connect GitHub repo
    echo 3. Select server folder
    echo 4. Add environment variables
    echo 5. Deploy!
    echo.
    echo 📄 Full guide available in DEPLOYMENT_GUIDE.md
    
) else (
    echo ❌ Invalid choice
)

echo.
pause