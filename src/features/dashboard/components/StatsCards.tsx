import { type ReactNode } from "react";
import { HiArrowTrendingUp, HiCurrencyDollar, HiUsers } from "react-icons/hi2";
import type { ChartData, Stats } from "../types";

type CardConfig = {
  title: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: ReactNode;
  accentClass: string;
  bgClass: string;
  sparkColor: string;
  sparkData: number[];
};

/*
  Sparkline: purely decorative mini-chart used alongside the stat value.
  aria-hidden="true" on the SVG removes it from the accessibility tree —
  the card's text provides all the meaningful information.
*/
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 28;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const area = `${padding},${height - padding} ${polyline} ${width - padding},${height - padding}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className="shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`sg-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${color.replace("#", "")})`} />
      <polyline
        points={polyline}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.8"
      />
      {(() => {
        const last = points[points.length - 1].split(",");
        return (
          <circle
            cx={last[0]}
            cy={last[1]}
            r="2.5"
            fill={color}
            opacity="0.9"
          />
        );
      })()}
    </svg>
  );
};

type Props = {
  stats: Stats;
  chartData?: ChartData[];
};

const buildSparkData = (
  chartData: ChartData[],
  extract: (d: ChartData) => number,
  fallbackValue: number,
): number[] => {
  if (chartData.length > 0) {
    const values = chartData.map(extract).filter(Number.isFinite);
    if (values.length >= 2) return values;
  }
  return [fallbackValue, fallbackValue];
};

const StatsCards = ({ stats, chartData = [] }: Props) => {
  const safeChart = Array.isArray(chartData) ? chartData : [];

  const revenueHistory = buildSparkData(
    safeChart,
    (d) => d.revenue,
    stats.revenue,
  );
  const usersHistory =
    safeChart.length >= 2
      ? [890, 920, 980, 1050, 1100, 1180, stats.users]
      : [stats.users, stats.users];
  const convHistory =
    safeChart.length >= 2
      ? [3.8, 3.5, 3.6, 3.2, 3.4, 3.1, stats.conversion]
      : [stats.conversion, stats.conversion];

  const cards: CardConfig[] = [
    {
      title: "Total Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      delta: "+12.4%",
      deltaPositive: true,
      icon: <HiCurrencyDollar aria-hidden="true" className="w-4 h-4" />,
      accentClass: "text-indigo-500 dark:text-indigo-400",
      bgClass: "bg-indigo-50 dark:bg-indigo-950/40",
      sparkColor: "#6366f1",
      sparkData: revenueHistory,
    },
    {
      title: "Active Users",
      value: stats.users.toLocaleString(),
      delta: "+8.1%",
      deltaPositive: true,
      icon: <HiUsers aria-hidden="true" className="w-4 h-4" />,
      accentClass: "text-sky-500 dark:text-sky-400",
      bgClass: "bg-sky-50 dark:bg-sky-950/40",
      sparkColor: "#0ea5e9",
      sparkData: usersHistory,
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversion}%`,
      delta: "-0.3%",
      deltaPositive: false,
      icon: <HiArrowTrendingUp aria-hidden="true" className="w-4 h-4" />,
      accentClass: "text-emerald-500 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
      sparkColor: "#10b981",
      sparkData: convHistory,
    },
  ];

  return (
    /*
      The list of stat cards.
      Each card is an <article> — a self-contained piece of content that
      makes sense independently (user could share/bookmark a single metric).
    */
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
  sparkColor,
  sparkData,
}: CardConfig) => (
  /*
    <article> is appropriate for a self-contained metric card.
    aria-label gives AT the full card name so navigation makes sense:
    "Total Revenue, article" before reading the internal content.
  */
  <article
    aria-label={title}
    className="animate-fade-up rounded-xl p-5 border group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    style={{
      background: "var(--surface-1)",
      borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
    }}
  >
    <div className="flex items-start justify-between mb-3">
      {/*
        <h3> uses the correct heading level within the card.
        The dashboard page has h1 (Dashboard) → h2 (section headings) → h3 (cards).
        This maintains a logical heading hierarchy without skipping levels.
      */}
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {title}
      </h3>
      <div
        aria-hidden="true"
        className={`w-8 h-8 rounded-lg ${bgClass} ${accentClass} flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
    </div>

    <div className="flex items-end justify-between">
      <div>
        {/*
          The metric value. aria-label gives AT the full reading:
          "$12,400" is read as "12,400 dollars" which is fine, but
          adding context avoids ambiguity when the value is % or a count.
        */}
        <p
          className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {value}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              deltaPositive
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                : "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30"
            }`}
            /*
              aria-label converts the delta into a readable sentence.
              "+12.4%" alone is ambiguous; "increased 12.4% vs last month" is clear.
            */
            aria-label={`${deltaPositive ? "Increased" : "Decreased"} ${delta.replace(/^[+-]/, "")} vs last month`}
          >
            {delta}
          </span>
          <p
            className="text-xs text-gray-400 dark:text-gray-600"
            aria-hidden="true"
          >
            vs last month
          </p>
        </div>
      </div>
      {/* Sparkline is decorative — aria-hidden on the SVG inside handles this */}
      <Sparkline data={sparkData} color={sparkColor} />
    </div>
  </article>
);

export default StatsCards;
