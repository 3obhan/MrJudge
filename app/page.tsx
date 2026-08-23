import Link from "next/link";
import Nav from "@/components/Nav";
import Seal from "@/components/Seal";
import { getLang } from "@/lib/lang-cookie";
import { COPY } from "@/lib/i18n";

export default function Home() {
  const lang = getLang();
  const t = COPY[lang];

  return (
    <>
      <Nav t={t} lang={lang} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-[6vw] pt-[9vh] pb-[7vh] grid md:grid-cols-[1.15fr_.85fr] gap-14 items-center">
          <div className="rise-in">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-navy/60 uppercase mb-6 border border-navy/15 rounded-full px-3 py-1.5">
              {t.unlimited}
            </div>
            <h1 className="font-display font-semibold text-[clamp(34px,4.6vw,58px)] text-navy leading-[1.08] mb-6 tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="text-[17px] text-muted max-w-[520px] mb-9 leading-[1.75]">{t.heroBody}</p>
            <div className="flex gap-4 flex-wrap items-center">
              <Link
                href="/new-dispute"
                className="bg-navy text-parchment font-semibold rounded-lg px-7 py-3.5 text-sm tracking-wide hover:bg-ink transition-colors shadow-card"
              >
                {t.startBtn}
              </Link>
              <Link
                href="/history"
                className="text-navy font-semibold text-sm border-b border-navy/30 pb-0.5 hover:border-gold hover:text-gold transition-colors"
              >
                {t.viewHistory} →
              </Link>
            </div>
          </div>

          <div className="hidden md:flex justify-center items-center relative">
            <div className="absolute w-[300px] h-[300px] rounded-full bg-gold/10 blur-3xl" />
            <Seal size={200} label={lang === "fa" ? "حکم رسمی" : "OFFICIAL RULING"} />
          </div>
        </div>
      </section>

      {/* Docket / features */}
      <section className="border-t border-navy/10 bg-white/40">
        <div className="max-w-[880px] mx-auto px-[6vw] py-[7vh]">
          <div className="flex items-baseline justify-between mb-8 border-b border-navy/10 pb-4">
            <h2 className="font-display font-semibold text-2xl text-navy">{t.featuresTitle}</h2>
            <span className="font-mono text-[11px] tracking-[0.15em] text-navy/40 uppercase hidden sm:inline">
              {lang === "fa" ? "روند رسیدگی" : "Case Docket"}
            </span>
          </div>
          <div>
            {t.features.map((f: any, i: number) => (
              <div
                key={i}
                className="flex items-start gap-6 py-6 border-b border-navy/8 last:border-0 group"
              >
                <span className="font-mono text-xs text-gold font-semibold pt-1 shrink-0 w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display font-semibold text-lg text-navy mb-1.5">{f.t}</h3>
                  <p className="text-sm text-muted leading-relaxed max-w-[520px]">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
