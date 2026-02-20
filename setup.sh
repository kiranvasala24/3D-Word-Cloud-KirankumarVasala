#!/bin/bash

# --- Visual Styling ---
echo "======================================================"
echo "         3D WORD CLOUD - One-Click Setup"
echo "======================================================"
echo

# 1. Check Prerequisites
echo "[1/3] Checking prerequisites..."
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "[ERROR] Python is not installed."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "[ERROR] Node.js/npm is not installed."
    exit 1
fi
echo "[OK] Prerequisites found."
echo

# 2. Setup Backend
echo "[2/3] Setting up Backend (Python)..."
cd backend

# Detect available Python command
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

# Create a virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    $PYTHON_CMD -m venv venv
fi

# Activate and install dependencies
source venv/bin/activate
echo "Installing Python dependencies..."
pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

# Pre-download required NLTK data
echo "Downloading NLTK data..."
$PYTHON_CMD -c "import nltk; nltk.download('stopwords', quiet=True); nltk.download('punkt', quiet=True); nltk.download('punkt_tab', quiet=True)"
cd ..
echo "[OK] Backend setup complete."
echo

# 3. Setup Frontend
echo "[3/3] Setting up Frontend (React)..."
cd frontend
echo "Installing npm packages..."
npm install --no-fund --no-audit --quiet
cd ..
echo "[OK] Frontend setup complete."
echo

# Launch Application
echo "------------------------------------------------------"
echo " Everything is ready! Launching servers..."
echo " - Backend: http://localhost:8000"
echo " - Frontend: http://localhost:5173"
echo 
echo "Press Ctrl+C to stop both servers."
echo "------------------------------------------------------"
echo

# Start both servers
npx concurrently --kill-others --names "BACKEND,FRONTEND" --prefix_colors "magenta,cyan" \
  "cd backend && source venv/bin/activate && uvicorn main:app --port 8000 --reload --no-use-colors" \
  "cd frontend && npm run dev -- --no-color"