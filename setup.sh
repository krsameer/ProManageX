#!/bin/bash

# ProManageX Setup Script
# This script automates the initial setup process

echo "🚀 ProManageX - Automated Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH"
    echo "   You can either:"
    echo "   1. Install MongoDB locally"
    echo "   2. Use MongoDB Atlas (cloud database)"
    echo ""
else
    echo "✅ MongoDB version: $(mongod --version | head -n 1)"
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created backend/.env file"
else
    echo "⚠️  backend/.env already exists, skipping..."
fi
npm install
echo ""

echo "📦 Installing Frontend Dependencies..."
cd ../frontend
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created frontend/.env file"
else
    echo "⚠️  frontend/.env already exists, skipping..."
fi
npm install
echo ""

cd ..

echo "================================"
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo ""
echo "1. Make sure MongoDB is running:"
echo "   macOS: brew services start mongodb-community"
echo "   Linux: sudo systemctl start mongod"
echo "   Windows: Start MongoDB service"
echo ""
echo "2. Seed the database (Terminal 1):"
echo "   cd backend"
echo "   npm run seed"
echo ""
echo "3. Start the backend (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "4. Start the frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "6. Login with:"
echo "   Email: admin@promanagex.com"
echo "   Password: admin123"
echo ""
echo "📖 For more details, see QUICKSTART.md"
echo ""
