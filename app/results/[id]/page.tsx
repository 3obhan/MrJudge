import { notFound, redirect } from "next/navigation";
import Nav from "@/components/Nav";
import VerdictDisplay from "@/components/VerdictDisplay";
import { getLang } from "@/lib/lang-cookie";
import { COPY } from "@/lib/i18n";
import { supabaseServerSession, getSessionUser } from "@/lib/supabase-server";

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const lang = getLang();
  const t = COPY[lang];

  const user = await getSessionUser();
  if (!user) redirect("/login");

  const supabase = supabaseServerSession();
  const { data: dispute } = await supabase
    .from("disputes")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!dispute) notFound();

  return (
    <>
      <Nav t={t} lang={lang} />
      <VerdictDisplay t={t} dispute={dispute} />
    </>
  );
}
