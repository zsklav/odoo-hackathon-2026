import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LayoutGrid, DollarSign, Fuel, BarChart3, ArrowRight, Settings, HelpCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardUserMenu } from "./dashboard-user-menu";
import { NotificationMenu } from "./notification-menu";
import { FuelExpensesView } from "./fuel-expenses-view";
import { FinancialReportsView } from "./financial-reports-view";

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

  if (tab === "reports") {
    return <FinancialReportsView />;
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

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch MTD Costs
  const mtdFuelLogs = await prisma.fuelLog.findMany({
    where: { date: { gte: startOfMonth } },
    include: { vehicle: true },
    orderBy: { date: "desc" },
  });
  
  const mtdMaintenanceLogs = await prisma.maintenanceLog.findMany({
    where: { openedAt: { gte: startOfMonth } },
    include: { vehicle: true },
    orderBy: { openedAt: "desc" },
  });
  
  const mtdExpenses = await prisma.expense.findMany({
    where: { date: { gte: startOfMonth } },
    include: { vehicle: true },
    orderBy: { date: "desc" },
  });

  const totalFuelCost = mtdFuelLogs.reduce((acc, log) => acc + log.cost, 0);
  const totalMaintenanceCost = mtdMaintenanceLogs.reduce((acc, log) => acc + log.cost, 0);
  const totalOtherExpenses = mtdExpenses.reduce((acc, log) => acc + log.cost, 0);
  const totalOperationalCost = totalFuelCost + totalMaintenanceCost + totalOtherExpenses;

  // Combine and sort recent activities
  const recentActivities = [
    ...mtdFuelLogs.map(log => ({ id: `fuel-${log.id}`, type: "Fuel", cost: log.cost, date: log.date, vehicle: log.vehicle.registrationNumber })),
    ...mtdMaintenanceLogs.map(log => ({ id: `maint-${log.id}`, type: "Maintenance", cost: log.cost, date: log.openedAt, vehicle: log.vehicle.registrationNumber })),
    ...mtdExpenses.map(log => ({ id: `exp-${log.id}`, type: log.type, cost: log.cost, date: log.date, vehicle: log.vehicle.registrationNumber }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);

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

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4 mb-8">
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#1e293b] p-5 shadow-sm transition-colors">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Total MTD Cost</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-200">
              ₹{totalOperationalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#1e293b] p-5 shadow-sm transition-colors">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">MTD Fuel</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-200">
              ₹{totalFuelCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#1e293b] p-5 shadow-sm transition-colors">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">MTD Maintenance</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-200">
              ₹{totalMaintenanceCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#1e293b] p-5 shadow-sm transition-colors">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">MTD Other Expenses</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-200">
              ₹{totalOtherExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <Link
            href="/dashboard?role=FINANCIAL_ANALYST&tab=fuel-expenses"
            className="group rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-orange-300 hover:bg-orange-50 dark:border-gray-700 dark:bg-[#162032] dark:hover:border-orange-400/60 dark:hover:bg-[#1a2536]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-lg bg-orange-500/10 p-3 text-orange-600 dark:text-orange-300">
                <Fuel className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Fuel & Expenses Logs
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View all individual expense tracking and fuel logs.
            </p>
          </Link>
          
          <Link
            href="/dashboard?role=FINANCIAL_ANALYST&tab=reports"
            className="group rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-orange-300 hover:bg-orange-50 dark:border-gray-700 dark:bg-[#162032] dark:hover:border-orange-400/60 dark:hover:bg-[#1a2536]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-lg bg-orange-500/10 p-3 text-orange-600 dark:text-orange-300">
                <BarChart3 className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Analytics & Reports
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Go to deep dive analytics on fleet finances.
            </p>
          </Link>
        </div>

        {/* Recent Financial Activity */}
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#162032] overflow-hidden shadow-sm flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700/50">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Financial Activity</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b border-slate-200 dark:border-slate-700/50 text-xs font-bold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">Vehicle</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 text-slate-700 dark:text-slate-300">
                {recentActivities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-4 text-center text-sm text-slate-500">
                      No recent activities this month.
                    </td>
                  </tr>
                ) : (
                  recentActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4 font-mono font-medium text-slate-900 dark:text-slate-200">
                        {activity.vehicle}
                      </td>
                      <td className="px-5 py-4 text-xs font-medium">
                        {activity.date.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                          {activity.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-right text-[#f58f29]">
                        ₹{activity.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
