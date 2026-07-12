import Link from "next/link";
import { LayoutGrid, DollarSign, Fuel, Map, BarChart3 } from "lucide-react";
import { FuelExpensesView } from "./fuel-expenses-view";

export const FINANCIAL_ANALYST_LINKS = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Fuel & Expenses", icon: Fuel },
  { label: "Trip Management", icon: Map },
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
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← TransitOps
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          Financial Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track expenses, fuel costs, and overall fleet ROI.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 py-14 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Expense tracking and ROI charts coming soon...
      </div>
    </>
  );
}
