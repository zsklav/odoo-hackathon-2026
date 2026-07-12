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
    <div className="dashboard-user-menu relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Open account menu"
        aria-expanded={isOpen}
        className="flex size-10 items-center justify-center rounded-full border border-white/[.1] bg-white/[.045] text-white/70 transition hover:border-orange-300/25 hover:bg-orange-500/[.1] hover:text-orange-300"
      >
        <UserRound className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-20 w-36 rounded-xl border border-white/[.1] bg-[#171a20] p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
          >
            <LogOut className="size-4" />
            {isLoggingOut ? "Signing out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}
