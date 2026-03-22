import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/auth";
import bcrypt from "bcrypt";
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
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Invalid or missing JSON body" }),
            { status: 400 },
        );
    }

    const result = registerSchema.safeParse(body);
    if (!result.success) {
        return new Response(
            JSON.stringify({ error: result.error.issues[0].message }),
            { status: 400 },
        );
    }
    const { username, name, password } = result.data;
    
    const existingUser = await prisma.user.findUnique({
        where: { username },
    });
    if (existingUser) {
        return new Response(
            JSON.stringify({ error: "Username already taken" }),
            { status: 409 },
        );
    }

    // hash the password with bcrypt
    const passwordHash = await bcrypt.hash(password, 12);

    // First registered user becomes admin
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "admin" : "user";

    const user = await prisma.user.create({
        data: {
            username,
            name,
            password_hash: passwordHash,
            role,
        },
        select: {
            id: true,
            username: true,
            name: true,
            role: true,
            created_at: true,
        },
    });

    const token = await createSession(user.id);
    await setSessionCookie(token);

    return new Response(JSON.stringify(user), { status: 201 });
}