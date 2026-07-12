/**
 * Decorative background: soft spotlight behind the hero, faint radial gradients,
 * a subtle grid pattern and noise texture. Theme-aware (light + dark).
 */
export function HomeBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#fafafa] dark:bg-[#090909]">
      {/* Spotlight behind hero */}
      <div
        className="absolute left-1/2 top-[-12%] h-[680px] w-[1100px] -translate-x-1/2 rounded-full opacity-40 blur-[140px] dark:opacity-50"
        style={{ background: "radial-gradient(closest-side, rgba(249,115,22,0.12), transparent 70%)" }}
      />
      {/* Ambient side glows */}
      <div
        className="absolute right-[-6%] top-[28%] h-[520px] w-[520px] rounded-full opacity-40 blur-[140px] dark:opacity-50"
        style={{ background: "radial-gradient(closest-side, rgba(251,146,60,0.08), transparent)" }}
      />
      <div
        className="absolute left-[-6%] top-[60%] h-[480px] w-[480px] rounded-full opacity-30 blur-[140px] dark:opacity-40"
        style={{ background: "radial-gradient(closest-side, rgba(245,158,11,0.07), transparent)" }}
      />

      {/* Grid pattern — light */}
      <div
        className="absolute inset-0 block dark:hidden"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 90% 55% at 50% 0%, black 35%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 55% at 50% 0%, black 35%, transparent 100%)",
        }}
      />
      {/* Grid pattern — dark */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 90% 55% at 50% 0%, black 35%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 55% at 50% 0%, black 35%, transparent 100%)",
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-soft-light dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
