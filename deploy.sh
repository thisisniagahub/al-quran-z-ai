#!/bin/bash

echo "🚀 Deploying Al-Quran Digital to Vercel..."
echo "=========================================="

# Check if we have the necessary files
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Deployment Options:"
    echo "1. GitHub Integration: Connect your repository to Vercel dashboard"
    echo "2. Manual Upload: Upload the .next folder to Vercel"
    echo "3. Vercel CLI: Use 'vercel --prod' after authentication"
    echo ""
    echo "📊 Build Summary:"
    echo "- Framework: Next.js 15"
    echo "- Language: TypeScript"
    echo "- Styling: Tailwind CSS"
    echo "- Database: Prisma (SQLite)"
    echo "- Deployment Region: Singapore (sin1)"
    echo ""
    echo "🔗 Live Preview: https://al-quran-z-ai.vercel.app"
    echo "📂 Source Code: https://github.com/thisisniagahub/al-quran-z-ai"
    echo ""
    echo "✨ Your application is ready for deployment!"
else
    echo "❌ Build failed!"
    exit 1
fi