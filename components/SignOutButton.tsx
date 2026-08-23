"use client";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SignOutButton({ label }: { label: string }) {
  const router = useRouter();
  const signOut = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };
  return (
    <button
      onClick={signOut}
      className="border border-navy/25 text-navy font-semibold rounded-md px-3 py-1.5 text-xs hover:bg-navy hover:text-parchment transition-colors"
    >
      {label}
    </button>
  );
}
