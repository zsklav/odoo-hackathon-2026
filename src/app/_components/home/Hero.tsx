import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { DashboardPreview } from "./DashboardPreview";

export function Hero() {
  return (
    <section className="flex flex-col items-center pt-20 text-center sm:pt-28">
      {/* Status badge */}
      <span
        className="home-enter inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-xs font-semibold tracking-wide text-zinc-700 backdrop-blur dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300"
        style={{ animationDelay: "0s" }}
      >
        <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        SYSTEM STATUS: OPTIMAL
      </span>

      {/* Headline */}
      <h1
        className="home-enter mt-8 max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl dark:text-white"
        style={{ animationDelay: "0.06s" }}
      >
        Unified Intelligence for
        <br />
        <span className="bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 bg-clip-text text-transparent dark:from-orange-400 dark:to-amber-300">
          Modern Fleets.
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className="home-enter mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400"
        style={{ animationDelay: "0.12s" }}
      >
        Digitize your vehicle lifecycle, driver compliance, and operational analytics in one
        centralized command center designed for precision.
      </p>

      {/* Buttons */}
      <div
        className="home-enter mt-9 flex flex-wrap items-center justify-center gap-3"
        style={{ animationDelay: "0.18s" }}
      >
        <Link
          href="/register"
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-orange-400 to-orange-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_35px_rgba(249,115,22,0.35)]"
        >
          Get Started
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-6 py-3 text-sm font-semibold text-zinc-800 transition-colors duration-200 hover:border-black/20 hover:bg-white dark:border-white/12 dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:border-white/25 dark:hover:bg-white/[0.06]"
        >
          <Play className="size-4 fill-current" />
          Watch Demo
        </Link>
      </div>

      {/* Product preview */}
      <div className="home-enter mx-auto mt-16 w-full max-w-5xl" style={{ animationDelay: "0.28s" }}>
        <DashboardPreview />
      </div>
    </section>
  );
}
