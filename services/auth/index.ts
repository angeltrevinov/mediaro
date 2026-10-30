"use server";
import { auth } from "@/lib/better-auth/auth";
/**
 * Creates a new user with the provided email, password, and name.
 *
 * @param {string} email - The email address of the new user.
 * @param {string} password - The plaintext password of the new user, which will be hashed before storage.
 * @param {string} name - (Optional) The name of the new user.
 * @returns
 */
export async function createUser(email: string, password: string, name?: string) {
    await auth.api.signUpEmail({
        body: {
            name: name ?? "",
            email,
            password,
        }
    });
}

export async function authenticateUser(email: string, password: string) {
    await auth.api.signInEmail({
        body: {
            email,
            password
        }
    });
}