export default function LoadingOverlay({ t }: { t: any }) {
  return (
    <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-parchment rounded-2xl px-12 py-10 text-center max-w-[320px] shadow-2xl border border-gold/20">
        <div className="mx-auto mb-5 w-14 h-14 relative">
          <svg width="56" height="56" viewBox="0 0 64 64" className="animate-[swing_1.4s_ease-in-out_infinite]">
            <line x1="32" y1="8" x2="32" y2="52" stroke="#ffc800" strokeWidth="3" />
            <line x1="10" y1="18" x2="54" y2="18" stroke="#ffc800" strokeWidth="3" />
            <circle cx="10" cy="30" r="7" fill="none" stroke="#ffc800" strokeWidth="2.5" />
            <circle cx="54" cy="30" r="7" fill="none" stroke="#ffc800" strokeWidth="2.5" />
            <circle cx="32" cy="12" r="3.5" fill="#ffc800" />
          </svg>
        </div>
        <h3 className="font-display font-semibold text-navy text-lg mb-2">{t.analyzing}</h3>
        <p className="text-[13px] text-muted m-0">{t.analyzingSub}</p>
      </div>
    </div>
  );
}
