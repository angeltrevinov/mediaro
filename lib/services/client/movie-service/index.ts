import { type Movie } from "@/interfaces/movie";
import { apiRoutes } from "@/lib/routes";
import { requestJson } from "@/lib/services/client/http-client";

export type PaginatedResult<T> = {
    page: number;
    results: T[];
    totalResults: number;
    totalPages: number;
};

export async function searchMovies(
    query: string,
    page = 1
): Promise<PaginatedResult<Movie>> {
    const params = new URLSearchParams({
        query,
        page: page.toString(),
    });

    return requestJson<PaginatedResult<Movie>>(
        `${apiRoutes.movie.search}?${params.toString()}`
    );
}

export async function getMovieDetails(id: string): Promise<Movie> {
    return requestJson<Movie>(apiRoutes.movie.byId(id));
}
