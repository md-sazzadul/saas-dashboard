import { HiAdjustmentsHorizontal } from "react-icons/hi2";

type Props = {
  value: string;
  onFilterChange: (value: string) => void;
};

const FILTER_OPTIONS = [
  { value: "all", label: "All users" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const Filters = ({ value, onFilterChange }: Props) => {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center gap-2">
        <HiAdjustmentsHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-600" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
          Filter
        </span>
      </div>

      <div className="flex gap-1.5">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFilterChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              value === opt.value
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
            }`}
            style={
              value === opt.value
                ? {
                    background:
                      "color-mix(in srgb, var(--accent) 10%, transparent)",
                  }
                : {}
            }
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
