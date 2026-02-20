@echo off
setlocal
title 3D Word Cloud Setup

:: --- Visual Styling ---
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

:: Detect Python command
set PYTHON_CMD=python
python --version >nul 2>&1
if errorlevel 1 (
    set PYTHON_CMD=python3
)

:: Create virtual environment if it doesn't already exist
if not exist venv (
    echo Creating virtual environment...
    %PYTHON_CMD% -m venv venv
)

:: Activate the environment and install dependencies
echo Installing Python dependencies...
call venv\Scripts\activate
pip install -r requirements.txt --quiet

:: Download NLTK datasets for text processing
echo Downloading NLTK data...
%PYTHON_CMD% -c "import nltk; nltk.download('stopwords', quiet=True); nltk.download('punkt', quiet=True); nltk.download('punkt_tab', quiet=True)"
cd ..
echo [OK] Backend setup complete.
echo.

:: 3. Setup Frontend
echo [3/3] Setting up Frontend (React)...
cd frontend
echo Installing npm packages...
call npm install --no-fund --no-audit --quiet
cd ..
echo [OK] Frontend setup complete.
echo.

:: Launch Application
echo ------------------------------------------------------
echo  Everything is ready! Launching servers...
echo  - Backend will run on: http://localhost:8000
echo  - Frontend will run on: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers at once.
echo ------------------------------------------------------
echo.

:: Start both servers
:: Added --kill-others to stop both when one fails/stops
:: Added --prefix-colors for better visual separation
:: Added --no-use-colors and --no-color to avoid messy ANSI codes in basic terminals
npx concurrently --kill-others --names "BACKEND,FRONTEND" --prefix_colors "magenta,cyan" "cd backend && venv\Scripts\uvicorn main:app --reload --no-use-colors" "cd frontend && npx vite --no-color"
