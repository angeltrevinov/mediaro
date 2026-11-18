import type { Movie } from "@/schemas/movies/movies";
import type { TMDBMovie, TMDBMovieDetails } from "../schemas/schemas";

/**
 * Maps a TMDB search result movie into the app's Movie shape.
 * The TMDB `id` becomes `tmdb_id`; the internal `id` is left unset.
 *
 * @param {TMDBMovie} movie - The movie as returned by the TMDB search endpoint
 * @returns {Movie} The movie in the app's shape
 */
export function tmdbMovieToMovie(movie: TMDBMovie): Movie {
    return {
        tmdb_id: String(movie.id),
        title: movie.title,
        original_title: movie.original_title,
        overview: movie.overview,
        popularity: movie.popularity,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        nsfw: movie.adult,
    };
}

/**
 * Maps a TMDB movie details response into the app's Movie shape.
 * The TMDB `id` becomes `tmdb_id`; the internal `id` is left unset.
 *
 * @param {TMDBMovieDetails} movie - The movie as returned by the TMDB details endpoint
 * @returns {Movie} The movie in the app's shape
 */
export function tmdbMovieDetailsToMovie(movie: TMDBMovieDetails): Movie {
    return {
        ...tmdbMovieToMovie(movie),
        imdb_id: movie.imdb_id,
        origin_country: movie.origin_country,
        original_language: movie.original_language,
        runtime: movie.runtime,
        status: movie.status,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
    };
}
