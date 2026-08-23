import { NextRequest, NextResponse } from "next/server";
import { supabaseServerSession, getSessionUser } from "@/lib/supabase-server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = supabaseServerSession();
  const { data, error } = await supabase
    .from("disputes")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error) return NextResponse.json({ error: "Dispute not found." }, { status: 404 });
  return NextResponse.json({ dispute: data });
}
