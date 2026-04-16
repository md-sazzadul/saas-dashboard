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
  onRowClick?: (user: User) => void;
  searchQuery?: string;
};

const COLUMNS: { key: SortableColumn; label: string; align?: string }[] = [
  { key: "name", label: "User" },
  { key: "status", label: "Status" },
  { key: "revenue", label: "Revenue", align: "right" },
];

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
  "bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
  "bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
  "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
  "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
  "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getAvatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const HighlightText = ({ text, query }: { text: string; query?: string }) => {
  if (!query?.trim()) return <>{text}</>;
  const regex = new RegExp(
    `(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          /*
            <mark> is the correct semantic element for highlighted search
            terms — it conveys "highlighted for relevance" to AT, unlike
            a <span> with visual styling only.
          */
          <mark
            key={i}
            className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};

/*
  SortIcon also provides the sort state via aria-sort on the <th>,
  so this icon is purely decorative (aria-hidden).
*/
const SortIcon = ({
  columnKey,
  sortConfig,
}: {
  columnKey: SortableColumn;
  sortConfig: SortConfig<User>;
}) => {
  if (sortConfig?.key !== columnKey) {
    return (
      <HiChevronUpDown aria-hidden="true" className="w-3.5 h-3.5 opacity-30" />
    );
  }
  return sortConfig.direction === "asc" ? (
    <HiChevronUp aria-hidden="true" className="w-3.5 h-3.5 text-indigo-500" />
  ) : (
    <HiChevronDown aria-hidden="true" className="w-3.5 h-3.5 text-indigo-500" />
  );
};

/*
  Helper: map our internal sort state to the WAI-ARIA aria-sort values.
  aria-sort on <th> is the accessible way to communicate sort direction
  (WCAG technique: ARIA21).
*/
const getAriaSortValue = (
  columnKey: SortableColumn,
  sortConfig: SortConfig<User>,
): "ascending" | "descending" | "none" => {
  if (sortConfig?.key !== columnKey) return "none";
  return sortConfig.direction === "asc" ? "ascending" : "descending";
};

const UsersTable = ({
  users,
  sortConfig,
  onSort,
  onRowClick,
  searchQuery,
}: Props) => {
  if (!users.length)
    return (
      <p className="text-gray-400 dark:text-gray-600 p-6 text-sm" role="status">
        No users found.
      </p>
    );

  return (
    /*
      overflow-x-auto on the wrapper ensures the table scrolls horizontally
      on small viewports rather than overflowing or truncating content.
      This addresses WCAG SC 1.4.10 (Reflow).
    */
    <div className="overflow-x-auto">
      <table
        className="w-full"
        style={{ background: "var(--surface-1)" }}
        /*
          aria-label gives the table an accessible name for AT users who
          navigate tables directly. Without it, the table is announced as
          just "table" with no context.
        */
        aria-label="Users list"
      >
        {/*
          <caption> is the semantic equivalent of an accessible table name.
          We use aria-label on the table AND a visually-hidden caption
          so both approaches are covered across different AT implementations.
          sr-only hides it visually without removing it from the AT tree.
        */}
        <caption className="sr-only">
          List of users with name, status, and revenue columns. Click column
          headers to sort.
        </caption>

        <thead>
          <tr
            className="border-b"
            style={{
              background: "color-mix(in srgb, currentColor 3%, transparent)",
              borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
            }}
          >
            {COLUMNS.map(({ key, label, align }) => (
              <th
                key={key}
                /*
                  scope="col" is required on all <th> in a column header
                  row so AT can associate data cells with the correct header
                  (WCAG technique H63).
                */
                scope="col"
                /*
                  aria-sort reflects the current sort state. Valid values:
                  "ascending" | "descending" | "none" | "other".
                  This is read aloud by screen readers: e.g. "Name, ascending".
                */
                aria-sort={getAriaSortValue(key, sortConfig)}
                onClick={() => onSort(key)}
                /*
                  Using a <button> inside <th> is an alternative pattern,
                  but making the <th> itself the button (role="columnheader"
                  is implicit) with onClick + keyboard handler is acceptable
                  when we add the keyboard interaction below.
                */
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSort(key);
                  }
                }}
                tabIndex={0}
                className={`px-5 py-3 cursor-pointer select-none group ${align === "right" ? "text-right" : "text-left"}`}
                title={`Sort by ${label}`}
              >
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors ${
                    align === "right" ? "flex-row-reverse" : ""
                  }`}
                >
                  {label}
                  <SortIcon columnKey={key} sortConfig={sortConfig} />
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {users.map((user: User, idx: number) => (
            <tr
              key={user.id}
              onClick={() => onRowClick?.(user)}
              /*
                If the row is clickable, it should have role="button" and
                be keyboard-accessible. However, since we have individual
                cell content, we use onKeyDown on the row.
              */
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && onRowClick) {
                  e.preventDefault();
                  onRowClick(user);
                }
              }}
              tabIndex={onRowClick ? 0 : undefined}
              aria-label={
                onRowClick
                  ? `View details for ${user.name}, ${user.status} user, revenue $${user.revenue.toLocaleString()}`
                  : undefined
              }
              className={`border-b transition-colors duration-100 ${
                onRowClick ? "cursor-pointer" : ""
              } group hover:bg-indigo-50/50 dark:hover:bg-indigo-950/10`}
              style={{
                borderColor: "color-mix(in srgb, currentColor 6%, transparent)",
                animationDelay: `${idx * 30}ms`,
              }}
            >
              {/* User */}
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  {/*
                    Avatar is decorative — the user's name in the adjacent
                    <p> provides the accessible label for this cell.
                  */}
                  <div
                    aria-hidden="true"
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${getAvatarColor(user.name)}`}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-none">
                      <HighlightText text={user.name} query={searchQuery} />
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                      {/* abbr provides the full form for AT */}
                      <abbr title={`User identifier ${user.id}`}>
                        ID #{user.id.toString().padStart(4, "0")}
                      </abbr>
                    </p>
                  </div>
                </div>
              </td>

              {/* Status */}
              <td className="px-5 py-3.5">
                <StatusBadge status={user.status} />
              </td>

              {/* Revenue */}
              <td className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-3">
                  <span
                    className="text-sm font-semibold text-gray-800 dark:text-gray-200 tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    ${user.revenue.toLocaleString()}
                  </span>
                  {onRowClick && (
                    <span
                      aria-hidden="true"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[10px] font-medium text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full"
                    >
                      View
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StatusBadge = ({ status }: { status: User["status"] }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      status === "active"
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
    }`}
    /*
      role="status" not needed here — the text itself is readable.
      The icon is aria-hidden; the text "Active"/"Inactive" provides the label.
    */
  >
    {status === "active" ? (
      <HiCheckCircle aria-hidden="true" className="w-3.5 h-3.5" />
    ) : (
      <HiXCircle aria-hidden="true" className="w-3.5 h-3.5" />
    )}
    {status === "active" ? "Active" : "Inactive"}
  </span>
);

export default UsersTable;
