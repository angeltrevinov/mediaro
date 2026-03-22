import { clearSessionCookie, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import { z } from "zod";

const resetPasswordSchema = z.object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters").max(128, "Current password must be at most 128 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters").max(128, "New password must be at most 128 characters"),
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

    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
        return new Response(
            JSON.stringify({ error: result.error.issues[0].message }),
            { status: 400 },
        );
    }
    const { currentPassword, newPassword } = result.data;

    const user = await getCurrentUser();
    if (!user) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 },
        );
    }

    const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
    });
    if (!fullUser) {
        return new Response(
            JSON.stringify({ error: "User not found" }),
            { status: 404 },
        );
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, fullUser.password_hash);
    if (!isPasswordValid) {
        return new Response(
            JSON.stringify({ error: "Current password is incorrect" }),
            { status: 401 },
        );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: { id: user.id },
        data: { password_hash: newPasswordHash },
    });

    // Invalidate all sessions for this user and clear the cookie
    await prisma.session.deleteMany({
        where: { user_id: user.id },
    });
    await clearSessionCookie();

    return new Response(
        JSON.stringify({ message: "Password updated successfully" }),
        { status: 200 },
    );
}