@echo off
REM ProManageX Setup Script for Windows
REM This script automates the initial setup process

echo =======================================
echo ProManageX - Automated Setup (Windows)
echo =======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node -v

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] MongoDB is not installed or not in PATH
    echo     You can either:
    echo     1. Install MongoDB locally
    echo     2. Use MongoDB Atlas (cloud database)
    echo.
) else (
    echo [OK] MongoDB is installed
)

echo.
echo Installing Backend Dependencies...
cd backend

if not exist ".env" (
    copy .env.example .env >nul
    echo [OK] Created backend\.env file
) else (
    echo [!] backend\.env already exists, skipping...
)

call npm install
echo.

echo Installing Frontend Dependencies...
cd ..\frontend

if not exist ".env" (
    copy .env.example .env >nul
    echo [OK] Created frontend\.env file
) else (
    echo [!] frontend\.env already exists, skipping...
)

call npm install
echo.

cd ..

echo =======================================
echo [OK] Setup Complete!
echo.
echo Next steps:
echo.
echo 1. Make sure MongoDB is running
echo    Start MongoDB service from Windows Services
echo.
echo 2. Seed the database (Command Prompt 1):
echo    cd backend
echo    npm run seed
echo.
echo 3. Start the backend (Command Prompt 1):
echo    cd backend
echo    npm run dev
echo.
echo 4. Start the frontend (Command Prompt 2):
echo    cd frontend
echo    npm run dev
echo.
echo 5. Open http://localhost:3000 in your browser
echo.
echo 6. Login with:
echo    Email: admin@promanagex.com
echo    Password: admin123
echo.
echo For more details, see QUICKSTART.md
echo.
pause
