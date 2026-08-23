export default function Logo({ text, size = 34 }: { text: string; size?: number }) {
  return (
    <div className="flex items-center gap-2.5 animate-[logoIn_0.7s_cubic-bezier(0.2,0.8,0.2,1)]">
      <img
        src="/brand/mrjudge-mark.png"
        alt=""
        style={{ height: size, width: "auto" }}
      />
      <span
        className="font-display font-semibold text-navy tracking-tight"
        style={{ fontSize: size * 0.56 }}
      >
        {text}
      </span>
    </div>
  );
}
