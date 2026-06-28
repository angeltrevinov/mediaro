import { getMovieDetailsService } from "@/lib/services/server/movie-service";
import { errorResponse, jsonResponse } from "@/lib/api-route-helpers";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;
    const { searchParams } = request.nextUrl;
    const language = searchParams.get("language") || "en-US";

    try {
        const movie = await getMovieDetailsService(id, language);
        return jsonResponse(movie);
    } catch (error) {
        return errorResponse((error as Error).message, 500);
    }
}