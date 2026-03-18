import { MovieSearchResult } from "@/interfaces/movie";
import { searchMovies, getPosterUrl } from "@/lib/tmdb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    // query params
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const language = searchParams.get("language") || "en-US";

    try {
        const results = await searchMovies(query, page, language);
        // Map results to include full poster URLs
        const mappedResults: MovieSearchResult = {
            page: results.page,
            results: results.results.map((movie: any) => ({
                ...movie,
                posterPath: getPosterUrl(movie.poster_path), // use TMDB's poster_path
            })),
            totalResults: results.total_results,
            totalPages: results.total_pages,
        };
        return new Response(JSON.stringify(mappedResults));
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
};