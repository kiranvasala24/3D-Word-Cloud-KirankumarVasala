@echo off
setlocal
title 3D Word Cloud Setup

echo ======================================================
echo          3D WORD CLOUD - One-Click Setup
echo ======================================================
echo.

:: 1. Check Prerequisites
echo [1/3] Checking prerequisites...
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install it from python.org
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install it from nodejs.org
    pause
    exit /b 1
)
echo [OK] Prerequisites found.
echo.

:: 2. Setup Backend
echo [2/3] Setting up Backend (Python)...
cd backend

set PYTHON_CMD=python
python --version >nul 2>&1
if errorlevel 1 (
    set PYTHON_CMD=python3
)

if not exist venv (
    echo Creating virtual environment...
    %PYTHON_CMD% -m venv venv
)

echo Installing Python dependencies...
call venv\Scripts\activate
pip install -r requirements.txt

echo Downloading NLTK data...
%PYTHON_CMD% -c "import nltk; nltk.download('stopwords', quiet=True); nltk.download('punkt', quiet=True)"

cd ..
echo [OK] Backend setup complete.
echo.

:: 3. Setup Frontend
echo [3/3] Setting up Frontend (React)...
cd frontend
echo Installing npm packages...
call npm install
cd ..
echo [OK] Frontend setup complete.
echo.

echo ------------------------------------------------------
echo  Everything is ready! Launching servers...
echo  - Backend:  http://localhost:8000
echo  - Frontend: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers.
echo ------------------------------------------------------
echo.


:: Launch Backend in new window
start "Backend Server" cmd /k "cd backend && venv\Scripts\python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: Launch Frontend in new window
start "Frontend Server" cmd /k "cd frontend && npm run dev"