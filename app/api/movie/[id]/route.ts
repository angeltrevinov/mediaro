import { getMovieDetails } from "@/lib/tmdb";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = request.nextUrl;
    const language = searchParams.get("language") || "en-US";

    try {
        const movie = await getMovieDetails(id, language);
        return new Response(JSON.stringify(movie));
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}