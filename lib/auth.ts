import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function sessionCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: SESSION_MAX_AGE,
    };
}

export async function createSession(userId: number): Promise<string> {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

    await prisma.session.create({
        data: {
            id: token,
            user_id: userId,
            expires_at: expiresAt,
        },
    });

    // Clean up expired sessions for this user (housekeeping)
    await prisma.session.deleteMany({
        where: {
            user_id: userId,
            expires_at: { lt: new Date() },
        },
    });

    return token;
}

export async function validateSession(token: string) {
    const session = await prisma.session.findUnique({
        where: { id: token },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    role: true,
                },
            },
        },
    });

    if (!session) return null;

    if (session.expires_at < new Date()) {
        await prisma.session.delete({ where: { id: token } });
        return null;
    }

    return session.user;
}

export async function deleteSession(token: string) {
    await prisma.session.deleteMany({ where: { id: token } });
}

export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions());
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return validateSession(token);
}

export function getUserFromRequest(request: { headers: { get(name: string): string | null } }) {
    const raw = request.headers.get("x-user");
    if (!raw) return null;
    try {
        return JSON.parse(raw) as { id: number; username: string; name: string; role: string };
    } catch {
        return null;
    }
}
