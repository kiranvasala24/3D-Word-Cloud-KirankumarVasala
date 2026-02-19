from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

from services.scraper import fetch_article_text
from services.nlp import extract_keywords

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="3D Word Cloud API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    url: str


class WordWeight(BaseModel):
    word: str
    weight: float


class AnalyzeResponse(BaseModel):
    words: list[WordWeight]
    article_url: str


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    url_str = request.url.strip()
    logger.info(f"Analyzing URL: {url_str}")

    if not url_str.startswith("http"):
        raise HTTPException(status_code=400, detail="Invalid URL — must start with http or https.")

    try:
        text = fetch_article_text(url_str)
        logger.info(f"Fetched text length: {len(text)}")
    except Exception as e:
        logger.error(f"Scraper error: {str(e)}")
        raise HTTPException(status_code=422, detail=f"Failed to fetch article: {str(e)}")

    if len(text.strip()) < 100:
        raise HTTPException(status_code=422, detail="Not enough text found — page may be paywalled or JS-rendered.")

    keywords = extract_keywords(text)
    logger.info(f"Extracted {len(keywords)} keywords")

    if not keywords:
        raise HTTPException(status_code=422, detail="Could not extract meaningful keywords from the article.")

    return AnalyzeResponse(
        words=[WordWeight(**kw) for kw in keywords],
        article_url=url_str,
    )


@app.get("/health")
def health():
    return {"status": "ok"}