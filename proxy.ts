import { validateSession } from "@/lib/auth";
import { routes } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";

function isAuthRoute(pathname: string) {
    return pathname === routes.auth.login || pathname === routes.auth.register;
}

function unauthorized(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
        return new NextResponse(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
        );
    }
    return NextResponse.redirect(new URL(routes.auth.login, request.url));
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get("session");

    if (isAuthRoute(pathname)) {
        if (!sessionCookie?.value) {
            return NextResponse.next();
        }

        const user = await validateSession(sessionCookie.value);
        if (user) {
            return NextResponse.redirect(new URL(routes.home, request.url));
        }

        return NextResponse.next();
    }

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
        // Auth routes
        "/login",
        "/register",
        // API routes
        "/api/auth/reset-password",
        "/api/movie/:path*",
        "/api/tracking/:path*",
        // Dashboard routes
        "/search/:path*",
        "/movie/:path*",
        "/library/:path*",
        "/settings/:path*", 
        "/", // Catch-all for other dashboard routes
    ],
};
