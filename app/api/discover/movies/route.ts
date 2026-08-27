import { searchMovie } from "@/lib/tmdb";
import { MovieSearchQuery, MovieSearchResult } from "@/schemas/movies";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Search for new movies
 * @description Searches for movies using the TMDB API 
 * @query MovieSearchQuery
 * @response MovieSearchResult
 * @openapi
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { query, page } = MovieSearchQuery.parse(Object.fromEntries(request.nextUrl.searchParams));
        const searchResults = MovieSearchResult.parse(await searchMovie(query, page));
        return NextResponse.json(searchResults);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
        }
        console.error("Error fetching movie search results:", error);
        return NextResponse.json({ error: "Failed to fetch movie search results" }, { status: 500 });
    }

}