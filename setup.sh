#!/bin/bash

# --- 3D Word Cloud: One-Click Setup for Linux/macOS / Windows ---

# 1. Setup Backend
cd backend
# Detect available Python command
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

# Create a virtual environment to isolate dependencies
$PYTHON_CMD -m venv venv
# Activate the environment
source venv/bin/activate
# Upgrade pip and install all required Python libraries
pip install --upgrade pip
pip install -r requirements.txt
# Pre-download required NLTK data (stopwords and tokenizers)
$PYTHON_CMD -c "import nltk; nltk.download('stopwords'); nltk.download('punkt'); nltk.download('punkt_tab')"
cd ..


# 2. Setup Frontend
cd frontend
# Install all React/Node dependencies
npm install
cd ..

# 3. Launch the Application
# This will start the Backend (Port 8000) and Frontend (Port 5173) at the same time
npx concurrently \
  --names "BACKEND,FRONTEND" \
  --prefix_colors "magenta,cyan" \
  "cd backend && source venv/bin/activate && uvicorn main:app --port 8000 --reload" \
  "cd frontend && npm run dev"