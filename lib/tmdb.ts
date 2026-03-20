import type { Movie, MovieSearchResult, TMDBMovie, TMDBSearchResponse } from "@/interfaces/movie";

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_KEY}`
  }
};

export async function searchMovies(
    query: string,
    page: number = 1,
    language: string = 'en-US',
    nsfw: boolean = false,
): Promise<MovieSearchResult> {
    const url = `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=${language}&include_adult=${nsfw}`;
    try {
        const response = await fetch(url, TMDB_OPTIONS);
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.statusText}`);
        }
        return mapTMDBSearchResponse(await response.json());
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export async function getMovieDetails(tmdbId: string, language: string = 'en-US'): Promise<Movie> {
    const url = `${TMDB_API_URL}/movie/${tmdbId}?language=${language}`;
    try {
        const response = await fetch(url, TMDB_OPTIONS);
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.statusText}`);
        }
        return mapTMDBMovie(await response.json());
    } catch (error) {
        console.error(error);
        throw error;
    };
}

function mapTMDBMovie(tmdb: TMDBMovie): Movie {
    return {
        id: tmdb.id,
        title: tmdb.title,
        originalTitle: tmdb.original_title,
        releaseDate: tmdb.release_date,
        posterPath: getPosterUrl(tmdb.poster_path ?? undefined),
        backdropPath: getPosterUrl(tmdb.backdrop_path ?? undefined, "w1280"),
        overview: tmdb.overview,
        runtime: tmdb.runtime,
        genres: tmdb.genres?.map((g) => g.name),
        voteAverage: tmdb.vote_average,
        voteCount: tmdb.vote_count,
        status: tmdb.status,
    };
}

function mapTMDBSearchResponse(tmdb: TMDBSearchResponse): MovieSearchResult {
    return {
        page: tmdb.page,
        results: tmdb.results.map(mapTMDBMovie),
        totalResults: tmdb.total_results,
        totalPages: tmdb.total_pages,
    };
}

function getPosterUrl(posterPath?: string, size: string = 'w500'): string | null {
    if (!posterPath) return null;
    return `${TMDB_IMAGE_BASE_URL}${size}${posterPath}`;
}
