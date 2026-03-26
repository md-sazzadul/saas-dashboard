import {
  HiCheckCircle,
  HiChevronDown,
  HiChevronUp,
  HiChevronUpDown,
  HiXCircle,
} from "react-icons/hi2";
import type { SortConfig } from "../hooks/useSort";
import type { User } from "../types";

type SortableColumn = keyof Pick<User, "name" | "status" | "revenue">;

type Props = {
  users: User[];
  sortConfig: SortConfig<User>;
  onSort: (key: SortableColumn) => void;
};

const COLUMNS: { key: SortableColumn; label: string }[] = [
  { key: "name", label: "User" },
  { key: "status", label: "Status" },
  { key: "revenue", label: "Revenue" },
];

const SortIcon = ({
  columnKey,
  sortConfig,
}: {
  columnKey: SortableColumn;
  sortConfig: SortConfig<User>;
}) => {
  if (sortConfig?.key !== columnKey) {
    return <HiChevronUpDown className="w-3.5 h-3.5 opacity-40" />;
  }
  return sortConfig.direction === "asc" ? (
    <HiChevronUp className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
  ) : (
    <HiChevronDown className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
  );
};

const UsersTable = ({ users, sortConfig, onSort }: Props) => {
  if (!users.length)
    return (
      <p className="text-gray-500 dark:text-gray-400 p-6">No users found.</p>
    );

  return (
    <table className="w-full bg-white dark:bg-gray-900 transition-colors duration-200">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {COLUMNS.map(({ key, label }) => (
            <th
              key={key}
              onClick={() => onSort(key)}
              className="text-left p-4 cursor-pointer select-none group"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                {label}
                <SortIcon columnKey={key} sortConfig={sortConfig} />
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((user: User) => (
          <tr
            key={user.id}
            className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-100">
              {user.name}
            </td>
            <td className="p-4">
              <StatusBadge status={user.status} />
            </td>
            <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
              ${user.revenue.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const StatusBadge = ({ status }: { status: User["status"] }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === "active"
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    }`}
  >
    {status === "active" ? (
      <HiCheckCircle className="w-3.5 h-3.5" />
    ) : (
      <HiXCircle className="w-3.5 h-3.5" />
    )}
    {status}
  </span>
);

export default UsersTable;
