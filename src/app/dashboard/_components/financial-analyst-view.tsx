import Link from "next/link";
import { LayoutGrid, DollarSign, Fuel, BarChart3, ArrowRight, Settings, HelpCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardUserMenu } from "./dashboard-user-menu";
import { NotificationMenu } from "./notification-menu";
import { FuelExpensesView } from "./fuel-expenses-view";

export const FINANCIAL_ANALYST_LINKS = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Fuel & Expenses", icon: Fuel },
  { label: "Reports", icon: BarChart3 },
];

type SearchType = { tab?: string };

export async function FinancialAnalystView({
  searchParams,
}: {
  searchParams?: Promise<SearchType>;
}) {
  const sp = searchParams ? await searchParams : {};
  const tab = sp.tab || "dashboard";

  if (tab === "fuel-expenses") {
    return <FuelExpensesView />;
  }

  if (tab !== "dashboard") {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
        <div className="text-center">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white capitalize">
            {tab.replace("-", " ")}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            This module is under construction.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ← TransitOps
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Financial Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track fuel costs, expenses, and overall fleet ROI.
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

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/fuel-logs"
          className="group rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-orange-300 hover:bg-orange-50 dark:border-gray-700 dark:bg-[#162032] dark:hover:border-orange-400/60 dark:hover:bg-[#1a2536]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-lg bg-orange-500/10 p-3 text-orange-600 dark:text-orange-300">
              <Fuel className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Fuel Logs
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Log refuels against a vehicle with liters, cost, and date.
          </p>
        </Link>

        <Link
          href="/expenses"
          className="group rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-orange-300 hover:bg-orange-50 dark:border-gray-700 dark:bg-[#162032] dark:hover:border-orange-400/60 dark:hover:bg-[#1a2536]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-lg bg-orange-500/10 p-3 text-orange-600 dark:text-orange-300">
              <DollarSign className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Expenses
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track tolls, maintenance spend, and other vehicle-linked costs.
          </p>
        </Link>
      </div>
    </>
  );
}
