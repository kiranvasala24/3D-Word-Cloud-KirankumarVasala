from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

from services.scraper import fetch_article_data
from services.nlp import extract_keywords

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("3DCloudAPI")

app = FastAPI(title="3D Word Cloud")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    title: str = "Untitled Article"

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    url = request.url.strip()
    logger.info(f"Incoming analysis request for: {url}")

    if not url.startswith("http"):
        raise HTTPException(status_code=400, detail="Please provide a valid URL starting with http/https.")

    try:
        data = fetch_article_data(url)
        text = data["text"]
        title = data.get("title", "Unknown Article")
        
        logger.info(f"Successfully extracted content. Title: '{title}' ({len(text)} chars)")
    except Exception as e:
        logger.error(f"Extraction failed: {e}")
        raise HTTPException(status_code=422, detail=str(e))
    keywords = extract_keywords(text)
    
    if not keywords:
        raise HTTPException(status_code=422, detail="We couldn't find enough unique topics in this article.")

    return AnalyzeResponse(
        words=[WordWeight(**kw) for kw in keywords],
        article_url=url,
        title=title
    )

@app.get("/health")
def health():
    return {"status": "operational", "message": "Keyword Engine Online"}