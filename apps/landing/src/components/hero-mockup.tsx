const ALT =
  "Padu desktop app with coding agents, a conversation, and a code diff open side by side";

export function HeroMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 ring-1 ring-white/5 shadow-2xl shadow-black/90 bg-[#0c0c0e]">
      <img
        src="/hero-mockup.png"
        alt={ALT}
        width={2266}
        height={1752}
        className="w-full h-auto block select-none"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

