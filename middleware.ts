import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-shared";

export async function middleware(req: NextRequest) {
  // Must create a response first
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Create Supabase client (edge safe)
  const supabase = createServerClient(
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
    {
      request: req,
      response: res,
    }
  );

  // Get current auth session
  const {
    data: { session },
  } = await supabase.getSession();

  const protectedRoutes = ["/finance", "/students", "/admin"];
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/finance/:path*", "/students/:path*", "/admin/:path*"],
};
