@echo off
setlocal

:: --- 3D Word Cloud : One-Click Setup for Windows ---

:: 1. Setup Backend
echo Setting up backend...
cd backend

:: Detect Python command
set PYTHON_CMD=python
python --version >nul 2>&1
if errorlevel 1 (
    set PYTHON_CMD=python3
)

:: Create virtual environment if it doesn't already exist
if not exist venv (
    %PYTHON_CMD% -m venv venv
)
:: Activate the environment and install dependencies
call venv\Scripts\activate
pip install -r requirements.txt
:: Download NLTK datasets for text processing
%PYTHON_CMD% -c "import nltk; nltk.download('stopwords'); nltk.download('punkt'); nltk.download('punkt_tab')"
cd ..

:: 2. Setup Frontend
echo Installing frontend dependencies...
cd frontend
:: Install all npm packages from package.json
call npm install
cd ..

:: 3. Finish and Launch
echo Launching application...
:: Starts both the FastAPI server and Vite dev server simultaneously
npx concurrently --names "BACKEND,FRONTEND" --prefix_colors "magenta,cyan" "cd backend && venv\Scripts\uvicorn main:app --reload" "cd frontend && npm run dev"

