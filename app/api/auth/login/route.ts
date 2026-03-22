import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/auth";
import bcrypt from "bcrypt";
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
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Invalid or missing JSON body" }),
            { status: 400 },
        );
    }

    const result = loginSchema.safeParse(body);
    if (!result.success) {
        return new Response(
            JSON.stringify({ error: result.error.issues[0].message }),
            { status: 400 },
        );
    }
    const { username, password } = result.data;

    const user = await prisma.user.findUnique({
        where: { username },
    });
    if (!user) {
        return new Response(
            JSON.stringify({ error: "Invalid username or password" }),
            { status: 401 },
        );
    }

    // verify the password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        return new Response(
            JSON.stringify({ error: "Invalid username or password" }),
            { status: 401 },
        );
    }

    const token = await createSession(user.id);
    await setSessionCookie(token);

    return new Response(
        JSON.stringify({
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
        }),
        { status: 200 },
    );
}