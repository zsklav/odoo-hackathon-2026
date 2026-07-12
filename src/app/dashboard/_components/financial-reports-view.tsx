import { Search, Bell, Settings, HelpCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardUserMenu } from "./dashboard-user-menu";
import { NotificationMenu } from "./notification-menu";
import { prisma } from "@/lib/prisma";
import { FinancialReportsCharts } from "./financial-reports-charts";
import { ExportPdfButton } from "./export-pdf-button";
import Link from "next/link";

export async function FinancialReportsView() {
  // Fetch all financial data
  const fuelLogs = await prisma.fuelLog.findMany({ include: { vehicle: true } });
  const maintenanceLogs = await prisma.maintenanceLog.findMany({ include: { vehicle: true } });
  const expenses = await prisma.expense.findMany({ include: { vehicle: true } });

  // 1. Cost Breakdown Data
  const totalFuel = fuelLogs.reduce((acc, log) => acc + log.cost, 0);
  const totalMaintenance = maintenanceLogs.reduce((acc, log) => acc + log.cost, 0);
  const totalExpenses = expenses.reduce((acc, log) => acc + log.cost, 0);

  const costBreakdownData = [
    { name: "Fuel", value: totalFuel },
    { name: "Maintenance", value: totalMaintenance },
    { name: "Other Expenses", value: totalExpenses },
  ].filter(item => item.value > 0);

  // 2. Financial Trend Data (Last 6 Months)
  const last6Months: Record<string, { fuel: number; maintenance: number; expenses: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthStr = d.toLocaleString("default", { month: "short", year: "2-digit" });
    last6Months[monthStr] = { fuel: 0, maintenance: 0, expenses: 0 };
  }

  fuelLogs.forEach((log) => {
    const monthStr = log.date.toLocaleString("default", { month: "short", year: "2-digit" });
    if (last6Months[monthStr]) last6Months[monthStr].fuel += log.cost;
  });

  maintenanceLogs.forEach((log) => {
    if (log.openedAt) {
      const monthStr = log.openedAt.toLocaleString("default", { month: "short", year: "2-digit" });
      if (last6Months[monthStr]) last6Months[monthStr].maintenance += log.cost;
    }
  });

  expenses.forEach((log) => {
    const monthStr = log.date.toLocaleString("default", { month: "short", year: "2-digit" });
    if (last6Months[monthStr]) last6Months[monthStr].expenses += log.cost;
  });

  const financialTrendData = Object.entries(last6Months).map(([month, data]) => ({
    month,
    ...data
  }));

  // 3. Vehicle Cost Data
  const vehicleCosts: Record<string, number> = {};
  fuelLogs.forEach(log => {
    vehicleCosts[log.vehicle.registrationNumber] = (vehicleCosts[log.vehicle.registrationNumber] || 0) + log.cost;
  });
  maintenanceLogs.forEach(log => {
    vehicleCosts[log.vehicle.registrationNumber] = (vehicleCosts[log.vehicle.registrationNumber] || 0) + log.cost;
  });
  expenses.forEach(log => {
    vehicleCosts[log.vehicle.registrationNumber] = (vehicleCosts[log.vehicle.registrationNumber] || 0) + log.cost;
  });

  const vehicleCostData = Object.entries(vehicleCosts)
    .map(([name, cost]) => ({ name, cost }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 10); // Top 10 most expensive vehicles

  return (
    <div className="w-full text-slate-900 dark:text-slate-200">
      {/* Top Navigation Bar */}
      <div className="mb-8 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search financial reports..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-slate-700/50 dark:bg-[#1e293b] dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>
        <div className="flex items-center gap-5">
          <div className="text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <ThemeToggle />
          </div>
          <NotificationMenu />
          <Link href="/settings" className="text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <Settings className="h-5 w-5" />
          </Link>
          <button className="text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <HelpCircle className="h-5 w-5" />
          </button>
          <DashboardUserMenu />
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Financial Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            In-depth analysis of fleet expenses, cost distributions, and financial trends.
          </p>
        </div>
        <ExportPdfButton title="TransitOps Financial Report" />
      </div>

      {/* Charts Container */}
      <FinancialReportsCharts
        costBreakdownData={costBreakdownData}
        financialTrendData={financialTrendData}
        vehicleCostData={vehicleCostData}
      />
    </div>
  );
}
