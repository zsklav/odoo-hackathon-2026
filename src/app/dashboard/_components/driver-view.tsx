import Link from 'next/link'
import { LayoutGrid, Users, Map, BarChart3 } from "lucide-react";
import { TripManagementView } from "./trip-management-view";
import { DriverRegistryView } from "./driver-registry-view";

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
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← TransitOps
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
          Driver Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          View your active trips and complete them.
        </p>
      </div>
      
      <div className="rounded-xl border border-dashed border-gray-300 py-14 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Your active trip details coming soon...
      </div>
    </>
  )
}
