import { type ReactNode } from "react";
import { HiArrowTrendingUp, HiCurrencyDollar, HiUsers } from "react-icons/hi2";
import type { Stats } from "../types";

type CardConfig = {
  title: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: ReactNode;
  accentClass: string;
  bgClass: string;
};

const StatsCards = ({ stats }: { stats: Stats }) => {
  const cards: CardConfig[] = [
    {
      title: "Total Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      delta: "+12.4%",
      deltaPositive: true,
      icon: <HiCurrencyDollar className="w-4 h-4" />,
      accentClass: "text-indigo-500 dark:text-indigo-400",
      bgClass: "bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      title: "Active Users",
      value: stats.users.toLocaleString(),
      delta: "+8.1%",
      deltaPositive: true,
      icon: <HiUsers className="w-4 h-4" />,
      accentClass: "text-sky-500 dark:text-sky-400",
      bgClass: "bg-sky-50 dark:bg-sky-950/40",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversion}%`,
      delta: "-0.3%",
      deltaPositive: false,
      icon: <HiArrowTrendingUp className="w-4 h-4" />,
      accentClass: "text-emerald-500 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};

const StatCard = ({
  title,
  value,
  delta,
  deltaPositive,
  icon,
  accentClass,
  bgClass,
}: CardConfig) => (
  <div
    className="animate-fade-up rounded-xl p-5 border group hover:shadow-sm transition-shadow duration-200"
    style={{
      background: "var(--surface-1)",
      borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
    }}
  >
    <div className="flex items-start justify-between mb-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {title}
      </p>
      <div
        className={`w-8 h-8 rounded-lg ${bgClass} ${accentClass} flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
    </div>

    <div className="flex items-end justify-between">
      <h2
        className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </h2>
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          deltaPositive
            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
            : "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30"
        }`}
      >
        {delta}
      </span>
    </div>

    <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-600">
      vs. last month
    </p>
  </div>
);

export default StatsCards;
