import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const sessionCookie = request.cookies.get("session");

    if (!sessionCookie?.value) {
        if (request.nextUrl.pathname.startsWith("/api/")) {
            return new NextResponse(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401, headers: { "Content-Type": "application/json" } },
            );
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // API routes
        "/api/auth/reset-password",
        "/api/movie/:path*",
        // Dashboard routes
        "/movie/:path*",
        "/settings/:path*", 
        "/", // Catch-all for other dashboard routes
    ],
};
