# 3D Word Cloud

An interactive way to visualize and explore the key topics from any article as a dynamic 3D word cloud.

## Stack

**Frontend:** React + TypeScript + React Three Fiber (Three.js) + Vite
**Backend:** Python + FastAPI + BeautifulSoup + scikit-learn (TF-IDF)

## How It Works

1. User pastes a news article URL into the input field
2. The frontend sends a `POST /analyze` request to the backend
3. The backend fetches and cleans the article text using BeautifulSoup
4. Keywords are extracted using TF-IDF with NLTK stopword filtering
5. The frontend renders the results as an interactive 3D word cloud using React Three Fiber

## 🚀 Getting Started

Follow the instructions for your operating system to set up the **3D Word Cloud** explorer.

### Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.8+** (Confirm with `python --version` or `python3 --version`)
- **Node.js 18+** (Confirm with `node -v`)
- **npm** (usually comes with Node.js)

---

### 🍎 macOS & 🐧 Linux Setup

1. **Open your Terminal** and navigate to the project's root folder.
2. **Grant execution permissions** to the setup script:
   ```bash
   chmod +x setup.sh
   ```
3. **Run the installer**:
   ```bash
   ./setup.sh
   ```
   *This will automatically configure your Python virtual environment, install all dependencies, and launch the application.*

---

### 🪟 Windows Setup

1. **Open your Terminal** (PowerShell or Command Prompt) and navigate to the project's root folder.
2. **Run the setup batch file**:
   ```cmd
   setup.bat
   ```
   *The script will detect your Python installation, set up the environment, and start both the backend and frontend servers.*

---

## 🌐 Accessing the App

Once the setup is complete, your servers will be running at:
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8000](http://localhost:8000)

## 🛠️ Troubleshooting

- **Python Errors:** If the script fails to find Python, ensure it is added to your system's PATH.
- **Port Conflicts:** If ports 8000 or 5173 are already in use, the servers may fail to start. Close any applications using these ports and try again.
- **NLTK Downloads:** The script attempts to download text-processing data. If you are behind a strict firewall, you may need to download these manually.

## API

### `POST /analyze`
```json
// Request
{ "url": "https://example.com/article" }

// Response
{
  "words": [{ "word": "climate", "weight": 1.0 }, ...],
  "article_url": "https://example.com/article"
}
```

## Usage Guide

1. **Launch**: Run the appropriate setup script for your OS (instructions above).
2. **Input**: Paste a link to any online article (news, Wikipedia, blog post).
3. **Explore**: 
   - **Rotate**: Left-click and drag anywhere on the sphere to rotate it.
   - **Zoom**: Use your mouse wheel or pinch-to-zoom to get a closer look at the words.
   - **Interact**: Hover over any word to see it glow and enlarge. This highlights the word's importance (weight) in the article.

## Notes
- **Relevance**: Larger and more opaque words have a higher "weight," meaning they are more central to the article's topic.
- **Natural Language**: The engine automatically filters out common words (like "the", "and") and focuses on unique keywords and phrases.
- **Bigrams**: You will often see two-word pairs (e.g., "Artificial Intelligence") which provide more context than single words alone.