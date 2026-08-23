"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import VoiceButton from "./VoiceButton";
import LoadingOverlay from "./LoadingOverlay";
import type { Lang } from "@/lib/i18n";

export default function DisputeForm({ t, lang }: { t: any; lang: Lang }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const disabled = !a.trim() || !b.trim() || loading;

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const resp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personA: a.trim(), personB: b.trim(), language: lang }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || t.genericError);
      router.push(`/results/${data.dispute.id}`);
    } catch (e) {
      setError(t.genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[820px] mx-auto px-[6vw] py-14 rise-in">
      <div className="mb-8 border-b border-navy/10 pb-5">
        <span className="font-mono text-[11px] tracking-[0.18em] text-gold uppercase">
          {lang === "fa" ? "پرونده جدید" : "New Case"}
        </span>
        <h1 className="font-display font-semibold text-[32px] text-navy mt-1">{t.newDispute}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/70 border border-navy/10 rounded-2xl p-5 shadow-card">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-display font-semibold text-navy">{t.personA}</label>
            <VoiceButton lang={lang} t={t} onText={(txt) => setA((prev) => (prev ? prev + " " : "") + txt)} />
          </div>
          <textarea
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder={t.placeholderA}
            rows={8}
            className="w-full box-border p-3.5 rounded-xl border border-navy/15 bg-white text-sm leading-relaxed resize-y outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="bg-white/70 border border-navy/10 rounded-2xl p-5 shadow-card">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-display font-semibold text-navy">{t.personB}</label>
            <VoiceButton lang={lang} t={t} onText={(txt) => setB((prev) => (prev ? prev + " " : "") + txt)} />
          </div>
          <textarea
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder={t.placeholderB}
            rows={8}
            className="w-full box-border p-3.5 rounded-xl border border-navy/15 bg-white text-sm leading-relaxed resize-y outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg px-4 py-3 text-[13px] mt-6">
          {error}
        </div>
      )}

      <button
        disabled={disabled}
        onClick={submit}
        className="w-full bg-navy text-parchment font-semibold rounded-xl py-3.5 text-sm tracking-wide mt-7 hover:bg-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-card"
      >
        {t.analyze}
      </button>

      {loading && <LoadingOverlay t={t} />}
    </div>
  );
}
