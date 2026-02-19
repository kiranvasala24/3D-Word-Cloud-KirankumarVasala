import re
import logging
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer

logger = logging.getLogger("3DCloud.Analyzer")

def setup_nltk():
    for pkg in ["stopwords", "punkt", "punkt_tab"]:
        try:
            nltk.download(pkg, quiet=True)
        except Exception as e:
            logger.warning(f"NLTK download skipped for {pkg}: {e}")

setup_nltk()

from nltk.corpus import stopwords
STOP_WORDS = set(stopwords.words("english"))

EXTRA_STOP_WORDS = {
    "said", "says", "also", "would", "could", "one", "two", "three",
    "new", "like", "get", "make", "us", "year", "years", "time",
    "people", "way", "just", "use", "used", "using", "will", "even",
    "many", "much", "still", "well", "back", "first", "last", "since",
    "may", "today", "yesterday", "going", "take", "know", "see"
}

ALL_STOP_WORDS = STOP_WORDS.union(EXTRA_STOP_WORDS)

def clean_text(text: str) -> str:
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.lower().strip()

def extract_keywords(text: str, top_n: int = 60) -> list[dict]:
    cleaned = clean_text(text)
    
    if len(cleaned.split()) < 10:
        return []

    try:
        vectorizer = TfidfVectorizer(
            stop_words=list(ALL_STOP_WORDS),
            ngram_range=(1, 2),
            max_features=250,
            token_pattern=r'(?u)\b[a-z]{3,}\b'
        )
        
        tfidf_matrix = vectorizer.fit_transform([cleaned])
        feature_names = vectorizer.get_feature_names_out()
        scores = tfidf_matrix.toarray()[0]
        
        word_scores = [
            {"word": feature_names[i], "weight": float(scores[i])}
            for i in range(len(feature_names)) if scores[i] > 0
        ]
        
        word_scores.sort(key=lambda x: x["weight"], reverse=True)
        top_words = word_scores[:top_n]
        
        if top_words:
            max_w = top_words[0]["weight"]
            for item in top_words:
                item["weight"] = round(item["weight"] / max_w, 4)
            
        return top_words
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        return []