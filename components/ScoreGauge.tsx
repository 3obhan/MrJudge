"use client";
import { useEffect, useState } from "react";

export default function ScoreGauge({ score, label }: { score: number; label: string }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(score), 150);
    return () => clearTimeout(timeout);
  }, [score]);

  const color = score >= 66 ? "#3f7a4f" : score >= 40 ? "#ffc800" : "#a5433a";
  const r = 56;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[136px] h-[136px]">
        <svg width="136" height="136" viewBox="0 0 136 136">
          <circle cx="68" cy="68" r={r} fill="none" stroke="#e7e2d3" strokeWidth="9" />
          <circle
            cx="68"
            cy="68"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 68 68)"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1), stroke 1.2s" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[30px] font-semibold text-navy leading-none">{animated}</span>
          <span className="text-[10px] font-mono text-muted mt-1">/ 100</span>
        </div>
      </div>
      <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-navy/70 font-semibold">{label}</span>
    </div>
  );
}
