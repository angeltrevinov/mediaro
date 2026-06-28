import { createSession, setSessionCookie } from "@/lib/auth";
import { errorResponse, jsonResponse, parseJsonBody } from "@/lib/api-route-helpers";
import { registerUser } from "@/lib/services/server/auth-service";
import { z } from "zod";
import { NextRequest } from "next/server";

const registerSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(32, "Username must be at most 32 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be at most 100 characters"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(128, "Password must be at most 128 characters"),
});

export async function POST(request: NextRequest) {
    const parsed = await parseJsonBody(request, registerSchema);
    if ("response" in parsed) {
        return parsed.response;
    }

    const { username, name, password } = parsed.data;

    const result = await registerUser({ username, name, password });
    if (!result.ok) {
        return errorResponse(result.error, 409);
    }

    const token = await createSession(result.user.id);
    await setSessionCookie(token);

    return jsonResponse(result.user, 201);
}