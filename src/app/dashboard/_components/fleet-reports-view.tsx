import { Search, Bell, Settings, HelpCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardUserMenu } from "./dashboard-user-menu";
import { prisma } from "@/lib/prisma";
import { ReportsCharts } from "./fleet-reports-charts";
import { ExportPdfButton } from "./export-pdf-button";

export async function ReportsView() {
  // 1. Fleet Status Distribution
  const vehicles = await prisma.vehicle.findMany({ select: { status: true } });
  const statusCounts = vehicles.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const fleetStatusData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.replace("_", " "),
    value,
  }));

  // 2. Maintenance Cost by Month (Last 6 Months)
  const maintenanceLogs = await prisma.maintenanceLog.findMany({
    select: { openedAt: true, cost: true },
  });

  const last6Months: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthStr = d.toLocaleString("default", { month: "short", year: "2-digit" });
    last6Months[monthStr] = 0;
  }

  maintenanceLogs.forEach((log) => {
    if (log.openedAt) {
      const monthStr = log.openedAt.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (last6Months[monthStr] !== undefined) {
        last6Months[monthStr] += log.cost;
      }
    }
  });
  
  const maintenanceCostData = Object.entries(last6Months).map(([month, cost]) => ({
    month,
    cost,
  }));

  // 3. Driver Safety Scores
  const drivers = await prisma.driver.findMany({
    select: { name: true, safetyScore: true },
    orderBy: { safetyScore: "desc" },
    take: 10,
  });
  
  const safetyScoreData = drivers.map((d) => ({
    name: d.name.split(" ")[0], // Use first name for chart brevity
    score: d.safetyScore,
  }));

  return (
    <div className="w-full text-slate-900 dark:text-slate-200">
      {/* Top Navigation Bar */}
      <div className="mb-8 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-slate-700/50 dark:bg-[#1e293b] dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>
        <div className="flex items-center gap-5">
          <div className="text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <ThemeToggle />
          </div>
          <button className="text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <Bell className="h-5 w-5" />
          </button>
          <button className="text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <Settings className="h-5 w-5" />
          </button>
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
            Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Visual insights into fleet performance, maintenance, and driver safety.
          </p>
        </div>
        <ExportPdfButton title="TransitOps Fleet Report" />
      </div>

      {/* Charts Container */}
      <ReportsCharts
        fleetStatusData={fleetStatusData}
        maintenanceCostData={maintenanceCostData}
        safetyScoreData={safetyScoreData}
      />
    </div>
  );
}
