import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  Download,
  ListFilter,
  UserPlus,
  Users,
  Car,
  ShieldCheck,
  AlertTriangle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardUserMenu } from "./dashboard-user-menu";
import { NotificationMenu } from "./notification-menu";
import { prisma } from "@/lib/prisma";
import { DriverStatus } from "@/generated/prisma/client";
import Link from "next/link";

function getStatusColor(status: DriverStatus) {
  switch (status) {
    case "AVAILABLE":
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case "ON_TRIP":
      return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
    case "OFF_DUTY":
      return "bg-slate-500/20 text-slate-400 border border-slate-500/30";
    case "SUSPENDED":
      return "bg-red-500/20 text-red-400 border border-red-500/30";
  }
}

function getStatusDot(status: DriverStatus) {
  switch (status) {
    case "AVAILABLE":
      return "bg-emerald-400";
    case "ON_TRIP":
      return "bg-orange-400";
    case "OFF_DUTY":
      return "bg-slate-400";
    case "SUSPENDED":
      return "bg-red-400";
  }
}

function getScoreColor(score: number) {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 70) return "bg-[#f58f29]";
  return "bg-red-500";
}

function getScoreTextClass(score: number) {
  if (score >= 90) return "text-emerald-400";
  if (score >= 70) return "text-[#f58f29]";
  return "text-red-400";
}

