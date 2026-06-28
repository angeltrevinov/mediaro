import { NextRequest } from "next/server";
import { ZodType } from "zod";

export function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), { status });
}

export function errorResponse(message: string, status: number): Response {
    return jsonResponse({ error: message }, status);
}

export async function parseJsonBody<T>(
    request: NextRequest,
    schema: ZodType<T>
): Promise<{ data: T } | { response: Response }> {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return { response: errorResponse("Invalid or missing JSON body", 400) };
    }

    const result = schema.safeParse(body);
    if (!result.success) {
        return { response: errorResponse(result.error.issues[0].message, 400) };
    }

    return { data: result.data };
}
