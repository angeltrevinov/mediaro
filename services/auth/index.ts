import { prisma } from "../../lib/prisma";
import * as argon2 from "argon2";

export async function createUser(email: string, password: string, name?: string) {
    try {
        const passwordHash = await argon2.hash(password, {
            type: argon2.argon2id,
        });
        const user = await prisma.user.create({
            data: {
                email,
                password: passwordHash,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
        return user;
        
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error creating user:", error.message);
        } else {
            console.error("Unknown error creating user:", error);
        }
        throw error;
    }
}