import type { User } from "../types";

const UsersTable = ({ users }: { users: User[] }) => {
  if (!users.length) return <p>No users</p>;

  return (
    <table className="w-full mt-6 bg-white rounded-xl border">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          <th className="p-4">User</th>
          <th>Status</th>
          <th>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user: User) => (
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
  );
};

export default UsersTable;
