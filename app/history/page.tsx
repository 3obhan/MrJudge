import Link from "next/link";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import { getLang } from "@/lib/lang-cookie";
import { COPY } from "@/lib/i18n";
import { supabaseServerSession, getSessionUser } from "@/lib/supabase-server";

export default async function HistoryPage() {
  const lang = getLang();
  const t = COPY[lang];

  const user = await getSessionUser();
  if (!user) redirect("/login");

  const supabase = supabaseServerSession();
  const { data: disputes } = await supabase
    .from("disputes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = disputes || [];

  return (
    <>
      <Nav t={t} lang={lang} />
      <div className="max-w-[820px] mx-auto px-[6vw] py-14 rise-in">
        <div className="mb-8 border-b border-navy/10 pb-5">
          <span className="font-mono text-[11px] tracking-[0.18em] text-gold uppercase">
            {lang === "fa" ? "بایگانی" : "Archive"}
          </span>
          <h1 className="font-display font-semibold text-[32px] text-navy mt-1">{t.historyTitle}</h1>
        </div>

        {list.length === 0 && <p className="text-muted">{t.noHistory}</p>}

        <div className="flex flex-col">
          {list.map((d: any, i: number) => (
            <div
              key={d.id}
              className="flex justify-between items-center gap-4 py-5 border-b border-navy/10 last:border-0 flex-wrap"
            >
              <div className="flex items-start gap-4 flex-1 min-w-[220px]">
                <span className="font-mono text-xs text-gold font-semibold pt-0.5 w-7 shrink-0">
                  {String(list.length - i).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-[12px] font-mono text-muted">{new Date(d.created_at).toLocaleString()}</div>
                  <div className="text-sm text-navy mt-1 font-display">{d.verdict?.slice(0, 90)}...</div>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-[12px] font-mono text-muted">A <b className="text-gold">{d.person_a_score}</b></span>
                <span className="text-[12px] font-mono text-muted">B <b className="text-gold">{d.person_b_score}</b></span>
                <Link
                  href={`/results/${d.id}`}
                  className="border border-navy/25 text-navy font-semibold rounded-lg px-4 py-2 text-sm hover:border-gold hover:text-gold transition-colors"
                >
                  {t.viewBtn}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
