import { useCallback, useState } from "react";
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
                throw new Error(data?.detail ?? `Analysis failed (Status: ${res.status})`);
            }

            const data = await res.json();
            setWords(data.words);
            setArticleTitle(data.title);
            setState("success");

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected glitch occurred.");
            setState("error");
        }
    }, []);

    return (
        <div className="app-container">
            <UrlInput onSubmit={handleAnalyze} isLoading={state === "loading"} />

            {state === "success" && articleTitle && (
                <div className="overlay" style={{ justifyContent: 'flex-end', paddingBottom: '100px' }}>
                    <div className="brand-section" style={{ textAlign: 'center', opacity: 0.8 }}>
                        <p className="brand-subtitle" style={{ marginBottom: 4, letterSpacing: '0.1em' }}>CURRENT EXPLORATION</p>
                        <h2 style={{ fontSize: '1.2rem', color: '#fff', maxWidth: '600px' }}>{articleTitle}</h2>
                    </div>
                </div>
            )}
            {state === "error" && (
                <div className="error-container">
                    <span style={{ fontSize: "2rem", marginBottom: 16 }}>🛰️</span>
                    <p>{error}</p>
                    <button
                        onClick={() => setState("idle")}
                        className="analyze-button"
                        style={{ marginTop: 24, padding: "10px 32px" }}
                    >
                        Try Another Link
                    </button>
                </div>
            )}

            {state === "loading" && (
                <div className="overlay">
                    <div className="spinner" />
                    <p className="brand-subtitle" style={{ marginTop: 24, fontSize: '1rem' }}>
                        Analyzing article and extracting keywords...
                    </p>
                </div>
            )}

            {state === "success" && words.length > 0 ? (
                <div style={{ width: '100%', height: '100%' }}>
                    <Canvas
                        camera={{ position: [0, 0, 12], fov: 60 }}
                        style={{ background: "transparent" }}
                    >
                        <WordCloud words={words} />
                    </Canvas>
                </div>
            ) : state === "idle" ? (
                <div className="overlay">
                    <div className="hero-container">
                        <h2 className="hero-title">Step into the News</h2>
                        <p className="hero-subtitle">
                            Enter any article URL to generate a dynamic 3D word cloud.
                            Explore the core topics in an immersive spatial landscape.
                        </p>
                    </div>
                </div>
            ) : null}

            <div className="footer">
                3D Word Cloud Explorer &bull; {articleTitle ? `Exploring: ${articleTitle.substring(0, 30)}...` : `Interactive Word Visualization`}
            </div>

        </div>
    );
}

