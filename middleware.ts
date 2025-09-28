import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    // Ambil session lengkap termasuk roles
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const allowedRoles = ["ADMIN", "OWNER"];
    const hasAccess = session.user.roles.some((role) =>
        allowedRoles.includes(role)
    );

    if (!hasAccess) {
        return NextResponse.redirect(new URL("/403", request.url));
    }

    return NextResponse.next();
}

export const config = {
    runtime: "nodejs",
    matcher: ["/public/:path*","/admin/:path*"],
};
