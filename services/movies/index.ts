import { MovieDiscoverResult } from "@/schemas/movies/movies";
import { searchMovie } from "@/lib/tmdb";

export async function discoverMovies(query: string, page: number): Promise<MovieDiscoverResult> {
    try {
        const raw = await searchMovie(query, page);
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