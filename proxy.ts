import { validateSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

function unauthorized(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
        return new NextResponse(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
        );
    }
    return NextResponse.redirect(new URL("/login", request.url));
}

export async function proxy(request: NextRequest) {
    const sessionCookie = request.cookies.get("session");

    if (!sessionCookie?.value) {
        return unauthorized(request);
    }

    const user = await validateSession(sessionCookie.value);
    if (!user) {
        return unauthorized(request);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user", JSON.stringify(user));

    return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
    matcher: [
        // API routes
        "/api/auth/reset-password",
        "/api/movie/:path*",
        // Dashboard routes
        "/search/:path*",
        "/movie/:path*",
        "/settings/:path*", 
        "/", // Catch-all for other dashboard routes
    ],
};
