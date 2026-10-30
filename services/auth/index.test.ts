import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { signInEmail, signUpEmail } = vi.hoisted(() => ({
    signInEmail: vi.fn(),
    signUpEmail: vi.fn(),
}));

vi.mock("@/lib/better-auth/auth", () => ({
    auth: {
        api: {
            signInEmail,
            signUpEmail,
        },
    },
}));

import { authenticateUser, createUser } from "./index";

describe("auth services", () => {
    beforeEach(() => {
        signInEmail.mockReset();
        signUpEmail.mockReset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("registers an email/password account with Better Auth", async () => {
        await createUser("person@example.com", "password123", "Person");

        expect(signUpEmail).toHaveBeenCalledWith({
            body: {
                name: "Person",
                email: "person@example.com",
                password: "password123",
            },
        });
    });

    it("uses an empty name when none is provided during registration", async () => {
        await createUser("person@example.com", "password123");

        expect(signUpEmail).toHaveBeenCalledWith({
            body: {
                name: "",
                email: "person@example.com",
                password: "password123",
            },
        });
    });

    it("authenticates using the provided email and password", async () => {
        await authenticateUser("person@example.com", "password123");

        expect(signInEmail).toHaveBeenCalledWith({
            body: {
                email: "person@example.com",
                password: "password123",
            },
        });
    });

    it("propagates Better Auth registration errors", async () => {
        const error = new Error("Email already exists");
        signUpEmail.mockRejectedValue(error);

        await expect(createUser("person@example.com", "password123")).rejects.toBe(error);
    });

    it("propagates Better Auth login errors", async () => {
        const error = new Error("Invalid credentials");
        signInEmail.mockRejectedValue(error);

        await expect(authenticateUser("person@example.com", "password123")).rejects.toBe(error);
    });
});
