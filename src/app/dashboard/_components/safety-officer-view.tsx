import Link from 'next/link'
import { LayoutGrid, Shield, BarChart3, Settings, HelpCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardUserMenu } from "./dashboard-user-menu";
import { NotificationMenu } from "./notification-menu";
import { ReportsView } from "./fleet-reports-view";

export const SAFETY_OFFICER_LINKS = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "License", icon: Shield },
  { label: "Reports", icon: BarChart3 },
];

export async function SafetyOfficerView({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const tab = sp.tab || "dashboard";

  if (tab === "reports") {
    return <ReportsView />;
  }

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← TransitOps
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            Safety Officer Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor driver compliance and safety metrics.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <div className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <ThemeToggle />
          </div>
          <NotificationMenu />
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </button>
          <DashboardUserMenu />
        </div>
      </div>
      
      <div className="rounded-xl border border-dashed border-gray-300 py-14 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Driver compliance table coming soon...
      </div>
    </>
  )
}
