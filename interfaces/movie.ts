// Application types (camelCase) — used throughout the app and aligned with the Prisma schema
export interface Movie {
    id: number;
    title: string;
    originalTitle: string;
    releaseDate: string;
    posterPath: string | null;
    backdropPath: string | null;
    overview: string;
    runtime?: number;
    genres?: string[];       // genre names (from movie details)
    voteAverage?: number;
    voteCount?: number;
    status?: string;
}

export interface MovieSearchResult {
    page: number;
    results: Movie[];
    totalResults: number;
    totalPages: number;
}

// Raw types from the TMDB API (snake_case)
export interface TMDBMovie {
    id: number;
    title: string;
    original_title: string;
    release_date: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    vote_average: number;
    vote_count: number;
    // search results only
    genre_ids?: number[];
    // movie details only
    runtime?: number;
    genres?: { id: number; name: string }[];
    status?: string;
}

export interface TMDBSearchResponse {
    page: number;
    results: TMDBMovie[];
    total_results: number;
    total_pages: number;
}