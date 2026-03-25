import { HiInbox } from "react-icons/hi2";

const EmptyState = () => {
  return (
    <div className="text-center py-10 flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
      <HiInbox className="w-8 h-8" />
      <p>No data available</p>
    </div>
  );
};

export default EmptyState;
