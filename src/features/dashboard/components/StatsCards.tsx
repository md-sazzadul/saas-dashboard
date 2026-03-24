import type { Stats } from "../types";

const StatsCards = ({ stats }: { stats: Stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Revenue" value={`$${stats.revenue}`} />
      <Card title="Users" value={stats.users} />
      <Card title="Conversion" value={`${stats.conversion}%`} />
    </div>
  );
};

const Card = ({ title, value }: any) => (
  <div className="bg-white p-5 rounded-xl border">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-semibold mt-2">{value}</h2>
  </div>
);

export default StatsCards;
