import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartData } from "../types";

const ChartSection = ({ data }: { data: ChartData[] }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 mt-6 transition-colors duration-200">
      <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
        Revenue Overview
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--chart-axis-color)" }}
            axisLine={{ stroke: "var(--chart-axis-color)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--chart-axis-color)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--chart-tooltip-bg)",
              border: "1px solid var(--chart-tooltip-border)",
              borderRadius: "8px",
              color: "var(--chart-tooltip-color)",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: "#6366f1", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartSection;
