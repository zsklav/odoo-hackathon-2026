import { Search, Bell, Settings, HelpCircle, Download } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardUserMenu } from "./dashboard-user-menu";
import { prisma } from "@/lib/prisma";
import { ReportsCharts } from "./fleet-reports-charts";

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

  // 2. Maintenance Cost by Month
  const maintenanceLogs = await prisma.maintenanceLog.findMany({
    where: { status: "CLOSED" },
    select: { closedAt: true, cost: true },
    orderBy: { closedAt: "asc" },
  });

  const costByMonth: Record<string, number> = {};
  maintenanceLogs.forEach((log) => {
    if (log.closedAt) {
      const month = log.closedAt.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      costByMonth[month] = (costByMonth[month] || 0) + log.cost;
    }
  });
  
  // Convert to array and ensure we only take the last 6 months if there are many
  const maintenanceCostData = Object.entries(costByMonth)
    .map(([month, cost]) => ({ month, cost }))
    .slice(-6);

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
        <button className="flex items-center gap-2 rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white">
          <Download className="h-4 w-4" />
          Export PDF
        </button>
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
