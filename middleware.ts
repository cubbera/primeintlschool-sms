import { NextResponse } from "next/server";
import { supabase } from "./lib/supabaseClient";

export async function middleware(req: any) {
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  // Not logged in → redirect
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = session.user.user_metadata.role;

  // accountants-only pages
  if (req.nextUrl.pathname.startsWith("/finance")) {
    if (role !== "accountant" && role !== "super_admin") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  // admin-only pages
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (role !== "super_admin") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  return NextResponse.next();
}