import type { Metadata } from "next";
import { FleetManagerView, FLEET_MANAGER_LINKS } from "./_components/fleet-manager-view";
import { SafetyOfficerView, SAFETY_OFFICER_LINKS } from "./_components/safety-officer-view";
import { FinancialAnalystView, FINANCIAL_ANALYST_LINKS } from "./_components/financial-analyst-view";
import { DriverView, DRIVER_LINKS } from "./_components/driver-view";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard · TransitOps" };
export const dynamic = "force-dynamic";

type Search = {
  role?: string;
  tab?: string;
  type?: string;
  status?: string;
  region?: string;
};

const navLinks: Record<string, { label: string; icon: React.ElementType }[]> = {
  FLEET_MANAGER: FLEET_MANAGER_LINKS,
  DRIVER: DRIVER_LINKS,
  SAFETY_OFFICER: SAFETY_OFFICER_LINKS,
  FINANCIAL_ANALYST: FINANCIAL_ANALYST_LINKS,
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const role = sp.role || "FLEET_MANAGER";
  const activeTab = sp.tab || "dashboard";

  const formatRoleName = (r: string) => r.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  const formatInitials = (r: string) => r.split('_').map(w => w[0]).join('');

  const currentLinks = navLinks[role] || navLinks.FLEET_MANAGER;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0f172a] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col justify-between border-r border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#162032] shrink-0">
        <div>
          {/* Logo */}
          <div className="px-6 pt-8 pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Transit<span className="text-[#f58f29]">Ops</span>
            </h1>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
              Fleet Control Center
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 space-y-1">
            {currentLinks.map((link, idx) => {
              const Icon = link.icon;
              const tabId = link.label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
              const isActive = tabId === activeTab;
              
              if (isActive) {
                return (
                  <Link key={idx} href={`/dashboard?role=${role}&tab=${tabId}`} className="flex items-center gap-3 rounded-lg bg-slate-100 dark:bg-slate-700/40 px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white transition-colors">
                    <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    {link.label}
                  </Link>
                );
              }

              return (
                <Link key={idx} href={`/dashboard?role=${role}&tab=${tabId}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white">
                  <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Session Info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f58f29] font-bold text-orange-950">
              {formatInitials(role)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{formatRoleName(role)}</p>
              <p className="text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                Active Session
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0f172a] px-8 py-8">
        {/* Render view based on role */}
        {role === "FLEET_MANAGER" && (
          <FleetManagerView searchParams={searchParams} />
        )}
        {role === "SAFETY_OFFICER" && <SafetyOfficerView />}
        {role === "FINANCIAL_ANALYST" && (
          <FinancialAnalystView searchParams={searchParams} />
        )}
        {role === "DRIVER" && <DriverView />}
      </main>
    </div>
  );
}
