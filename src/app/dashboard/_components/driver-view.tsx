import Link from 'next/link'
import { LayoutGrid, Users, Map, BarChart3 } from "lucide-react";

export const DRIVER_LINKS = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Driver Registry", icon: Users },
  { label: "Trip Management", icon: Map },
  { label: "Reports", icon: BarChart3 },
];

export function DriverView() {
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
