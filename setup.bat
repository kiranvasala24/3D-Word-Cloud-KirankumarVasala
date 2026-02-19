@echo off
setlocal

echo [1/3] Setting up Backend Virtual Environment...
cd backend
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt
python -c "import nltk; nltk.download('stopwords'); nltk.download('punkt'); nltk.download('punkt_tab')"
cd ..

echo [2/3] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo [3/3] Starting Servers...
echo Backend will be at http://localhost:8000
echo Frontend will be at http://localhost:5173
echo.
echo CTRL+C to stop servers
echo.

npx concurrently "cd backend && venv\Scripts\uvicorn main:app --reload" "cd frontend && npm run dev"
