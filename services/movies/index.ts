"use server";

import { MovieDiscoverResult } from "@/schemas/movies/movies";
import { searchMovieTMDB } from "@/lib/tmdb";

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
        return MovieDiscoverResult.parse(raw);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error discovering movies:", error.message);
        } else {
            console.error("Unknown error discovering movies:", error);
        }
        throw error;
    }
}