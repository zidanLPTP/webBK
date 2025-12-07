import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth"; 

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Area Terlarang
  const isAdminRoute = path.startsWith("/admin/dashboard");
  const isAdminApi = path.startsWith("/api/admin") && !path.startsWith("/api/admin/login");

  // Bebaskan jalur umum
  if (!isAdminRoute && !isAdminApi) {
    return NextResponse.next();
  }

  // Cek Token
  const token = request.cookies.get("access_token")?.value;
  
  // Debugging (Akan muncul di Vercel Logs)
  // console.log(`[Proxy] Akses ke: ${path}, Token ada? ${!!token}`);

  const verifiedToken = token ? await verifyToken(token) : null;

  if (!verifiedToken) {
    // Kalau token invalid/expired
    if (isAdminApi) {
        // API Admin butuh JSON error
        return NextResponse.json({ error: "Unauthorized: Token Invalid or Missing" }, { status: 401 });
    }
    if (isAdminRoute) {
        // Dashboard butuh Redirect
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};