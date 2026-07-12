import {
  Activity,
  ArrowUpRight,
  Building2,
  CircleDollarSign,
  Fuel,
  Gauge,
  MapPin,
  Navigation,
  Route,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

const metrics = [
  { label: "Active vehicles", value: "128", trend: "+8.2%", icon: Truck, position: "left-[2%] top-[30%]" },
  { label: "Drivers on duty", value: "96", trend: "Live", icon: Users, position: "right-[1%] top-[28%]" },
  { label: "Fleet utilization", value: "87%", trend: "+4.1%", icon: Gauge, position: "left-[7%] bottom-[18%]" },
  { label: "Trips today", value: "324", trend: "+12.7%", icon: Route, position: "right-[3%] bottom-[18%]" },
];

const roles = [
  { title: "Fleet Manager", detail: "Vehicle lifecycle · Asset utilization", icon: Truck },
  { title: "Dispatcher", detail: "Trip scheduling · Live operations", icon: Navigation },
  { title: "Safety Officer", detail: "Compliance · Driver safety", icon: ShieldCheck },
  { title: "Financial Analyst", detail: "Fuel · Expenses · ROI", icon: CircleDollarSign },
];

export function AuthBrandingPanel() {
  return (
    <aside className="auth-command-panel relative isolate flex min-h-screen overflow-hidden bg-[#07090d] px-7 py-8 text-white xl:px-10 xl:py-10">
      <div className="auth-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -left-32 top-[35%] size-80 rounded-full bg-orange-500/15 blur-[110px]" />
      <div className="pointer-events-none absolute -right-20 top-12 size-72 rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="auth-command-shade pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#07090d] via-[#07090d]/80 to-transparent" />

      <div className="relative flex w-full flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-[#ff7100] text-[#16110d] shadow-[0_10px_30px_rgba(255,122,0,.28)]">
              <Truck className="size-5" strokeWidth={2.4} />
            </span>
            <div>
              <p className="text-lg font-semibold tracking-[-0.04em]">TransitOps</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.17em] text-white/45">Smart transport operations</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-6 flex min-h-[420px] w-full max-w-[620px] items-center justify-center xl:mt-10">
          <div className="absolute h-[285px] w-[80%] rounded-[38%] border border-blue-300/10 bg-[radial-gradient(ellipse_at_center,rgba(42,101,180,.18),transparent_65%)]" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 620 420" fill="none" aria-hidden="true">
            <path className="auth-route auth-route-one" d="M38 276C130 248 112 129 234 156S347 305 442 220 519 82 593 126" stroke="#ff7a00" strokeWidth="1.5" strokeDasharray="5 8" />
            <path className="auth-route auth-route-two" d="M47 153C143 180 165 327 276 294S369 112 477 150 532 274 593 258" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="4 9" />
            <path d="M78 219C192 200 284 92 376 162S460 304 570 203" stroke="rgba(255,255,255,.16)" strokeWidth="1" />
          </svg>

          <div className="relative w-[58%] rounded-[26px] border border-white/10 bg-[#121821]/90 p-4 shadow-[0_32px_80px_rgba(0,0,0,.45)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[.07] pb-3">
              <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-white/40">Dispatch control</p><p className="mt-1 text-sm font-semibold">South India network</p></div>
              <span className="rounded-lg bg-white/[.06] px-2 py-1 text-[9px] font-medium text-white/60">12:42 IST</span>
            </div>
            <div className="relative mt-3 h-40 overflow-hidden rounded-2xl border border-white/[.06] bg-[#0c121a]">
              <div className="auth-map-grid absolute inset-0" />
              <div className="absolute left-[18%] top-[61%] size-2.5 rounded-full bg-orange-400 shadow-[0_0_16px_#ff7a00]" />
              <div className="absolute left-[65%] top-[28%] size-2.5 rounded-full bg-blue-400 shadow-[0_0_16px_#3b82f6]" />
              <div className="absolute right-[17%] bottom-[23%] size-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_#22c55e]" />
              <div className="absolute left-[42%] bottom-[15%] flex size-7 items-center justify-center rounded-lg border border-orange-300/30 bg-orange-500/15 text-orange-300"><Truck className="size-3.5" /></div>
              <div className="absolute right-[32%] top-[48%] flex size-7 items-center justify-center rounded-lg border border-blue-300/30 bg-blue-500/15 text-blue-300"><Truck className="size-3.5" /></div>
              <div className="absolute left-[46%] top-[24%] text-white/50"><Building2 className="size-4" /></div>
              <div className="absolute right-[13%] top-[18%] text-white/50"><MapPin className="size-4 fill-orange-400/30 text-orange-300" /></div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[9px]">
              <span className="rounded-lg bg-white/[.045] px-2 py-2 text-white/55"><b className="block text-xs text-white">24</b>en route</span>
              <span className="rounded-lg bg-white/[.045] px-2 py-2 text-white/55"><b className="block text-xs text-white">08</b>dispatching</span>
              <span className="rounded-lg bg-white/[.045] px-2 py-2 text-white/55"><b className="block text-xs text-white">04</b>alerts</span>
            </div>
          </div>

          {metrics.map(({ label, value, trend, icon: Icon, position }, index) => (
            <div key={label} className={`auth-float-card absolute hidden w-32 rounded-2xl border border-white/10 bg-[#171a20]/85 p-3 shadow-2xl backdrop-blur-xl sm:block ${position} ${index % 2 ? "auth-float-delayed" : ""}`}>
              <div className="flex items-center justify-between"><Icon className="size-3.5 text-orange-400" /><ArrowUpRight className="size-3 text-emerald-400" /></div>
              <p className="mt-3 text-[9px] font-medium uppercase tracking-[.1em] text-white/45">{label}</p>
              <div className="mt-1 flex items-end justify-between"><p className="text-xl font-semibold tracking-[-.05em]">{value}</p><span className="text-[9px] text-emerald-400">{trend}</span></div>
            </div>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 xl:grid-cols-4">
          {roles.map(({ title, detail, icon: Icon }) => (
            <div key={title} className="group rounded-2xl border border-white/[.08] bg-white/[.035] p-3.5 transition duration-300 hover:-translate-y-1 hover:border-orange-400/30 hover:bg-white/[.07]">
              <Icon className="size-4 text-orange-400 transition-transform duration-300 group-hover:scale-110" />
              <p className="mt-5 text-xs font-semibold">{title}</p>
              <p className="mt-1 text-[10px] leading-4 text-white/45">{detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-[10px] text-white/35"><Activity className="size-3 text-emerald-400" />Network telemetry updated moments ago <span className="ml-auto flex items-center gap-1"><Fuel className="size-3" />18.7 km/L</span><span className="flex items-center gap-1"><Wrench className="size-3 text-amber-300" />4 alerts</span></div>
      </div>
    </aside>
  );
}
