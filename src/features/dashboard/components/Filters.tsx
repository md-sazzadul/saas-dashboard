type Props = {
  value: string;
  onFilterChange: (value: string) => void;
};

/**
 * Controlled — receives `value` from parent so the select can be reset
 * programmatically (e.g. from the NoFilterResults "Clear filter" button).
 */

const Filters = ({ value, onFilterChange }: Props) => {
  return (
    <div className="flex gap-4 mb-6">
      <select
        value={value}
        onChange={(e) => onFilterChange(e.target.value)}
        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900
          text-gray-900 dark:text-gray-100 px-3 py-2 rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
          transition-colors duration-200"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
};

export default Filters;
