import { HiChartBar } from "react-icons/hi2";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartData } from "../types";

const EmptyChart = () => (
  <div className="h-60 flex flex-col items-center justify-center gap-3">
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center"
      style={{ background: "color-mix(in srgb, currentColor 6%, transparent)" }}
    >
      <HiChartBar className="w-5 h-5 text-gray-400 dark:text-gray-600" />
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        No chart data available
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
        Revenue history will appear here
      </p>
    </div>
  </div>
);

const ChartSection = ({ data }: { data: ChartData[] }) => {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div
      className="animate-fade-up rounded-xl border mt-4 overflow-hidden"
      style={{
        background: "var(--surface-1)",
        borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
        animationDelay: "180ms",
      }}
    >
      <div
        className="px-5 pt-5 pb-4 flex items-center justify-between border-b"
        style={{
          borderColor: "color-mix(in srgb, currentColor 6%, transparent)",
        }}
      >
        <div>
          <h3
            className="text-sm font-semibold text-gray-900 dark:text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Revenue Overview
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
            {hasData ? "Monthly performance" : "No data to display"}
          </p>
        </div>
        {hasData && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">
              Revenue
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        {!hasData ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={data}
              margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--chart-axis-color)"
                strokeOpacity={0.2}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{
                  fill: "var(--chart-axis-color)",
                  fontSize: 11,
                  fontFamily: "var(--font-sans)",
                }}
                axisLine={false}
                tickLine={false}
                dy={8}
              />
              <YAxis
                tick={{
                  fill: "var(--chart-axis-color)",
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--chart-tooltip-bg)",
                  border: "1px solid var(--chart-tooltip-border)",
                  borderRadius: "10px",
                  color: "var(--chart-tooltip-color)",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  padding: "8px 12px",
                }}
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  "Revenue",
                ]}
                cursor={{
                  stroke: "#6366f1",
                  strokeOpacity: 0.3,
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#6366f1",
                  strokeWidth: 2,
                  stroke: "var(--chart-tooltip-bg)",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ChartSection;
