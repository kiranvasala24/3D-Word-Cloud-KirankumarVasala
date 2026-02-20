import { useCallback, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import UrlInput from "./components/UrlInput";
import WordCloud from "./components/WordCloud";
import { AppState, WordData } from "./types";

const API_BASE = "http://localhost:8000";


export default function App() {
    const [state, setState] = useState<AppState>("idle");
    const [words, setWords] = useState<WordData[]>([]);
    const [error, setError] = useState<string>("");
    const [articleTitle, setArticleTitle] = useState<string>("");
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            if (cursorRef.current && followerRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
                followerRef.current.style.left = `${e.clientX}px`;
                followerRef.current.style.top = `${e.clientY}px`;
            }
        };
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    const handleAnalyze = useCallback(async (url: string) => {

        setState("loading");
        setError("");
        setArticleTitle("");

        try {
            const res = await fetch(`${API_BASE}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.detail ?? `Analysis failed`);
            }

            const data = await res.json();
            setWords(data.words);
            setArticleTitle(data.title);
            setState("success");

        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
            setState("error");
        }
    }, []);

    return (
        <main className="app-container" id="main-explorer">
            <div ref={cursorRef} className="custom-cursor" />
            <div ref={followerRef} className="custom-cursor-follower" />

            <UrlInput onSubmit={handleAnalyze} isLoading={state === "loading"} />

            {state === "success" && articleTitle && (
                <div className="title-overlay-container">
                    <p className="title-tag-text">CURRENT SEARCH</p>
                    <h2 id="article-title-display" className="title-main-text">
                        {articleTitle}
                    </h2>
                </div>
            )}
            {state === "error" && (
                <div className="error-container" id="error-message">
                    <span style={{ fontSize: "2rem", marginBottom: 16 }}>🛰️</span>
                    <p>{error}</p>
                    <button
                        id="reset-state-button"
                        onClick={() => setState("idle")}
                        className="analyze-button"
                        style={{ marginTop: 24, padding: "10px 32px" }}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {state === "loading" && (
                <div className="overlay" id="loading-overlay">
                    <div className="spinner" />
                    <p className="brand-subtitle" style={{ marginTop: 24, fontSize: '1rem' }}>
                        Processing your article...
                    </p>
                </div>
            )}

            {state === "success" && words.length > 0 ? (
                <div style={{ width: '100%', height: '100%' }} id="canvas-wrapper">
                    <Canvas
                        camera={{ position: [0, 0, 12], fov: 60 }}
                        style={{ background: "transparent" }}
                    >
                        <WordCloud words={words} />
                    </Canvas>
                </div>
            ) : state === "idle" ? (
                <div className="overlay" id="hero-overlay">
                    <div className="hero-container">
                        <h2 className="hero-title">Step into the News</h2>
                        <p className="hero-subtitle">
                            Visualize any article in a dynamic 3D landscape.
                        </p>
                    </div>
                </div>
            ) : null}

            <footer className="footer" id="main-footer">
                3D Word Cloud &bull; {articleTitle ? `Exploring: ${articleTitle.substring(0, 30)}...` : `Interactive Visualization`}
            </footer>
        </main>
    );
}
