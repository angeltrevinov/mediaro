"use server";

import { Movie, MovieDiscoverResult } from "@/schemas/movies/movies";
import { searchMovieTMDB } from "@/lib/tmdb";
import { getMovieDetailsTMDB } from "@/lib/tmdb/client/client";
import { tmdbMovieDetailsToMovie, tmdbMovieToMovie } from "@/lib/tmdb/mappers/mappers";

/**
 * Discovers movies based on the provided query and page number. It uses the third party service to fetch metadata
 *
 * @param {string} query - the query to search for
 * @param {number} page - the page number
 * @returns {Promise<MovieDiscoverResult>}
 */
export async function discoverMovies(query: string, page: number): Promise<MovieDiscoverResult> {
    try {
        const raw = await searchMovieTMDB(query, page);
        return MovieDiscoverResult.parse({
            ...raw,
            results: raw.results.map(tmdbMovieToMovie),
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error discovering movies:", error.message);
        } else {
            console.error("Unknown error discovering movies:", error);
        }
        throw error;
    }
}

/**
 * Get the details of a specific movie by its TMDB ID. It uses the third party service to fetch metadata
 * 
 * @param {string} tmdbID 
 * @returns {Promise<Movie>} A promise resolving to the movie details
 */
export async function getMovieDetails(tmdbID: string): Promise<Movie> {
    // TODO: this should use caching 
    try {
        const raw = await getMovieDetailsTMDB(tmdbID);
        return Movie.parse(tmdbMovieDetailsToMovie(raw));
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching movie details:", error.message);
        } else {
            console.error("Unknown error fetching movie details:", error);
        }
        throw error;
    }
}

