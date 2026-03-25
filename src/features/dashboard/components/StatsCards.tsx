import type { ReactNode } from "react";
import { HiArrowTrendingUp, HiCurrencyDollar, HiUsers } from "react-icons/hi2";
import type { Stats } from "../types";

const StatsCards = ({ stats }: { stats: Stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card
        title="Revenue"
        value={`$${stats.revenue.toLocaleString()}`}
        icon={<HiCurrencyDollar className="w-5 h-5 text-indigo-500" />}
      />
      <Card
        title="Users"
        value={stats.users.toLocaleString()}
        icon={<HiUsers className="w-5 h-5 text-blue-500" />}
      />
      <Card
        title="Conversion"
        value={`${stats.conversion}%`}
        icon={<HiArrowTrendingUp className="w-5 h-5 text-emerald-500" />}
      />
    </div>
  );
};

const Card = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
}) => (
  <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors duration-200">
    <div className="flex items-center justify-between mb-3">
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        {title}
      </p>
      <span>{icon}</span>
    </div>
    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
      {value}
    </h2>
  </div>
);

export default StatsCards;
