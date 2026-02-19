import httpx
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger(__name__)


_BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "max-age=0",
}


def _extract_main_text(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(["script", "style", "header", "footer",
                     "nav", "aside", "form", "iframe", "noscript",
                     "figure", "figcaption", "button"]):
        tag.decompose()

    for selector in ["article", "main", "[role='main']", ".article-body",
                     ".post-content", ".entry-content", ".content"]:
        node = soup.select_one(selector)
        if node:
            text = node.get_text(separator=" ", strip=True)
            if len(text) > 300:
                return text

    paragraphs = soup.find_all("p")
    text = " ".join(p.get_text(separator=" ", strip=True) for p in paragraphs)
    if len(text) > 300:
        return text

    return soup.get_text(separator=" ", strip=True)


def _try_newspaper(url: str) -> str | None:
    try:
        from newspaper import Article  # type: ignore
        art = Article(url, request_timeout=15)
        art.download()
        art.parse()
        text = art.text.strip()
        if len(text) > 300:
            logger.info("extracted via newspaper: %d chars", len(text))
            return text
    except Exception as exc:
        logger.debug("newspaper failed: %s", exc)
    return None


def _try_requests(url: str) -> str | None:
    try:
        with httpx.Client(
            headers=_BROWSER_HEADERS,
            follow_redirects=True,
            verify=False,
            timeout=20,
        ) as client:
            resp = client.get(url)
            resp.raise_for_status()
            text = _extract_main_text(resp.text)
            if len(text) > 300:
                return text
    except Exception as exc:
        logger.debug("httpx failed: %s", exc)
    return None


def _try_requests_secondary(url: str) -> str | None:
    try:
        secondary_headers = {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
            "Accept": "text/html,application/xhtml+xml",
        }
        with httpx.Client(
            headers=secondary_headers,
            follow_redirects=True,
            verify=False,
            timeout=20,
        ) as client:
            resp = client.get(url)
            resp.raise_for_status()
            text = _extract_main_text(resp.text)
            if len(text) > 300:
                return text
    except Exception as exc:
        logger.debug("secondary UA failed: %s", exc)
    return None


def fetch_article_text(url: str) -> str:
    """Extracts main body text from a news URL using multiple fallback strategies."""
    strategies = [_try_newspaper, _try_requests, _try_requests_secondary]

    for strategy in strategies:
        result = strategy(url)
        if result:
            return result

    raise ValueError(
        "Could not extract readable text from that URL. "
        "The page may be behind a paywall, require JavaScript, or block scrapers."
    )