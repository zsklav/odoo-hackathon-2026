import { DollarSign, Route, ShieldCheck, Truck } from "lucide-react";

const coreEcosystem = [
  { label: "Fleet Manager", icon: Truck },
  { label: "Dispatcher", icon: Route },
  { label: "Safety Officer", icon: ShieldCheck },
  { label: "Financial Analyst", icon: DollarSign },
];

export function AuthBrandingPanel() {
  return (
    <div className="relative flex h-full flex-col justify-between gap-10 overflow-hidden bg-[oklch(0.16_0.02_260)] px-8 py-10 text-white lg:px-12 lg:py-14">
      {/* Atmospheric backdrop: layered gradients standing in for a photographic
          background, since no verified on-theme image source was available. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,oklch(0.28_0.05_255)_0%,oklch(0.16_0.02_260)_55%,oklch(0.08_0.01_260)_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 90% 70% at 50% 20%, black 0%, transparent 75%)",
          }}
        />
        <div className="absolute -left-20 top-1/3 size-72 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute -right-16 bottom-20 size-64 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-r from-transparent to-background/40" />
      </div>

      <div className="relative flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Truck className="size-5" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight tracking-tight text-primary">
              TransitOps
            </p>
            <p className="text-xs text-white/60">Smart Transport Operations Platform</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
          <p className="mb-3 text-xs font-semibold tracking-wide text-white/50 uppercase">
            Core Ecosystem
          </p>
          <ul className="space-y-2.5 text-sm">
            {coreEcosystem.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-2.5 text-white/90">
                <span className="flex size-6 items-center justify-center rounded-md bg-primary/15 text-primary">
                  <Icon className="size-3.5" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <blockquote className="relative rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm italic text-white/70 backdrop-blur-md">
        &ldquo;Unified intelligence for modern fleets. Monitor, manage, and optimize every route
        in real-time.&rdquo;
      </blockquote>
    </div>
  );
}
