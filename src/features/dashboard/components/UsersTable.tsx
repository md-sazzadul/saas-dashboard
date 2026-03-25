import type { User } from "../types";

const UsersTable = ({ users }: { users: User[] }) => {
  if (!users.length)
    return (
      <p className="text-gray-500 dark:text-gray-400 mt-6">No users found</p>
    );

  return (
    <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <table className="w-full bg-white dark:bg-gray-900 transition-colors duration-200">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">
              User
            </th>
            <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">
              Status
            </th>
            <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">
              Revenue
            </th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: User) => (
            <tr
              key={user.id}
              className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                {user.name}
              </td>
              <td className="p-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.status === "active"
                        ? "bg-green-500 dark:bg-green-400"
                        : "bg-red-500 dark:bg-red-400"
                    }`}
                  />
                  {user.status}
                </span>
              </td>
              <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                ${user.revenue.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
