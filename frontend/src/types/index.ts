export interface WordData {
    word: string;
    weight: number;
}

export interface AnalyzeResponse {
    words: WordData[];
    article_url: string;
    title: string;
}

export type AppState = "idle" | "loading" | "success" | "error";