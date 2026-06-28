import { searchMoviesService } from "@/lib/services/server/movie-service";
import { errorResponse, jsonResponse } from "@/lib/api-route-helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const language = searchParams.get("language") || "en-US";

    try {
        const results = await searchMoviesService(query, page, language);
        return jsonResponse(results);
    } catch (error) {
        return errorResponse((error as Error).message, 500);
    }
};