import { Search, Bell, Settings, HelpCircle, Plus, Filter, ArrowUp, Wrench } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardUserMenu } from "./dashboard-user-menu";
import { NotificationMenu } from "./notification-menu";
import { prisma } from "@/lib/prisma";

export async function MaintenanceView() {
  // Fetch data
  const maintenanceLogs = await prisma.maintenanceLog.findMany({
    include: {
      vehicle: true,
    },
    orderBy: {
      openedAt: "desc",
    },
  });

  const vehiclesInShopCount = await prisma.vehicle.count({
    where: { status: "IN_SHOP" },
  });

  // MTD Cost calculation
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  const mtdCost = maintenanceLogs
    .filter((log) => new Date(log.openedAt) >= firstDayOfMonth)
    .reduce((acc, log) => acc + log.cost, 0);

  // Critical Issues = open maintenance logs
  const criticalIssuesCount = maintenanceLogs.filter((log) => log.status === "OPEN").length;

  return (
    <div className="w-full text-slate-900 dark:text-slate-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search vehicles, tickets, parts..."
            className="w-full rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#1e293b] py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div className="flex items-center gap-5">
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

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Maintenance Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track vehicle repairs, schedule services, and monitor fleet health.</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-[#f58f29] px-4 py-2 text-sm font-bold text-orange-950 transition-colors hover:bg-[#e07f20]">
          <Plus className="h-4 w-4" />
          Log Maintenance
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4 mb-8">
        {/* Vehicles In Shop */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#1e293b] p-5 shadow-sm transition-colors">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
            Vehicles In Shop
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-medium text-slate-900 dark:text-slate-200">
              {vehiclesInShopCount.toString().padStart(2, "0")}
            </span>
            <span className="text-xs font-medium text-pink-500 dark:text-pink-400/90 flex items-center">
              Active Repairs
            </span>
          </div>
        </div>

        {/* Avg Repair Time */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#1e293b] p-5 shadow-sm transition-colors">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
            Avg Repair Time
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-medium text-slate-900 dark:text-slate-200">
              48h
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Stable
            </span>
          </div>
        </div>

        {/* Critical Issues */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#1e293b] p-5 shadow-sm transition-colors">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
            Open Issues
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-medium text-pink-600 dark:text-pink-500/90">
              {criticalIssuesCount.toString().padStart(2, "0")}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Require attention
            </span>
          </div>
        </div>

        {/* MTD Cost */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#1e293b] p-5 shadow-sm transition-colors">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
            MTD Cost
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-medium text-slate-900 dark:text-slate-200">
              ${(mtdCost / 1000).toFixed(1)}k
            </span>
            <span className="text-xs font-medium text-orange-500 dark:text-[#f58f29]">
              Budgeted
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#1e293b] overflow-hidden shadow-sm transition-colors">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700/50 transition-colors">
          <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Active Maintenance Log
          </h2>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-200 dark:border-slate-700/50 text-xs font-bold text-slate-500 dark:text-slate-400 transition-colors">
              <tr>
                <th className="px-6 py-4">Ticket<br/>ID</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Repair Description</th>
                <th className="px-6 py-4">Date In</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Cost</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {maintenanceLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No maintenance logs found.
                  </td>
                </tr>
              ) : (
                maintenanceLogs.map((log) => {
                  const isCritical = log.status === "OPEN" && log.cost > 1000; // Just some condition for "Critical" badge
                  
                  return (
                    <tr key={log.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                        MT-<br/>{log.id.slice(0, 4).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-200">
                        {log.vehicle.registrationNumber}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                        {log.description}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                        {log.openedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })},<br/>
                        {log.openedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
                      </td>
                      <td className="px-6 py-4">
                        {log.status === "OPEN" ? (
                          isCritical ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 dark:bg-pink-950/30 px-2.5 py-1 text-[10px] font-medium text-pink-600 dark:text-[#ff8a8a] border border-pink-200 dark:border-pink-900/50">
                              <span className="h-1.5 w-1.5 rounded-full bg-pink-600 dark:bg-[#ff8a8a]"></span>
                              Critical
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                              In Shop
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            Resolved
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">
                        ${log.cost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-orange-500 transition-colors">
                          <Wrench className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
