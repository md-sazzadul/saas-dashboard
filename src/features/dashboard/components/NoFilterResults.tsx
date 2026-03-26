import { HiMagnifyingGlass } from "react-icons/hi2";

type Props = {
  filter: string;
  onClear: () => void;
};

const NoFilterResults = ({ filter, onClear }: Props) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-14 px-4 gap-3"
      style={{ background: "var(--surface-1)" }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: "color-mix(in srgb, currentColor 6%, transparent)",
        }}
      >
        <HiMagnifyingGlass className="w-5 h-5 text-gray-400 dark:text-gray-600" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          No{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {filter}
          </span>{" "}
          users
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
          Try adjusting the filter
        </p>
      </div>
      <button
        onClick={onClear}
        className="mt-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition-all duration-150"
        style={{
          background: "color-mix(in srgb, var(--accent) 10%, transparent)",
        }}
      >
        Show all users
      </button>
    </div>
  );
};

export default NoFilterResults;
