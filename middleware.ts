import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseClient } from "@supabase/auth-helpers-shared";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({
    request: { headers: req.headers },
  });

  const supabase = createSupabaseClient(
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
    {
      request: req,
      response: res,
    }
  );

  // Check user session
  const {
    data: { session },
  } = await supabase.getSession();

  const protectedRoutes = ["/finance", "/admin", "/students"];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/finance/:path*", "/admin/:path*", "/students/:path*"],
};
