#!/bin/bash

# Range Pilot - Local Setup Script
# This script sets up and runs the app locally

echo "🚀 Range Pilot - Offline Trading App"
echo "======================================"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    echo "Download from: https://nodejs.org"
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Build the app
echo "🔨 Building app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ App built successfully"
echo ""

echo "════════════════════════════════════"
echo "✅ Setup complete!"
echo "════════════════════════════════════"
echo ""
echo "To run the app locally:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "To build for Android:"
echo "  npx cap add android"
echo "  npm run build"
echo "  npx cap sync"
echo "  npx cap open android"
echo ""
