export interface Movie {
    id?: number;
    tmdbId: string;
    title: string;
    originalTitle?: string;
    releaseDate?: Date;
    posterPath?: string;
    backdropPath?: string;
    overview?: string;
    runtime?: number;
    genres?: string[];
    lastSynced?: Date;
};

export interface MovieSearchResult {
    page: number;
    results: Movie[];
    totalResults: number;
    totalPages: number;
};