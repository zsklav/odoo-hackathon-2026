import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  VehicleStatus,
  TripStatus,
  DriverStatus,
} from "@/generated/prisma/client";
import { FilterBar } from "./filter-bar";
import { VehiclePill } from "./vehicle-pill";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardUserMenu } from "./dashboard-user-menu";
import { MaintenanceView } from "./maintenance-view";
import { VehicleRegistryView } from "./vehicle-registry-view";
import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  Download,
  Plus,
  Car,
  PenTool,
  Calendar,
  TrendingUp,
  LayoutGrid,
  Truck,
  Wrench,
  BarChart3,
} from "lucide-react";

export const FLEET_MANAGER_LINKS = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Vehicle Registry", icon: Truck },
  { label: "Maintenance", icon: Wrench },
  { label: "Reports", icon: BarChart3 },
];

const VALID_STATUS = new Set<string>(Object.values(VehicleStatus));

type SearchType = { tab?: string; type?: string; status?: string; region?: string };

export async function FleetManagerView({
  searchParams,
}: {
  searchParams: Promise<SearchType>;
}) {
  const sp = await searchParams;
  const tab = sp.tab || "dashboard";

  if (tab === "maintenance") {
    return <MaintenanceView />;
  }
  
  if (tab === "vehicle-registry") {
    return <VehicleRegistryView />;
  }

  if (tab !== "dashboard") {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
        <div className="text-center">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white capitalize">{tab.replace('-', ' ')}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">This module is under construction.</p>
        </div>
      </div>
    );
  }

  const vehicleWhere = {
    ...(sp.type ? { type: sp.type } : {}),
    ...(sp.status && VALID_STATUS.has(sp.status)
      ? { status: sp.status as VehicleStatus }
      : {}),
    ...(sp.region ? { region: sp.region } : {}),
  };

  let data: {
    total: number;
    active: number;
    available: number;
    inShop: number;
    retired: number;
    activeTrips: number;
    pendingTrips: number;
    driversOnDuty: number;
    totalDrivers: number;
    types: string[];
    regions: string[];
    vehicles: Awaited<ReturnType<typeof prisma.vehicle.findMany>>;
  } | null = null;
  let loadError: string | null = null;

  try {
    const [
      total,
      active,
      available,
      inShop,
      retired,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      totalDrivers,
      typeRows,
      regionRows,
      vehicles,
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: VehicleStatus.ON_TRIP } }),
      prisma.vehicle.count({ where: { status: VehicleStatus.AVAILABLE } }),
      prisma.vehicle.count({ where: { status: VehicleStatus.IN_SHOP } }),
      prisma.vehicle.count({ where: { status: VehicleStatus.RETIRED } }),
      prisma.trip.count({ where: { status: TripStatus.DISPATCHED } }),
      prisma.trip.count({ where: { status: TripStatus.DRAFT } }),
      prisma.driver.count({
        where: {
          status: { in: [DriverStatus.AVAILABLE, DriverStatus.ON_TRIP] },
        },
      }),
      prisma.driver.count(),
      prisma.vehicle.findMany({
        distinct: ["type"],
        select: { type: true },
        orderBy: { type: "asc" },
      }),
      prisma.vehicle.findMany({
        distinct: ["region"],
        select: { region: true },
        orderBy: { region: "asc" },
      }),
      prisma.vehicle.findMany({
        where: vehicleWhere,
        orderBy: { registrationNumber: "asc" },
      }),
    ]);

    data = {
      total,
      active,
      available,
      inShop,
      retired,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      totalDrivers,
      types: typeRows.map((r) => r.type),
      regions: regionRows.map((r) => r.region),
      vehicles,
    };
  } catch (e) {
    console.error(e);
    loadError = "Could not load fleet manager data.";
  }

  const operational = data ? data.total - data.retired : 0;
  const utilization =
    data && operational > 0 ? Math.round((data.active / operational) * 100) : 0;

  return (
    <div className="w-full text-slate-900 dark:text-slate-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search vehicles, drivers or trips..."
            className="w-full rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-slate-800/40 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div className="flex items-center gap-5">
          <div className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <ThemeToggle />
          </div>
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </button>
          <DashboardUserMenu />
        </div>
      </div>

      {loadError ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500 dark:text-red-400">
          {loadError}
        </div>
      ) : data ? (
        <>
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total Fleet Size */}
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#162032] p-5 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                  Total Fleet Size
                </h3>
                <Car className="h-5 w-5 text-orange-500 dark:text-orange-400/80" />
              </div>
              <p className="text-[2rem] font-bold leading-tight text-slate-900 dark:text-white">
                {data.total - data.retired}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Non-retired vehicles
              </p>
            </div>

            {/* In Maintenance */}
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#162032] p-5 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                  In Maintenance
                </h3>
                <PenTool className="h-5 w-5 text-pink-500 dark:text-pink-400/80" />
              </div>
              <p className="text-[2rem] font-bold leading-tight text-slate-900 dark:text-white">
                {String(data.inShop).padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs text-slate-500">Scheduled repairs</p>
            </div>

            {/* Available */}
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#162032] p-5 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                  Available
                </h3>
                <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </div>
              <p className="text-[2rem] font-bold leading-tight text-slate-900 dark:text-white">
                {data.available}
              </p>
              <p className="mt-1 text-xs text-slate-500">Ready for dispatch</p>
            </div>

            {/* Fleet Utilization */}
            <div className="rounded-xl bg-[#f58f29] p-5 shadow-lg shadow-orange-500/10 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold tracking-wider text-orange-950 uppercase">
                  Fleet Utilization
                </h3>
                <TrendingUp className="h-5 w-5 text-orange-950" />
              </div>
              <p className="text-[2rem] font-bold leading-tight text-orange-950">
                {utilization}%
              </p>
              <p className="mt-1 text-xs font-medium text-orange-950/70">
                On Trip / Non-Retired
              </p>
              <div className="mt-4 h-1.5 w-full rounded-full bg-orange-950/20">
                <div
                  className="h-full rounded-full bg-orange-950 transition-all"
                  style={{ width: `${utilization}%` }}
                />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#162032] overflow-hidden shadow-sm transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#162032] transition-colors">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Active Deployments
              </h2>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-md bg-slate-100 dark:bg-slate-700/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white">
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
                <button className="flex items-center gap-2 rounded-md bg-orange-100 dark:bg-[#ffcba4] px-4 py-2 text-sm font-bold text-orange-600 dark:text-orange-950 transition-colors hover:bg-orange-200 dark:hover:bg-[#ffb480]">
                  New Dispatch
                </button>
              </div>
            </div>

            {data.vehicles.length === 0 ? (
              <div className="py-14 text-center text-sm text-slate-500">
                No vehicles match these filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-[#1a2639] text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase transition-colors">
                    <tr>
                      <th className="px-6 py-4">Vehicle ID</th>
                      <th className="px-6 py-4">Driver</th>
                      <th className="px-6 py-4">Current Route</th>
                      <th className="px-6 py-4">ETA</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Load</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                    {data.vehicles.map((v) => {
                      // Generate a deterministic fake load percentage based on vehicle ID for visual fidelity to the mockup
                      const loadPct =
                        ((v.id.charCodeAt(v.id.length - 1) % 6) + 3) * 10;

                      return (
                        <tr
                          key={v.id}
                          className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
                        >
                          <td className="px-6 py-4 font-bold text-orange-600 dark:text-[#f58f29]">
                            {v.registrationNumber}
                          </td>
                          <td className="px-6 py-4 text-slate-900 dark:text-slate-200 font-medium">
                            {v.name}
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                            {v.region}
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                            {/* Faking ETA for mockup parity using Type */}
                            14:30{" "}
                            <span className="text-[10px] text-green-600 dark:text-green-400/80 ml-1 uppercase">
                              On Time
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <VehiclePill status={v.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-1.5 w-16 rounded-full bg-slate-200 dark:bg-slate-700">
                              <div
                                className="h-full rounded-full bg-orange-400 dark:bg-[#ffcba4] transition-all group-hover:bg-orange-500 dark:group-hover:bg-[#f58f29]"
                                style={{ width: `${loadPct}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
