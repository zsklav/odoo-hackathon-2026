import { Reveal } from "./Reveal";
import { FeatureCard } from "./FeatureCard";
import { MODULES } from "./data";

export function FeaturesSection() {
  return (
    <section id="capabilities" className="pt-32 sm:pt-40">
      <Reveal className="flex flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500 dark:text-orange-400">
          Core Capabilities
        </p>
        <h2 className="mt-3 text-[32px] font-bold tracking-tight text-zinc-900 sm:text-[40px] dark:text-white">
          Precision-Engineered Logistics
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-500">
          Six tightly integrated modules — from fleet registry to analytics — with business
          rules enforced end-to-end.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((module, i) => (
          <Reveal key={module.title} delay={(i % 3) * 80}>
            <FeatureCard module={module} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 text-center text-sm text-zinc-500 dark:text-zinc-600">
        Next.js 16 · React 19 · Tailwind v4 · Prisma + Postgres · Custom auth &amp; RBAC
      </Reveal>
    </section>
  );
}
