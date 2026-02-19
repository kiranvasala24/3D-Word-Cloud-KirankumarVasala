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

    const handleAnalyze = useCallback(async (url: string) => {
        setState("loading");
        setError("");

        try {
            const res = await fetch(`${API_BASE}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.detail ?? `Server error: ${res.status}`);
            }

            const data = await res.json();
            setWords(data.words);
            setState("success");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
            setState("error");
        }
    }, []);

    return (
        <div className="app-container">
            <UrlInput onSubmit={handleAnalyze} isLoading={state === "loading"} />

            {state === "error" && (
                <div className="error-container">
                    <span style={{ fontSize: "1.2rem", marginBottom: 8 }}>⚠️</span>
                    <p>{error}</p>
                    <button
                        onClick={() => setState("idle")}
                        className="retry-button"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {state === "loading" && (
                <div className="overlay">
                    <div className="spinner" />
                    <p className="loading-text">
                        Processing article and extracting topics...
                    </p>
                </div>
            )}

            {state === "success" && words.length > 0 ? (
                <Canvas
                    camera={{ position: [0, 0, 12], fov: 60 }}
                    style={{ background: "transparent" }}
                >
                    <WordCloud words={words} />
                </Canvas>
            ) : state === "idle" ? (
                <div className="overlay">
                    <div className="hero-container">
                        <h2 className="hero-title">Visualize the News</h2>
                        <p className="hero-subtitle">
                            Paste a URL above to see a 3D semantic profile of any article.
                        </p>
                    </div>
                </div>
            ) : null}

            <div className="footer">
                3D Word Cloud Explorer &bull; Built with React Three Fiber
            </div>
        </div>
    );
}
