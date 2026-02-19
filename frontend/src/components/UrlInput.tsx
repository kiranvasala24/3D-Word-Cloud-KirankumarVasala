import { useState } from "react";

const SAMPLE_URLS = [
    { label: "Modern History", url: "https://en.wikipedia.org/wiki/Artificial_intelligence" },
    { label: "Climate Data", url: "https://en.wikipedia.org/wiki/Climate_change" },
    { label: "Tech Trends", url: "https://en.wikipedia.org/wiki/Large_language_model" },
];

interface UrlInputProps {
    onSubmit: (url: string) => void;
    isLoading: boolean;
}

export default function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
    const [url, setUrl] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = url.trim();
        if (trimmed) onSubmit(trimmed);
    };

    return (
        <header className="nav-header">
            <div className="nav-content">
                <div className="brand-section">
                    <h1 className="brand-title">3D Word Explorer</h1>
                    <p className="brand-subtitle">Visualize the central topics of any article</p>
                </div>

                <form onSubmit={handleSubmit} className="input-group">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste an article link here..."
                        required
                        className="main-input"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !url.trim()}
                        className="analyze-button"
                    >
                        {isLoading ? "Processing..." : "Analyze"}
                    </button>
                </form>

                <div className="samples-row">
                    <span className="sample-tag">Try a sample:</span>
                    {SAMPLE_URLS.map((sample, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setUrl(sample.url)}
                            className="sample-chip"
                            disabled={isLoading}
                        >
                            {sample.label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}