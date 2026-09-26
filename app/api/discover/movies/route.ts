import { MovieDiscoverQuery } from "@/schemas/movies/movies";
import { discoverMovies } from "@/services/movies";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Search for new movies
 * @description Searches for movies using the TMDB API 
 * @query MovieDiscoverQuery
 * @response MovieDiscoverResult
 * @openapi
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const input = Object.fromEntries(request.nextUrl.searchParams);
        const searchResults = await discoverMovies(input as unknown as MovieDiscoverQuery);
        return NextResponse.json(searchResults);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
        }
        console.error("Error fetching movie search results:", error);
        return NextResponse.json({ error: "Failed to fetch movie search results" }, { status: 500 });
    }

}