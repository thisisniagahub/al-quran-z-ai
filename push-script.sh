#!/bin/bash

echo "🚀 Al-Quran Digital - Git Push Script"
echo "======================================"

# Check if we're on the right branch
echo "📍 Current branch: $(git branch --show-current)"

# Add all changes
echo "📦 Adding changes..."
git add .

# Commit with timestamp
echo "💾 Creating commit..."
git commit -m "$(cat <<'EOF'
Deploy Al-Quran Digital to production

✅ Features:
- Complete 10-module Quran learning application
- AI Ustaz/Ustazah Assistant (JAKIM compliant)
- Advanced Quran Search with 6 search types
- SRS Learning System with scientific algorithms
- Achievement System with 30+ badges
- Quote Sharing with AI image generation
- Audio Recitation with 6 famous reciters
- Prayer Times for Malaysia & Indonesia
- Floating AI Assistant (24/7)
- Mobile-first responsive design

🔧 Technical Stack:
- Next.js 15 with App Router
- TypeScript 5
- Tailwind CSS + shadcn/ui
- Socket.io for real-time features
- Z-AI SDK integration

🌟 Ready for production deployment!

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

echo "🚀 Pushing to GitHub..."
git push origin master

echo "✅ Done! Check your repository at:"
echo "🔗 https://github.com/thisisniagahub/al-quran-z-ai"
echo ""
echo "📱 Next step: Deploy to Vercel"
echo "🔗 https://vercel.com/new?utm_medium=default-template&filter=next.js"
echo ""
echo "🎯 Your app will be live at:"
echo "🌐 https://al-quran-z-ai.vercel.app"