import { Search, Bell, Settings, HelpCircle, Plus, Filter, ArrowUp } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export async function MaintenanceView() {
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
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </button>
          <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ring-2 ring-slate-100 dark:ring-slate-800">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
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
              05
            </span>
            <span className="text-xs font-medium text-pink-500 dark:text-pink-400/90 flex items-center">
              <ArrowUp className="h-3 w-3 mr-0.5" /> 2 from yesterday
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
            Critical Issues
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-medium text-pink-600 dark:text-pink-500/90">
              02
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Immediate action req.
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
              $12.4k
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
              {/* Row 1 */}
              <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                  MT-<br/>1042
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-200">
                  TRK-14
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs overflow-hidden">
                  Transmission slip in 3rd gear, fluid leak...<br/>
                  <span className="text-xs text-slate-400 dark:text-slate-500">detected near pan.</span>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                  Oct 24,<br/>08:00
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                    In Shop
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">
                  $450.00
                </td>
                <td className="px-6 py-4 text-right">
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                  MT-<br/>1045
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-200">
                  VAN-02
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs overflow-hidden">
                  Routine 50k mile service. Replace brake pa...<br/>
                  <span className="text-xs text-slate-400 dark:text-slate-500">oil change, tire rotation.</span>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                  Oct 25,<br/>14:30
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                    In Shop
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">
                  $185.50
                </td>
                <td className="px-6 py-4 text-right">
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                  MT-<br/>1048
                </td>
                <td className="px-6 py-4 font-bold text-pink-600 dark:text-[#ff8a8a]">
                  MINI-09
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs overflow-hidden">
                  Check engine light on. OBD reporting misfir...<br/>
                  <span className="text-xs text-slate-400 dark:text-slate-500">cylinder 2. Urgent.</span>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                  Oct 26,<br/>09:15
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 dark:bg-pink-950/30 px-2.5 py-1 text-[10px] font-medium text-pink-600 dark:text-[#ff8a8a] border border-pink-200 dark:border-pink-900/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-pink-600 dark:bg-[#ff8a8a]"></span>
                    Critical
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">
                  Pending
                </td>
                <td className="px-6 py-4 text-right">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