export async function DriverDashboardView() {
  const drivers = await prisma.driver.findMany({
    orderBy: { safetyScore: "desc" },
  });

  const totalDrivers = drivers.length;
  const activeNow = drivers.filter((d) => d.status === "AVAILABLE" || d.status === "ON_TRIP").length;
  const safetyAvg = totalDrivers > 0 ? (drivers.reduce((acc, d) => acc + d.safetyScore, 0) / totalDrivers).toFixed(1) : "0";
  
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  const renewalsAlertCount = drivers.filter((d) => new Date(d.licenseExpiryDate) <= thirtyDaysFromNow).length;
  const actionRequiredCount = drivers.filter((d) => d.safetyScore < 70).length;

  return (
    <div className="w-full text-slate-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search drivers by name, license or ID..."
            className="w-full rounded-md border border-slate-700/50 bg-[#1e293b]/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div className="flex items-center gap-5">
          <div className="text-slate-400 hover:text-slate-200 transition-colors">
            <ThemeToggle />
          </div>
          <NotificationMenu />
          <button className="text-slate-400 hover:text-slate-200 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <button className="text-slate-400 hover:text-slate-200 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </button>
          <DashboardUserMenu />
        </div>
      </div>

      {/* Header & Actions */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Driver Management</h1>
          <p className="text-sm text-slate-400 mt-1">Manage certified personnel and monitor safety compliance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md border border-slate-700 bg-transparent px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 rounded-md border border-slate-700 bg-transparent px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
            <ListFilter className="h-4 w-4" />
            Sort by Score
          </button>
          <Link href="/drivers/new" className="flex items-center gap-2 rounded-md bg-[#f58f29] px-4 py-2 text-sm font-semibold text-orange-950 transition-colors hover:bg-[#e07f20]">
            <UserPlus className="h-4 w-4" />
            Register Driver
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 w-full">
        <div className="rounded-lg border border-slate-700/50 bg-[#162032] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Drivers</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">{totalDrivers}</h2>
            </div>
            <div className="rounded-md bg-slate-800 p-2 border border-slate-700/50">
              <Users className="h-4 w-4 text-slate-400" />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div className="h-1.5 w-24 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full w-3/4 bg-[#f58f29] rounded-full"></div>
            </div>
            <span className="text-[9px] font-medium text-slate-500 tracking-wide">Fleet Capacity 75%</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-700/50 bg-[#162032] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Active Now</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">{activeNow}</h2>
            </div>
            <div className="rounded-md bg-emerald-500/10 p-2 border border-emerald-500/20">
              <Car className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-5 flex items-center">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> 12% vs last week
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-700/50 bg-[#162032] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Safety Avg</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">{safetyAvg}</h2>
            </div>
            <div className="rounded-md bg-[#f58f29]/10 p-2 border border-[#f58f29]/20">
              <ShieldCheck className="h-4 w-4 text-[#f58f29]" />
            </div>
          </div>
          <div className="mt-5">
            <span className="text-[10px] font-medium text-slate-500 tracking-wide">Compliance Level: High</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-700/50 bg-[#162032] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Renewals Alert</p>
              <h2 className="text-3xl font-bold text-red-400 tracking-tight">
                {renewalsAlertCount.toString().padStart(2, "0")}
              </h2>
            </div>
            <div className="rounded-md bg-red-500/10 p-2 border border-red-500/20">
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
          </div>
          <div className="mt-5">
            <span className="text-[10px] text-red-400 font-bold tracking-wide">Expires within 30 days</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-lg border border-slate-700/50 bg-[#162032] overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-700/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5">Driver Name</th>
                <th className="px-6 py-5">License Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Safety Score</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Contact</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No drivers registered.
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => {
                  const isExpiring = new Date(driver.licenseExpiryDate) <= thirtyDaysFromNow;
                  const scoreColor = getScoreColor(driver.safetyScore);
                  const scoreText = getScoreTextClass(driver.safetyScore);
                  const statusBg = getStatusColor(driver.status);
                  const statusDot = getStatusDot(driver.status);
                  const formattedStatus = driver.status.replace("_", " ");
                  const displayId = `TO-${driver.id.substring(0, 4).toUpperCase()}`;

                  return (
                    <tr key={driver.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-md bg-slate-800 flex items-center justify-center border border-slate-700">
                            <Users className="h-4 w-4 text-slate-400" />
                          </div>
                          <div>
                            <Link href={`/drivers/${driver.id}`} className="font-bold text-white hover:underline">
                              {driver.name}
                            </Link>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5 font-medium tracking-wide">ID: {displayId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-slate-300 tracking-wide">{driver.licenseNumber}</div>
                        <div className={`flex items-center gap-1 text-[10px] font-bold mt-1 ${isExpiring ? "text-red-400" : "text-slate-500"}`}>
                          {isExpiring && <AlertCircle className="h-3 w-3" />}
                          Exp: {driver.licenseExpiryDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded bg-slate-800 px-2 py-1 text-[9px] font-black text-slate-400 border border-slate-700 uppercase tracking-widest">
                          {driver.licenseCategory}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 w-24">
                          <span className={`text-[10px] font-bold ${scoreText}`}>
                            {driver.safetyScore}%
                          </span>
                          <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div className={`h-full ${scoreColor} rounded-full`} style={{ width: `${driver.safetyScore}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusBg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`}></span>
                          <span className="capitalize tracking-wide">{formattedStatus.toLowerCase()}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-300">
                        {driver.contactNumber}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-500 hover:text-slate-300 transition-colors p-1.5 rounded-md hover:bg-slate-700">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-700/50 bg-[#162032] px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-medium text-white">1 - {totalDrivers}</span> of {totalDrivers} drivers
          </div>
          <div className="flex gap-1">
            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 bg-transparent text-slate-400 hover:bg-slate-800 transition-colors" disabled>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-700 text-white font-medium border border-slate-600">
              1
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 bg-transparent text-slate-400 hover:bg-slate-800 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-2 gap-6">
        <div className="relative overflow-hidden rounded-lg border border-emerald-900/50 bg-[#131d2b] p-6 flex items-center gap-6">
          <div className="absolute right-0 top-0 opacity-[0.03]">
            <TrendingUp className="h-40 w-40 -mt-6 -mr-6 text-emerald-500" />
          </div>
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <span className="text-3xl font-black">92%</span>
            <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Efficiency</span>
          </div>
          <div className="z-10">
            <h3 className="text-lg font-bold text-white mb-1">Operational Health</h3>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Current driver availability meets 100% of demand for scheduled morning departures.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-red-900/30 bg-[#131d2b] p-6 flex items-center justify-between">
          <div className="absolute right-0 top-0 opacity-[0.03]">
            <ShieldCheck className="h-40 w-40 -mt-6 -mr-6 text-red-500" />
          </div>
          <div className="flex items-center gap-6 z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-1">Action Required</h3>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                <span className="text-white font-medium">{actionRequiredCount} drivers</span> have safety scores below threshold (70%). Review required for dispatch clearance.
              </p>
            </div>
          </div>
          <button className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700 shadow-sm">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
