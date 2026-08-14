import { getMovieDetails, searchMovies } from "@/lib/tmdb";

export async function searchMoviesService(
    query: string,
    page: number,
    language: string
) {
    return searchMovies(query, page, language);
}

export async function getMovieDetailsService(id: string, language: string) {
    return getMovieDetails(id, language);
}
