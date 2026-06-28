import { createSession, setSessionCookie } from "@/lib/auth";
import { errorResponse, jsonResponse, parseJsonBody } from "@/lib/api-route-helpers";
import { authenticateUser } from "@/lib/services/server/auth-service";
import { z } from "zod";
import { NextRequest } from "next/server";

const loginSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(32, "Username must be at most 32 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(128, "Password must be at most 128 characters"),
});

export async function POST(request: NextRequest) {
    const parsed = await parseJsonBody(request, loginSchema);
    if ("response" in parsed) {
        return parsed.response;
    }

    const { username, password } = parsed.data;

    const user = await authenticateUser(username, password);
    if (!user) {
        return errorResponse("Invalid username or password", 401);
    }

    const token = await createSession(user.id);
    await setSessionCookie(token);

    return jsonResponse({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
    });
}