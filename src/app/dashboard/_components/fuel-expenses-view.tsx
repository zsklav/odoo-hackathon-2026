import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  Receipt,
  Banknote,
  RefreshCcw,
  FileText,
  Zap,
  TrendingUp,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardUserMenu } from "./dashboard-user-menu";

export async function FuelExpensesView() {
  return (
    <div className="w-full text-slate-900 dark:text-slate-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search fuel logs, vehicles, or trips..."
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

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold text-[#f58f29] uppercase tracking-wider mb-1">
            Operational Overview
          </p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Fuel & Expenses
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-white transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
            <Receipt className="h-4 w-4" />+ Log Fuel
          </button>
          <button className="flex items-center gap-2 rounded-md bg-[#f58f29] px-4 py-2.5 text-sm font-semibold text-orange-950 transition-colors hover:bg-[#e07f20] shadow-sm shadow-orange-500/20">
            <Banknote className="h-4 w-4" />+ Add Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        {/* Fuel Logs Table */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#162032] overflow-hidden shadow-sm flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
              <span className="text-[#f58f29]">
                <Settings className="h-4 w-4" />
              </span>
              Fuel Logs
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Recent Entries
            </span>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b border-slate-200 dark:border-slate-700/50 text-xs font-bold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">Vehicle</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Liters</th>
                  <th className="px-5 py-4 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 text-slate-700 dark:text-slate-300">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-[#f58f29]">
                    VAN-05
                  </td>
                  <td className="px-5 py-4 text-xs font-medium">05 Jul 2026</td>
                  <td className="px-5 py-4 text-xs">42 L</td>
                  <td className="px-5 py-4 font-bold text-right">3,150</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-[#f58f29]">
                    TRK-22
                  </td>
                  <td className="px-5 py-4 text-xs font-medium">05 Jul 2026</td>
                  <td className="px-5 py-4 text-xs">180 L</td>
                  <td className="px-5 py-4 font-bold text-right">13,500</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-[#f58f29]">
                    VAN-08
                  </td>
                  <td className="px-5 py-4 text-xs font-medium">04 Jul 2026</td>
                  <td className="px-5 py-4 text-xs">38 L</td>
                  <td className="px-5 py-4 font-bold text-right">2,850</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-[#f58f29]">
                    TRK-14
                  </td>
                  <td className="px-5 py-4 text-xs font-medium">04 Jul 2026</td>
                  <td className="px-5 py-4 text-xs">210 L</td>
                  <td className="px-5 py-4 font-bold text-[#f58f29] text-right">
                    15,750
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-[#f58f29]">
                    VAN-05
                  </td>
                  <td className="px-5 py-4 text-xs font-medium">02 Jul 2026</td>
                  <td className="px-5 py-4 text-xs">45 L</td>
                  <td className="px-5 py-4 font-bold text-right">3,375</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Other Expenses Table */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#162032] overflow-hidden shadow-sm flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
              <FileText className="h-4 w-4 text-slate-400" />
              Other Expenses{" "}
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal ml-1">
                (Toll / Misc)
              </span>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider border border-emerald-200 dark:border-emerald-900/50">
                Available
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                Completed
              </span>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b border-slate-200 dark:border-slate-700/50 text-xs font-bold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">Trip</th>
                  <th className="px-5 py-4">Vehicle</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Toll</th>
                  <th className="px-5 py-4 text-right">Other</th>
                  <th className="px-5 py-4 text-right">Maint.</th>
                  <th className="px-5 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 text-slate-700 dark:text-slate-300">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-slate-900 dark:text-slate-200">
                    TR001
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400">
                    VAN-05
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                      Completed
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-xs">120</td>
                  <td className="px-5 py-4 text-right text-xs italic opacity-50">
                    0
                  </td>
                  <td className="px-5 py-4 text-right text-xs italic opacity-50">
                    0
                  </td>
                  <td className="px-5 py-4 font-bold text-right text-slate-900 dark:text-slate-200">
                    120
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-slate-900 dark:text-slate-200">
                    TR014
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400">
                    TRK-22
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider border border-emerald-200 dark:border-emerald-900/50">
                      Available
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-xs">450</td>
                  <td className="px-5 py-4 text-right text-xs">75</td>
                  <td className="px-5 py-4 text-right text-xs">1,200</td>
                  <td className="px-5 py-4 font-bold text-right text-[#f58f29]">
                    1,725
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-slate-900 dark:text-slate-200">
                    TR055
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400">
                    VAN-08
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                      Completed
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-xs">85</td>
                  <td className="px-5 py-4 text-right text-xs italic opacity-50">
                    0
                  </td>
                  <td className="px-5 py-4 text-right text-xs italic opacity-50">
                    0
                  </td>
                  <td className="px-5 py-4 font-bold text-right text-slate-900 dark:text-slate-200">
                    85
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-slate-900 dark:text-slate-200">
                    TR102
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400">
                    TRK-14
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider border border-emerald-200 dark:border-emerald-900/50">
                      Available
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-xs">620</td>
                  <td className="px-5 py-4 text-right text-xs">210</td>
                  <td className="px-5 py-4 text-right text-xs italic opacity-50">
                    0
                  </td>
                  <td className="px-5 py-4 font-bold text-right text-[#f58f29]">
                    830
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-slate-900 dark:text-slate-200">
                    TR119
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400">
                    VAN-05
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider border border-emerald-200 dark:border-emerald-900/50">
                      Available
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-xs">120</td>
                  <td className="px-5 py-4 text-right text-xs italic opacity-50">
                    0
                  </td>
                  <td className="px-5 py-4 text-right text-xs italic opacity-50">
                    0
                  </td>
                  <td className="px-5 py-4 font-bold text-right text-slate-900 dark:text-slate-200">
                    120
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mini KPIs Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#162032] p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Fuel Efficiency
          </p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              14.2{" "}
              <span className="text-xl text-slate-500 dark:text-slate-400">
                km/L
              </span>
            </span>
            <span className="text-xs font-semibold text-emerald-500 flex items-center mb-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +2.4%
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#162032] p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Maintenance Overhead
          </p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              8,450.00
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Stable
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-[#162032] p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Active Dispatches
          </p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              42{" "}
              <span className="text-xl text-slate-500 dark:text-slate-400">
                Units
              </span>
            </span>
            <span className="text-xs font-semibold text-[#f58f29] flex items-center mb-1">
              <Zap className="h-3 w-3 mr-1" /> Peak
            </span>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="rounded-xl bg-slate-900 dark:bg-transparent dark:border dark:border-slate-700/50 p-6 flex flex-col md:flex-row items-center justify-between text-white shadow-lg">
        <div className="mb-4 md:mb-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Auto-Calculated Metric
          </p>
          <h2 className="text-sm font-bold tracking-wide">
            TOTAL OPERATIONAL COST (AUTO) = FUEL + MAINT
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center text-slate-400 italic text-sm">
            Aggregate of all active logs
            <RefreshCcw className="h-4 w-4 ml-2" />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Currency: INR
            </p>
            <span className="text-4xl font-black text-[#f58f29] tracking-tight">
              34,070.00
            </span>
          </div>
          <button className="ml-4 rounded-md border border-[#f58f29] px-6 py-3 text-xs font-bold text-[#f58f29] uppercase tracking-wider transition-colors hover:bg-[#f58f29] hover:text-orange-950">
            Generate
            <br />
            Report
          </button>
        </div>
      </div>
    </div>
  );
}

// Need to import TrendingUp in fuel-expenses-view.tsx if not imported.
