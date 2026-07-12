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
  fleetStatusData: { name: string; value: number }[];
  maintenanceCostData: { month: string; cost: number }[];
  safetyScoreData: { name: string; score: number }[];
};

export function ReportsCharts({
  fleetStatusData,
  maintenanceCostData,
  safetyScoreData,
}: Props) {
  const COLORS = ["#10b981", "#f58f29", "#ef4444", "#64748b"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 shadow-lg">
          <p className="mb-1 font-semibold text-white">{label || payload[0].name}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-sm font-medium" style={{ color: p.color || p.fill }}>
              {p.name === "cost" ? `₹${p.value.toFixed(2)}` : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Fleet Status Pie Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-700/50 dark:bg-[#1e293b]">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          Fleet Status Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fleetStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {fleetStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => <span className="text-slate-600 dark:text-slate-300">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Maintenance Cost Bar Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-700/50 dark:bg-[#1e293b]">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          Maintenance Cost Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={maintenanceCostData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" fill="#f58f29" radius={[4, 4, 0, 0]} name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Safety Score Line Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-700/50 dark:bg-[#1e293b] lg:col-span-2">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          Top Drivers Safety Scores
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safetyScoreData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                name="Safety Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
