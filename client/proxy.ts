import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/login"];

function isPublicRoute(pathname: string): boolean {
    return publicRoutes.some((route) => {
        if (route === "/") {
            return pathname === "/";
        }

        return pathname === route || pathname.startsWith(`${route}/`);
    });
}

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const sessionCookie = getSessionCookie(request);

    if (pathname === "/login" && sessionCookie) {
        return NextResponse.redirect(new URL("/spaces", request.url));
    }

    if (!isPublicRoute(pathname) && !sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
