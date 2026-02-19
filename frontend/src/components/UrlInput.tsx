import { useState } from "react";

const SAMPLE_URLS = [
    "https://en.wikipedia.org/wiki/Artificial_intelligence",
    "https://en.wikipedia.org/wiki/Climate_change",
    "https://en.wikipedia.org/wiki/Large_language_model",
];

interface UrlInputProps {
    onSubmit: (url: string) => void;
    isLoading: boolean;
}

export default function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
    const [url, setUrl] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (url.trim()) onSubmit(url.trim());
    }
    function handleSample(sample: string) {
        setUrl(sample);
    }

    return (
        <div style={styles.wrapper}>
            <h1 style={styles.title}>3D Word Cloud</h1>
            <p style={styles.subtitle}>Enter a new article URL to visualize its topics </p>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    required
                    style={styles.input}
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !url.trim()} style={styles.button}>
                    {isLoading ? "Analyzing..." : "Analyze"}
                </button>
            </form>

            <div style={styles.samples}>
                <span style={styles.sampleLabel}>Try a sample: </span>
                {SAMPLE_URLS.map((s, i) => (
                    <button key={i} onClick={() => handleSample(s)} style={styles.sampleBtn} disabled={isLoading}>
                        Article {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: "28px 32px 20px",
        background: "linear-gradient(180deg, rgba(10,10,15,0.98) 80%, transparent)",
    },
    title: {
        color: "#e8e8ff",
        fontSize: "1.6rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        marginBottom: 4,
    },
    subtitle: {
        color: "#888",
        fontSize: "0.85rem",
        marginBottom: 16,
    },
    form: {
        display: "flex",
        gap: 10,
        maxWidth: 640,
    },
    input: {
        flex: 1,
        padding: "10px 14px",
        borderRadius: 8,
        border: "1px solid #2a2a3a",
        background: "#13131f",
        color: "#e8e8ff",
        fontSize: "0.9rem",
        outline: "none"
    },
    button: {
        padding: "10px 22px",
        borderRadius: 8,
        border: "none",
        background: "linear-gradient(135deg, #6c63ff, #3ecfcf)",
        color: "#fff",
        fontWeight: 600,
        fontSize: "0.9rem",
        cursor: "pointer",
        transition: "opacity 0.2s",
    },
    samples: {
        marginTop: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
    },
    sampleLabel: {
        color: "#555",
        fontSize: "0.8rem",
    },
    sampleBtn: {
        padding: "4px 12px",
        borderRadius: 20,
        border: "1px solid #2a2a3a",
        background: "transparent",
        color: "#8888cc",
        fontSize: "0.78rem",
        cursor: "pointer",
    },

};