import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboard } from "../hooks/useDashboard";
import { useUsers } from "../hooks/useUsers";

const Dashboard = () => {
  const { data, isLoading, error } = useDashboard();
  const { data: users } = useUsers();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border">
          <p className="text-gray-500 text-sm">Revenue</p>
          <h2 className="text-2xl font-semibold mt-2">${data.stats.revenue}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <p className="text-gray-500 text-sm">Users</p>
          <h2 className="text-2xl font-semibold mt-2">{data.stats.users}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <p className="text-gray-500 text-sm">Conversion</p>
          <h2 className="text-2xl font-semibold mt-2">
            {data.stats.conversion}%
          </h2>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl border mt-6">
        <h3 className="font-semibold mb-4">Revenue Overview</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.chart}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#6366f1" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <table className="w-full mt-6 bg-white rounded-xl border">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            <th className="p-4">User</th>
            <th>Status</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: any) => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="p-4">{user.name}</td>
              <td
                className={
                  user.status === "active" ? "text-green-500" : "text-red-500"
                }
              >
                {user.status}
              </td>
              <td>${user.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
