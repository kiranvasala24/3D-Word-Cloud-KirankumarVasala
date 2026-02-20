# 3D Word Cloud

An interactive way to visualize and explore the key topics from any article as a dynamic 3D word cloud.

## 🛠️ Tech Stack

-   **Frontend:** React, TypeScript, Three.js (via React Three Fiber), Vite.
-   **Backend:** Python 3, FastAPI, BeautifulSoup4, scikit-learn (TF-IDF), NLTK.

---

## 📋 Prerequisites

Before you start, make sure you have the following installed on your system:

| Tool | version | Download Link |
| :--- | :--- | :--- |
| **Python** | 3.8+ | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **npm** | (with Node) | Included with Node.js |

---

## 🚀 Installation Guide

### 🪟 Windows (Recommended)
1.  **Download/Clone** this repository to your computer.
2.  **Open the folder** in File Explorer.
3.  **Double-click `setup.bat`**.
    *   The script will check your environment, install dependencies, and launch the app automatically.
    *   *Note: If Windows warns about a batch file, click "More Info" -> "Run Anyway".*

### 🍎 macOS & 🐧 Linux
1.  **Open your Terminal** and navigate to the project root.
2.  **Make the script executable**:
    ```bash
    chmod +x setup.sh
    ```
3.  **Run the script**:
    ```bash
    ./setup.sh
    ```
    *This will handle virtual environment creation, pip installs, and npm dependencies.*

---

## ⚙️ Manual Installation (Optional)

If you prefer to set up the project manually, follow these steps:

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -c "import nltk; nltk.download('stopwords'); nltk.download('punkt'); nltk.download('punkt_tab')"
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🎮 How to Use

1.  **Launch the App**: Access the dashboard at [http://localhost:5173](http://localhost:5173).
2.  **Analyze an Article**: Paste a URL (e.g., a news story or Wikipedia page) into the input field and hit **Generate**.
3.  **Interact with the Cloud**:
    *   **Rotate**: Left-click and drag to spin the 3D sphere.
    *   **Zoom**: Use the mouse wheel to move closer or further away.
    *   **Explore**: Hover over words to see them highlight. Larger words represent more frequent or significant topics.

---

## ❓ Troubleshooting

-   **Python not found**: Ensure Python is added to your system's "PATH" environment variable.
-   **Port in use**: If port 8000 or 5173 is occupied, the app won't start. Close the conflicting app or restart your terminal.
-   **NLTK Timeout**: If the NLTK download fails, check your internet connection or firewall settings.

---

## 📄 License & Notes
*   **Keywords**: The engine uses TF-IDF to find the most unique and relevant words, ignoring common "stop words" like *the, a, is*.
*   **Performance**: The 3D view is GPU-accelerated for smooth 60fps performance even with many words.