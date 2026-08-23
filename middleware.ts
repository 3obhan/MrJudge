import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Protects all app pages except the login/signup and auth callback routes.
// Anyone can still deploy this and remove the redirect below if they want a
// public no-login mode again — the API routes are what actually enforce
// per-user data access via Supabase Row Level Security.
const PUBLIC_PATHS = ["/login", "/auth/callback"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const isPublic = PUBLIC_PATHS.some((p) => req.nextUrl.pathname.startsWith(p));

  if (!user && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  if (user && req.nextUrl.pathname.startsWith("/login")) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  // Excludes Next.js internals AND any request for a static file (by
  // extension) so things like /brand/mrjudge-mark.png, the /icon route,
  // etc. are always servable — even to logged-out visitors on /login.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|api/transcribe|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|avif|css|js|txt|xml)$).*)",
  ],
};