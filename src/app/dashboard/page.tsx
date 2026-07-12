import type { Metadata } from "next";
import { FleetManagerView } from "./_components/fleet-manager-view";
import { SafetyOfficerView } from "./_components/safety-officer-view";
import { FinancialAnalystView } from "./_components/financial-analyst-view";
import { DriverView } from "./_components/driver-view";

export const metadata: Metadata = { title: "Dashboard · TransitOps" };
export const dynamic = "force-dynamic";

type Search = {
  role?: string;
  type?: string;
  status?: string;
  region?: string;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  // TODO
  // user shouldn't be able to change the url
  // there will only be 4 dashboard... /dashboard shouldn't be accessible.

  const role = sp.role || "FLEET_MANAGER";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-6 py-10 sm:px-8">
        {/* Render view based on role */}
        {role === "FLEET_MANAGER" && (
          <FleetManagerView searchParams={searchParams} />
        )}
        {role === "SAFETY_OFFICER" && <SafetyOfficerView />}
        {role === "FINANCIAL_ANALYST" && <FinancialAnalystView />}
        {role === "DRIVER" && <DriverView />}
      </div>
    </div>
  );
}
