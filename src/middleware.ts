import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readToken } from "./lib/token";
import { jwtDecode } from "jwt-decode";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // hanya berlaku untuk /api/v1/*
  if (pathname.startsWith("/api/v1/")) {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = jwtDecode<{ id: string; email: string }>(token);
    console.log("Decoded user:", user);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // simpan user info di header agar bisa dipakai di route handler
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.id);
    requestHeaders.set("x-user-email", user.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Api
    "/api/v1/:path*",
    "/api/v1",

    // client side
    "/dashboard/:path*",
  ],
};
