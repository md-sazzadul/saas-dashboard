import { HiInbox } from "react-icons/hi2";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 animate-fade-up">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: "color-mix(in srgb, currentColor 6%, transparent)",
        }}
      >
        <HiInbox className="w-6 h-6 text-gray-400 dark:text-gray-600" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          No data available
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
          Check back later
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
