import { searchMovie } from "@/lib/tmdb";
import { MovieSearchQuery, MovieSearchResult } from "@/schemas/movies";
import { NextRequest, NextResponse } from "next/server";

/**
 * Search for new movies
 * @description Searches for movies using the TMDB API 
 * @query MovieSearchQuery
 * @response MovieSearchResult
 * @openapi
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    const { query, page } = MovieSearchQuery.parse(Object.fromEntries(request.nextUrl.searchParams));
    
    try {
        const searchResults = MovieSearchResult.parse(await searchMovie(query, page));
        return NextResponse.json(searchResults);
    } catch (error) {
        console.error("Error fetching movie search results:", error);
        return NextResponse.json({ error: "Failed to fetch movie search results" }, { status: 500 });
    }

}