import { Truck, Users, TrendingUp, MapPin, Navigation, AlertTriangle } from "lucide-react";

/* --------------------------------- map --------------------------------- */

function FleetMap() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0b0b0d]">
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      {/* radial vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(249,115,22,0.06), transparent)" }}
      />

      <svg viewBox="0 0 500 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {/* routes */}
        <path d="M60,230 C140,210 180,120 260,120 C340,120 380,70 440,60" fill="none" stroke="rgba(251,146,60,0.5)" strokeWidth="2" strokeDasharray="4 5" />
        <path d="M80,90 C160,110 210,190 300,200 C360,206 400,180 450,190" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" strokeDasharray="4 5" />
        <path d="M120,260 C200,250 250,240 320,150 C360,100 400,120 460,110" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="3 5" />

        {/* nodes */}
        {[
          [60, 230],
          [260, 120],
          [440, 60],
          [80, 90],
          [300, 200],
          [450, 190],
          [320, 150],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="rgba(255,255,255,0.35)" />
        ))}

        {/* active vehicle pulses */}
        <circle cx="260" cy="120" r="7" fill="rgba(249,115,22,0.18)" />
        <circle cx="260" cy="120" r="3.5" fill="#f97316" />
        <circle cx="300" cy="200" r="7" fill="rgba(52,211,153,0.18)" />
        <circle cx="300" cy="200" r="3.5" fill="#34d399" />
      </svg>

      {/* map markers (lucide) */}
      <div className="absolute left-[24%] top-[26%] text-orange-400">
        <Navigation className="size-4 -rotate-45 fill-orange-400" />
      </div>
      <div className="absolute right-[10%] top-[16%] text-zinc-300">
        <MapPin className="size-4" />
      </div>

      {/* overlay KPI chips */}
      <div className="absolute left-4 top-4 rounded-xl border border-white/[0.08] bg-black/50 px-3 py-2 backdrop-blur">
        <p className="text-[10px] text-zinc-400">Active Vehicles</p>
        <p className="text-lg font-bold leading-none text-white">128</p>
        <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-400">
          <TrendingUp className="size-3" /> +8.2%
        </p>
      </div>
      <div className="absolute bottom-4 left-4 rounded-xl border border-white/[0.08] bg-black/50 px-3 py-2 backdrop-blur">
        <p className="text-[10px] text-zinc-400">Fleet Utilization</p>
        <p className="text-lg font-bold leading-none text-white">87%</p>
      </div>
      <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/50 px-2.5 py-1 text-[10px] text-zinc-300 backdrop-blur">
        <span className="size-1.5 rounded-full bg-emerald-400" /> 12:42 IST
      </div>
    </div>
  );
}

/* ------------------------------ side widgets ------------------------------ */

function MiniStat({ icon: Icon, label, value, delta }: { icon: typeof Truck; label: string; value: string; delta?: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-zinc-50 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-zinc-500">{label}</p>
        <Icon className="size-3.5 text-zinc-500" />
      </div>
      <p className="mt-1.5 text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
      {delta && (
        <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-400">
          <TrendingUp className="size-3" /> {delta}
        </p>
      )}
    </div>
  );
}

/* ------------------------------ main preview ------------------------------ */

export function DashboardPreview() {
  return (
    <div className="home-enter" style={{ animationDelay: "0.25s" }}>
      <div className="home-float relative text-left">
        {/* glow */}
        <div className="absolute -inset-4 -z-10 rounded-[28px] bg-orange-500/[0.07] blur-2xl" />

        <div className="overflow-hidden rounded-[20px] border border-black/[0.08] bg-white shadow-xl dark:border-white/[0.08] dark:bg-[#0d0d0f] dark:shadow-2xl">
          {/* window chrome */}
          <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-3.5 dark:border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-black/15 dark:bg-white/15" />
                <span className="size-2.5 rounded-full bg-black/15 dark:bg-white/15" />
                <span className="size-2.5 rounded-full bg-black/15 dark:bg-white/15" />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Dispatch Control</span>
              <span className="hidden text-xs text-zinc-500 sm:inline dark:text-zinc-600">· South India Network</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-400" /> Live
            </span>
          </div>

          {/* body: map + side rail */}
          <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3 lg:p-5">
            <div className="lg:col-span-2">
              <div className="h-[260px] sm:h-[300px]">
                <FleetMap />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <MiniStat icon={Users} label="Drivers on Duty" value="96" delta="Live" />
              <MiniStat icon={Navigation} label="Trips Today" value="324" delta="+12.7%" />
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.08] p-4 dark:border-orange-500/15 dark:bg-orange-500/[0.06]">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-300">
                  <AlertTriangle className="size-3.5" />
                  <p className="text-[11px] font-medium">4 active alerts</p>
                </div>
                <p className="mt-1 text-xs text-zinc-500">2 maintenance · 2 route delays</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
