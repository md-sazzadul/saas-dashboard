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
    /*
      role="group" + aria-labelledby groups the filter buttons semantically.
      AT announces this as: "Status filter, group" when entering the group,
      giving users context before they hear each individual button.
    */
    <div
      role="group"
      aria-labelledby="filter-label"
      className="flex items-center gap-3 mb-5"
    >
      <div className="flex items-center gap-2">
        <HiAdjustmentsHorizontal
          aria-hidden="true"
          className="w-4 h-4 text-gray-400 dark:text-gray-600"
        />
        {/*
          id="filter-label" is referenced by aria-labelledby on the group.
          This provides the group's accessible name.
        */}
        <span
          id="filter-label"
          className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600"
        >
          Filter
        </span>
      </div>

      {/*
        We use role="radiogroup" + role="radio" pattern here because the
        filter options are mutually exclusive — exactly one is selected at
        a time. This is semantically identical to radio buttons and AT
        announces them correctly as "All users, radio button, 1 of 3".

        Alternatively, a native <fieldset>/<legend>/<input type="radio">
        approach is equally valid. The ARIA pattern is used here to match
        the existing visual design without restructuring the markup.
      */}
      <div
        role="radiogroup"
        aria-label="Filter users by status"
        className="flex gap-1.5"
      >
        {FILTER_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onFilterChange(opt.value)}
              type="button"
              role="radio"
              aria-checked={isSelected}
              /*
                aria-checked on a button requires role="radio" to be
                meaningful. Together they communicate the selected state:
                "Active, radio button, checked, 2 of 3"
              */
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isSelected
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
              }`}
              style={
                isSelected
                  ? {
                      background:
                        "color-mix(in srgb, var(--accent) 10%, transparent)",
                    }
                  : {}
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Filters;
