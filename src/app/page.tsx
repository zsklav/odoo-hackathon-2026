const modules = [
  { title: "Vehicle Registry", desc: "Fleet master list · unique reg no · status lifecycle", icon: "🚛" },
  { title: "Driver Management", desc: "Profiles · license validity · safety score · status", icon: "🧑‍✈️" },
  { title: "Trip Dispatch", desc: "Assign vehicle + driver · rule checks · Draft→Dispatched→Completed", icon: "🗺️" },
  { title: "Maintenance", desc: "Service logs · auto 'In Shop' · hidden from dispatch", icon: "🔧" },
  { title: "Fuel & Expenses", desc: "Fuel logs · tolls · auto operational cost per vehicle", icon: "⛽" },
  { title: "Reports & Analytics", desc: "Fuel efficiency · fleet utilization · ROI · CSV export", icon: "📊" },
];

const roles = ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-5xl px-6 py-16 sm:py-24">
        <span className="inline-block rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-white/15 dark:text-zinc-400">
          Odoo Hackathon 2026 · Virtual Round
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-black sm:text-6xl dark:text-zinc-50">
          TransitOps
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          A smart transport operations platform — digitize vehicles, drivers,
          dispatch, maintenance, and expenses with enforced business rules and
          operational insight.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {roles.map((r) => (
            <span
              key={r}
              className="rounded-md bg-black/5 px-2.5 py-1 text-sm text-zinc-700 dark:bg-white/10 dark:text-zinc-300"
            >
              {r}
            </span>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div
              key={m.title}
              className="rounded-xl border border-black/[.08] bg-white p-5 transition-colors hover:border-black/20 dark:border-white/[.12] dark:bg-zinc-900 dark:hover:border-white/25"
            >
              <div className="text-2xl">{m.icon}</div>
              <h2 className="mt-3 font-semibold text-black dark:text-zinc-50">
                {m.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {m.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-14 text-sm text-zinc-500 dark:text-zinc-500">
          Next.js 16 · React 19 · Tailwind v4 · Prisma + Postgres (planned) ·
          Auth + RBAC. Edit{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">
            src/app/page.tsx
          </code>{" "}
          to start.
        </p>
      </main>
    </div>
  );
}
