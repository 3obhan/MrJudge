import { NextResponse } from "next/server";
import { supabaseServerSession, getSessionUser } from "@/lib/supabase-server";

// Lists disputes belonging to the signed-in user only (enforced by RLS too).
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = supabaseServerSession();
  const { data, error } = await supabase
    .from("disputes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ disputes: data });
}
