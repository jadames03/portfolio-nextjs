import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area", charset="UTF-8"'
    }
  });
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const username = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASS;

  if (!username || !password) {
    console.warn("ADMIN_USER or ADMIN_PASS is not set.");
    return unauthorized();
  }

  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Basic ")) {
    return unauthorized();
  }

  const base64Credentials = header.split(" ")[1];
  const decoded = atob(base64Credentials);
  const [providedUser, ...passwordParts] = decoded.split(":");
  const providedPass = passwordParts.join(":");

  if (providedUser === username && providedPass === password) {
    return NextResponse.next();
  }

  return unauthorized();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
