"use client";
import ScoreGauge from "./ScoreGauge";
import Seal from "./Seal";
import { useRouter } from "next/navigation";

function escapeHtml(s: string) {
  return (s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

export default function VerdictDisplay({ t, dispute }: { t: any; dispute: any }) {
  const router = useRouter();

  const downloadPdf = () => {
    const html = `
      <html dir="${t.dir}"><head><meta charset="utf-8"><title>${t.brand} — ${t.verdictTitle}</title>
      <style>
        @page { margin: 22mm 18mm; }
        body{font-family:${t.dir === "rtl" ? "Vazirmatn" : "Georgia, serif"},sans-serif;color:#0a0a0a;margin:0}
        h1{font-size:22px;border-bottom:3px solid #ffc800;padding-bottom:10px}
        h2{font-size:14px;margin-top:26px;color:#0a0a0a;text-transform:uppercase;letter-spacing:.08em}
        .score{display:inline-block;margin-inline-end:30px;font-size:15px}
        .score b{color:#ffc800;font-size:20px}
        p{line-height:1.75;font-size:13px;white-space:pre-wrap}
        .box{background:#f6f3ea;border-radius:8px;padding:16px;margin-top:6px}
      </style></head><body>
      <h1>${t.brand} — ${t.verdictTitle}</h1>
      <div class="score">${t.scoreA}: <b>${dispute.person_a_score}</b>/100</div>
      <div class="score">${t.scoreB}: <b>${dispute.person_b_score}</b>/100</div>
      <h2>${t.personA}</h2><div class="box"><p>${escapeHtml(dispute.person_a_statement)}</p></div>
      <h2>${t.personB}</h2><div class="box"><p>${escapeHtml(dispute.person_b_statement)}</p></div>
      <h2>${t.verdictTitle}</h2><p>${escapeHtml(dispute.verdict)}</p>
      <h2>${t.explanationTitle}</h2><p>${escapeHtml(dispute.explanation)}</p>
      </body></html>
    `;

    // A hidden same-page iframe avoids popup blockers entirely (no new
    // window/tab is opened, so there's nothing for the browser to block).
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const cleanup = () => {
      setTimeout(() => {
        if (iframe.parentNode) document.body.removeChild(iframe);
      }, 1000);
    };

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      cleanup();
      return;
    }
    doc.open();
    doc.write(html);
    doc.close();

    const triggerPrint = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        cleanup();
      }
    };

    // Wait for fonts/layout in the iframe before invoking print.
    if (iframe.contentWindow?.document.readyState === "complete") {
      setTimeout(triggerPrint, 250);
    } else {
      iframe.onload = () => setTimeout(triggerPrint, 250);
    }
  };

  return (
    <div className="max-w-[820px] mx-auto px-[6vw] py-14 rise-in">
      <div className="flex items-start justify-between gap-6 mb-2 border-b border-navy/10 pb-5">
        <div>
          <span className="font-mono text-[11px] tracking-[0.18em] text-gold uppercase">
            {new Date(dispute.created_at).toLocaleDateString()}
          </span>
          <h1 className="font-display font-semibold text-[32px] text-navy mt-1">{t.verdictTitle}</h1>
        </div>
        <div className="shrink-0 hidden sm:block">
          <Seal size={72} />
        </div>
      </div>

      <div className="flex gap-10 justify-center my-10 flex-wrap">
        <ScoreGauge score={dispute.person_a_score} label={t.scoreA} />
        <ScoreGauge score={dispute.person_b_score} label={t.scoreB} />
      </div>

      <div className="bg-white border border-navy/10 rounded-2xl p-7 mb-5 shadow-card relative">
        <span className="absolute -top-2.5 start-6 bg-parchment px-2 font-mono text-[10px] tracking-[0.15em] text-gold uppercase">
          {t.verdictTitle}
        </span>
        <p className="text-[15px] leading-8 text-ink/90 m-0 font-display">{dispute.verdict}</p>
      </div>

      <div className="bg-white/60 border border-navy/10 rounded-2xl p-7 mb-8 relative">
        <span className="absolute -top-2.5 start-6 bg-parchment px-2 font-mono text-[10px] tracking-[0.15em] text-navy/50 uppercase">
          {t.explanationTitle}
        </span>
        <p className="text-sm leading-8 text-muted m-0 whitespace-pre-wrap">{dispute.explanation}</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={downloadPdf}
          className="bg-navy text-parchment font-semibold rounded-xl px-6 py-3 text-sm tracking-wide hover:bg-ink transition-colors shadow-card"
        >
          {t.downloadPdf}
        </button>
        <button
          onClick={() => router.push("/new-dispute")}
          className="border border-navy/25 text-navy font-semibold rounded-xl px-6 py-3 text-sm hover:border-gold hover:text-gold transition-colors"
        >
          {t.newDisputeBtn}
        </button>
      </div>
    </div>
  );
}
