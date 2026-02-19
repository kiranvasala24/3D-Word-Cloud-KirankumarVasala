# 3D Word Cloud

An interactive website that visualizes topics from a news article as a 3D word cloud.

## Stack

**Frontend:** React + TypeScript + React Three Fiber (Three.js) + Vite
**Backend:** Python + FastAPI + BeautifulSoup + scikit-learn (TF-IDF)

## How It Works

1. User pastes a news article URL into the input field
2. The frontend sends a `POST /analyze` request to the backend
3. The backend fetches and cleans the article text using BeautifulSoup
4. Keywords are extracted using TF-IDF with NLTK stopword filtering
5. The frontend renders the results as an interactive 3D word cloud using React Three Fiber

## Setup & Running
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Create a Python virtual environment and install backend dependencies
- Install frontend npm packages
- Start both servers concurrently

**Backend:** http://localhost:8000
**Frontend:** http://localhost:5173

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

## Notes

- Word size and opacity in the 3D cloud map to TF-IDF weight (relevance)
- Words are distributed using a Fibonacci sphere algorithm for even spacing
- Hover over words to highlight them; drag to rotate the sphere
- Bigrams (two-word phrases) are included alongside single keywords