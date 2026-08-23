import { NextRequest, NextResponse } from "next/server";
import { getVerdict } from "@/lib/ai";
import { supabaseServerSession, getSessionUser } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }

    const { personA, personB, language } = await req.json();
    if (!personA?.trim() || !personB?.trim()) {
      return NextResponse.json({ error: "Both statements are required." }, { status: 400 });
    }
    const lang = language === "fa" ? "fa" : "en";

    const result = await getVerdict(lang, personA.trim(), personB.trim());

    const supabase = supabaseServerSession();
    const { data, error } = await supabase
      .from("disputes")
      .insert({
        user_id: user.id,
        person_a_statement: personA.trim(),
        person_b_statement: personB.trim(),
        person_a_score: result.personA_score,
        person_b_score: result.personB_score,
        verdict: result.verdict,
        explanation: result.explanation,
        language: lang,
        status: "analyzed",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ dispute: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Mr Judge could not reach a verdict. Please try again." }, { status: 500 });
  }
}
