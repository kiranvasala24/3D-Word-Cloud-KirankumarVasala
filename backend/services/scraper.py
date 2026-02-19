import httpx
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger(__name__)

_BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/604.1"
    ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Cache-Control": "max-age=0",
}

def _extract_page_info(html: str) -> dict | None:
    soup = BeautifulSoup(html, "html.parser")
    
    title = ""
    title_node = soup.find("h1") or soup.find("title")
    if title_node:
        title = title_node.get_text(strip=True)

    for tag in soup(["script", "style", "header", "footer", "nav", "aside", "form", "iframe", "noscript"]):
        tag.decompose()

    main_text = ""
    for selector in ["article", "main", ".article-body", ".post-content", ".entry-content"]:
        node = soup.select_one(selector)
        if node:
            main_text = node.get_text(separator=" ", strip=True)
            if len(main_text) > 400:
                break
    
    if len(main_text) < 400:
        paragraphs = soup.find_all("p")
        main_text = " ".join(p.get_text(separator=" ", strip=True) for p in paragraphs)

    if len(main_text) > 300:
        return {"text": main_text, "title": title}
    return None

def _try_newspaper(url: str) -> dict | None:
    try:
        from newspaper import Article  # type: ignore
        art = Article(url, request_timeout=15)
        art.download()
        art.parse()
        text = art.text.strip()
        if len(text) > 300:
            return {"text": text, "title": art.title}
    except Exception:
        pass
    return None

def _try_requests(url: str) -> dict | None:
    try:
        with httpx.Client(headers=_BROWSER_HEADERS, follow_redirects=True, verify=False, timeout=20) as client:
            resp = client.get(url)
            resp.raise_for_status()
            return _extract_page_info(resp.text)
    except Exception:
        pass
    return None

def fetch_article_data(url: str) -> dict:
    strategies = [_try_newspaper, _try_requests]
    for strategy in strategies:
        result = strategy(url)
        if result and result.get("text"):
            return result
    raise ValueError(
        "We couldn't reach the content of this article. "
        "It might be protected by a paywall or a bot-shield."
    )