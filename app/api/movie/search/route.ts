import { searchMovies } from "@/lib/tmdb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const language = searchParams.get("language") || "en-US";

    try {
        const results = await searchMovies(query, page, language);
        return new Response(JSON.stringify(results));
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
};