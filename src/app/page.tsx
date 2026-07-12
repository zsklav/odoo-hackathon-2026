import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { HomeStyles } from "./_components/home/HomeStyles";
import { HomeBackground } from "./_components/home/HomeBackground";
import { Hero } from "./_components/home/Hero";
import { FeaturesSection } from "./_components/home/FeaturesSection";
import { NAV_LINKS } from "./_components/home/data";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full font-sans text-zinc-900 dark:text-zinc-100">
      <HomeStyles />
      <HomeBackground />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-[#fafafa]/70 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#090909]/70">
        <div className="flex h-16 w-full items-center justify-between px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white shadow-[0_0_20px_rgba(249,115,22,0.35)]">
                T
              </span>
              <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">TransitOps</span>
            </Link>
            <nav className="hidden items-center gap-7 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-gradient-to-b from-orange-400 to-orange-600 px-4 py-1.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,0.3)]"
            >
              Get Started
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="w-full px-6 pb-32 sm:px-10 lg:px-16">
        <Hero />
        <FeaturesSection />
      </main>
    </div>
  );
}
