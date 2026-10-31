import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { proxy, config } from "./proxy";

const { getSession } = vi.hoisted(() => ({
    getSession: vi.fn(),
}));

vi.mock("@/lib/better-auth/auth", () => ({
    auth: {
        api: {
            getSession,
        },
    },
}));

vi.mock("next/headers", () => ({
    headers: vi.fn(async () => new Headers()),
}));

describe("proxy", () => {
    beforeEach(() => {
        getSession.mockReset();
    });

    it("redirects unauthenticated requests to login", async () => {
        getSession.mockResolvedValue(null);

        const response = await proxy(
            new NextRequest("http://localhost:3000/discover/movies"),
        );

        expect(response.status).toBe(307);
        expect(response.headers.get("location")).toBe("http://localhost:3000/login");
    });

    it("allows requests with an authenticated session", async () => {
        getSession.mockResolvedValue({ user: { id: "user-1" } });

        const response = await proxy(
            new NextRequest("http://localhost:3000/discover/movies"),
        );

        expect(response.headers.get("x-middleware-next")).toBe("1");
    });

    it("protects the home, movie discovery, and settings routes", () => {
        expect(config.matcher).toEqual(["/", "/discover/:path*", "/settings"]);
    });
});
