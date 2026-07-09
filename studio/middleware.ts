import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/studio/:path*",
    "/api/generate/:path*",
    "/api/task/:path*",
    "/api/upload/:path*",
    "/api/assets/:path*",
    "/api/images/:path*",
    "/api/agent/chat/:path*",
    "/api/jobs/:path*",
    "/api/logs/:path*",
  ],
};
