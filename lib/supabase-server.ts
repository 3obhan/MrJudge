import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Session-aware Supabase client for server components / API routes.
// Uses the anon key + the visitor's auth cookies, so Row Level Security
// (auth.uid() = user_id) applies correctly per signed-in user.
export function supabaseServerSession() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {}
        },
      },
    }
  );
}

export async function getSessionUser() {
  const supabase = supabaseServerSession();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
