import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function authenticateUser(username: string, password: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        return null;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        return null;
    }

    return user;
}

export async function registerUser(input: {
    username: string;
    name: string;
    password: string;
}) {
    const existing = await prisma.user.findUnique({ where: { username: input.username } });
    if (existing) {
        return { ok: false as const, error: "Username already taken" as const };
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "admin" : "user";

    const user = await prisma.user.create({
        data: {
            username: input.username,
            name: input.name,
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

    return { ok: true as const, user };
}

export async function updateAccountName(userId: number, name: string) {
    await prisma.user.update({
        where: { id: userId },
        data: { name },
    });
}

export async function resetUserPassword(input: {
    userId: number;
    currentPassword: string;
    newPassword: string;
}) {
    const fullUser = await prisma.user.findUnique({
        where: { id: input.userId },
    });

    if (!fullUser) {
        return { ok: false as const, error: "User not found" as const };
    }

    const isPasswordValid = await bcrypt.compare(input.currentPassword, fullUser.password_hash);
    if (!isPasswordValid) {
        return { ok: false as const, error: "Current password is incorrect" as const };
    }

    const newPasswordHash = await bcrypt.hash(input.newPassword, 12);

    await prisma.user.update({
        where: { id: input.userId },
        data: { password_hash: newPasswordHash },
    });

    await prisma.session.deleteMany({
        where: { user_id: input.userId },
    });

    return { ok: true as const };
}
