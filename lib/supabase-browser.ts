"use client";
import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client — used by login/page.tsx and any other
// client component that needs auth (signInWithPassword, signInWithOAuth, etc).
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}