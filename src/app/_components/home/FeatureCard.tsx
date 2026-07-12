import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HomeModule } from "./data";

export function FeatureCard({ module }: { module: HomeModule }) {
  const { title, description, icon: Icon, href, tag } = module;

  const inner = (
    <>
      {/* hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-b from-orange-500/[0.07] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="flex size-11 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-600 transition-colors duration-300 group-hover:border-orange-500/40 group-hover:bg-orange-500/15 dark:text-orange-300 dark:group-hover:text-orange-200">
          <Icon className="size-5" />
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            href
              ? "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-300"
              : "border-black/[0.1] text-zinc-500 dark:border-white/[0.08]"
          }`}
        >
          {tag}
        </span>
      </div>

      <h3 className="relative mt-5 text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
      <p className="relative mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-500">{description}</p>

      {href && (
        <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-orange-600 transition-colors group-hover:text-orange-500 dark:text-orange-300/80 dark:group-hover:text-orange-300">
          Explore module
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      )}
    </>
  );

  const base =
    "group relative block h-full overflow-hidden rounded-[20px] border border-black/[0.08] bg-white/60 p-6 transition-all duration-300 dark:border-white/[0.07] dark:bg-white/[0.015]";

  return href ? (
    <Link
      href={href}
      className={`${base} hover:-translate-y-1.5 hover:border-orange-500/30 hover:shadow-[0_12px_40px_rgba(249,115,22,0.12)] dark:hover:border-orange-500/25 dark:hover:shadow-[0_12px_40px_rgba(249,115,22,0.08)]`}
    >
      {inner}
    </Link>
  ) : (
    <div className={`${base} opacity-80`}>{inner}</div>
  );
}
