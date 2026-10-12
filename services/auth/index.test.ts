import * as argon2 from "argon2";
import { afterEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../lib/prisma";
import { createUser } from "./index";

vi.mock("../../lib/prisma", () => ({
    prisma: {
        user: {
            create: vi.fn(),
        },
    },
}));

describe("createUser", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("stores an Argon2id hash and returns no password data", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(prisma.user.create).mockResolvedValue({
            id: "user-id",
            email: "person@example.com",
            name: "Person",
        } as never);

        const user = await createUser(
            "person@example.com",
            "correct horse battery staple",
            "Person",
        );
        const createArgs = vi.mocked(prisma.user.create).mock.calls[0][0];

        expect(createArgs.data.password).not.toBe("correct horse battery staple");
        await expect(
            argon2.verify(createArgs.data.password, "correct horse battery staple"),
        ).resolves.toBe(true);
        expect(createArgs.select).toEqual({
            id: true,
            email: true,
            name: true,
        });
        expect(user).toEqual({
            id: "user-id",
            email: "person@example.com",
            name: "Person",
        });
        expect(user).not.toHaveProperty("password");
    });
});
