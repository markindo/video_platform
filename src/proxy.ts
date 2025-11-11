import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  const protectedPaths = ["/", "/users", "/upload"];

  console.log(token);

  if (!token && protectedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/users") && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/upload") && token?.canUpload !== true) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
