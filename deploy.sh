#!/bin/bash

# 🚀 Anime Portal Deployment Script
# Choose your deployment method

echo "🎌 Anime Portal Deployment"
echo "=========================="
echo ""
echo "Choose deployment method:"
echo "1) Quick Deploy (Vercel + Railway)"
echo "2) Docker Compose (Local/VPS)"
echo "3) Manual Setup Guide"
echo ""

read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo "🚀 Quick Deploy Mode"
    echo "==================="
    
    # Check if CLI tools are installed
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    if ! command -v railway &> /dev/null; then
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Deploy Frontend
    echo "📦 Deploying Frontend to Vercel..."
    cd client
    vercel --prod
    cd ..
    
    # Deploy Backend
    echo "⚙️ Deploying Backend to Railway..."
    cd server
    railway login
    railway add
    railway up
    cd ..
    
    echo "✅ Deployment Complete!"
    echo "Frontend: Check Vercel dashboard for URL"
    echo "Backend: Check Railway dashboard for URL"
    ;;
    
  2)
    echo "🐳 Docker Deployment"
    echo "==================="
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker not found. Please install Docker first."
        exit 1
    fi
    
    echo "Building and starting containers..."
    docker-compose up --build -d
    
    echo "✅ Deployment Complete!"
    echo "Frontend: http://localhost:3000"
    echo "Backend: http://localhost:5000"
    echo "MongoDB: localhost:27017"
    ;;
    
  3)
    echo "📖 Manual Setup Guide"
    echo "===================="
    echo ""
    echo "Frontend (Vercel):"
    echo "1. Go to vercel.com and create account"
    echo "2. Connect GitHub repo"
    echo "3. Set build command: npm run build"
    echo "4. Set output directory: dist"
    echo "5. Add environment variables"
    echo ""
    echo "Backend (Railway/Heroku):"
    echo "1. Create account on railway.app"
    echo "2. Connect GitHub repo"
    echo "3. Select server folder"
    echo "4. Add environment variables"
    echo "5. Deploy!"
    echo ""
    echo "📄 Full guide available in DEPLOYMENT_GUIDE.md"
    ;;
    
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac