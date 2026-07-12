"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";

export function DashboardUserMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Open account menu"
        aria-expanded={isOpen}
        className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700/70 dark:text-slate-200 dark:hover:bg-slate-600"
      >
        <UserRound className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-[#1b2739]">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:text-red-300 dark:hover:bg-red-500/10"
          >
            <LogOut className="size-4" />
            {isLoggingOut ? "Signing out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}
