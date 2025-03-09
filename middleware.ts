import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not / or doesn't start with /auth, /login, /signup, or /form
  // redirect the user to /
  if (
    !session &&
    req.nextUrl.pathname !== "/" &&
    !req.nextUrl.pathname.startsWith("/auth") &&
    !req.nextUrl.pathname.startsWith("/login") &&
    !req.nextUrl.pathname.startsWith("/signup") &&
    !req.nextUrl.pathname.startsWith("/form")
  ) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If user is signed in and the current path is / or /login or /signup
  // redirect the user to /dashboard
  if (
    session &&
    (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

