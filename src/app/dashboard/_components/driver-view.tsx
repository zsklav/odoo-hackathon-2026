import Link from 'next/link'
import { LayoutGrid, Users, Map, BarChart3 } from "lucide-react";
import { TripManagementView } from "./trip-management-view";
import { DriverRegistryView } from "./driver-registry-view";
import { DriverDashboardView } from "./driver-dashboard-view";
import { ReportsView } from "./fleet-reports-view";

export const DRIVER_LINKS = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Driver Registry", icon: Users },
  { label: "Trip Management", icon: Map },
  { label: "Reports", icon: BarChart3 },
];

type SearchType = { tab?: string };

export async function DriverView({
  searchParams,
}: {
  searchParams?: Promise<SearchType>;
}) {
  const sp = searchParams ? await searchParams : {};
  const tab = sp.tab || "dashboard";

  if (tab === "driver-registry") {
    return <DriverRegistryView />;
  }

  if (tab === "trip-management") {
    return <TripManagementView />;
  }

  if (tab === "dashboard") {
    return <DriverDashboardView />;
  }

  if (tab === "reports") {
    return <ReportsView />;
  }

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
