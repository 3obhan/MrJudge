// The signature visual element: an embossed judicial seal, used on the
// verdict page and as an ambient motif on the homepage hero.
export default function Seal({ size = 128, label }: { size?: number; label?: string }) {
  const notches = Array.from({ length: 24 });
  return (
    <div
      className="relative animate-[sealIn_0.8s_cubic-bezier(0.2,0.8,0.2,1)_both]"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200">
        <defs>
          <radialGradient id="sealGrad" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ffd84d" />
            <stop offset="55%" stopColor="#ffc800" />
            <stop offset="100%" stopColor="#c99a00" />
          </radialGradient>
        </defs>
        {notches.map((_, i) => {
          const angle = (i / notches.length) * 2 * Math.PI;
          const x = 100 + Math.cos(angle) * 96;
          const y = 100 + Math.sin(angle) * 96;
          return <circle key={i} cx={x} cy={y} r="5.5" fill="#ffc800" opacity="0.85" />;
        })}
        <circle cx="100" cy="100" r="82" fill="url(#sealGrad)" />
        <circle cx="100" cy="100" r="82" fill="none" stroke="#a37a00" strokeWidth="1.5" opacity="0.5" />
        <circle cx="100" cy="100" r="68" fill="none" stroke="#0a0a0a" strokeWidth="1.2" opacity="0.35" />
        <g stroke="#0a0a0a" strokeWidth="3.2" strokeLinecap="round">
          <line x1="100" y1="58" x2="100" y2="128" />
          <line x1="72" y1="76" x2="128" y2="76" />
          <path d="M72 76 L56 104 A18 18 0 0 0 88 104 Z" fill="none" />
          <path d="M128 76 L112 104 A18 18 0 0 0 144 104 Z" fill="none" />
          <rect x="82" y="128" width="36" height="7" rx="2" fill="#0a0a0a" stroke="none" />
        </g>
        <circle cx="100" cy="63" r="4.5" fill="#0a0a0a" />
      </svg>
      {label && (
        <div className="absolute inset-0 flex items-end justify-center pb-3">
          <span className="text-[9px] tracking-[0.2em] text-ink/80 font-mono font-semibold">{label}</span>
        </div>
      )}
    </div>
  );
}
