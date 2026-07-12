"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

type Props = {
  costBreakdownData: { name: string; value: number }[];
  financialTrendData: { month: string; fuel: number; maintenance: number; expenses: number }[];
  vehicleCostData: { name: string; cost: number }[];
};

export function FinancialReportsCharts({
  costBreakdownData,
  financialTrendData,
  vehicleCostData,
}: Props) {
  const COLORS = ["#10b981", "#f58f29", "#ef4444", "#8b5cf6"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 shadow-lg">
          <p className="mb-2 font-semibold text-white">{label || payload[0].name}</p>
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-4 text-sm font-medium" style={{ color: p.color || p.fill }}>
              <span className="capitalize">{p.name}</span>
              <span>₹{Number(p.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Cost Breakdown Pie Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-700/50 dark:bg-[#1e293b]">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          Total Cost Breakdown
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={costBreakdownData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {costBreakdownData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => <span className="text-slate-600 dark:text-slate-300 capitalize">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vehicle Cost Bar Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-700/50 dark:bg-[#1e293b]">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          Highest Cost Vehicles
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vehicleCostData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" fill="#ef4444" radius={[4, 4, 0, 0]} name="Total Cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Trend Area/Line Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-700/50 dark:bg-[#1e293b] lg:col-span-2">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          6-Month Financial Trend
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={financialTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="fuel"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                name="Fuel Cost"
              />
              <Line
                type="monotone"
                dataKey="maintenance"
                stroke="#f58f29"
                strokeWidth={3}
                dot={{ r: 4, fill: "#f58f29", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#f58f29", stroke: "#fff", strokeWidth: 2 }}
                name="Maintenance"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                name="Other Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
