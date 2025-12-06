import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: any) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Not logged in -> redirect
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = session.user.user_metadata.role;

  // Finance pages allowed: superadmin + accountant
  if (req.nextUrl.pathname.startsWith("/finance")) {
    if (role !== "superadmin" && role !== "accountant") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  // Admin-only pages
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (role !== "superadmin") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  return res;
}