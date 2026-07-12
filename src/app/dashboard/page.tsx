import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FleetManagerView, FLEET_MANAGER_LINKS } from "./_components/fleet-manager-view";
import { SafetyOfficerView, SAFETY_OFFICER_LINKS } from "./_components/safety-officer-view";
import { FinancialAnalystView, FINANCIAL_ANALYST_LINKS } from "./_components/financial-analyst-view";
import { DriverView, DRIVER_LINKS } from "./_components/driver-view";
import Link from "next/link";
import { verifySessionToken } from "@/lib/auth/jwt";

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
  const activeTab = sp.tab || "dashboard";
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = token ? verifySessionToken(token) : null;

  if (!session) {
    redirect("/login");
  }

  const role = session.role;
  if (sp.role !== role) {
    redirect(`/dashboard?role=${encodeURIComponent(role)}&tab=${encodeURIComponent(activeTab)}`);
  }

  const formatRoleName = (r: string) => r.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  const formatInitials = (r: string) => r.split('_').map(w => w[0]).join('');

  const currentLinks = navLinks[role] || navLinks.FLEET_MANAGER;

  return (
    <div className="transit-dashboard relative flex h-screen overflow-hidden bg-[#09090b] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="auth-grid absolute inset-0 opacity-30" />
        <div className="absolute -left-48 top-1/4 size-[520px] rounded-full bg-orange-500/[.07] blur-[140px]" />
        <div className="absolute -right-52 top-0 size-[500px] rounded-full bg-blue-500/[.06] blur-[150px]" />
      </div>
      {/* Sidebar */}
      <aside className="relative z-10 flex w-64 shrink-0 flex-col justify-between border-r border-white/[.08] bg-[#0c0f14]/90 backdrop-blur-xl">
        <div>
          {/* Logo */}
          <div className="border-b border-white/[.06] px-6 pb-6 pt-8">
            <h1 className="text-2xl font-semibold tracking-[-0.05em] text-white">
              Transit<span className="text-[#ff7a00]">Ops</span>
            </h1>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[.16em] text-white/40">
              Fleet Control Center
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 px-4 pt-5">
            {currentLinks.map((link, idx) => {
              const Icon = link.icon;
              const tabId = link.label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
              const isActive = tabId === activeTab;
              
              if (isActive) {
                return (
                  <Link key={idx} href={`/dashboard?role=${role}&tab=${tabId}`} className="flex items-center gap-3 rounded-xl border border-orange-300/10 bg-orange-500/[.1] px-3 py-2.5 text-sm font-medium text-white transition-colors">
                    <Icon className="h-4 w-4 text-orange-400" />
                    {link.label}
                  </Link>
                );
              }

              return (
                <Link key={idx} href={`/dashboard?role=${role}&tab=${tabId}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition-colors hover:bg-white/[.055] hover:text-white">
                  <Icon className="h-4 w-4 text-white/35" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Session Info */}
        <div className="border-t border-white/[.08] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-300/20 bg-orange-500/15 font-bold text-orange-300">
              {formatInitials(role)}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{formatRoleName(role)}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-400/80">
                Active Session
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-6 py-7 lg:px-8 lg:py-8">
        {/* Render view based on role */}
        {role === "FLEET_MANAGER" && (
          <FleetManagerView searchParams={searchParams} />
        )}
        {role === "SAFETY_OFFICER" && <SafetyOfficerView />}
        {role === "FINANCIAL_ANALYST" && (
          <FinancialAnalystView searchParams={searchParams} />
        )}
        {role === "DRIVER" && <DriverView searchParams={searchParams} />}
      </main>
    </div>
  );
}
