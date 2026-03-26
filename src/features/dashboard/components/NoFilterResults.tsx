import { HiMagnifyingGlass } from "react-icons/hi2";

type Props = {
  filter: string;
  onClear: () => void;
};

/**
 * Shown when a filter produces zero results — distinct from the global
 * EmptyState (no data at all). Gives users a clear recovery action.
 */
const NoFilterResults = ({ filter, onClear }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 gap-3 bg-white dark:bg-gray-900">
      <HiMagnifyingGlass className="w-8 h-8 text-gray-300 dark:text-gray-600" />
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        No <span className="text-gray-900 dark:text-white">{filter}</span> users
        found
      </p>
      <button
        onClick={onClear}
        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        Clear filter
      </button>
    </div>
  );
};

export default NoFilterResults;
