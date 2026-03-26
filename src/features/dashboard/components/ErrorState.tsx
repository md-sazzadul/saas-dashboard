import { HiExclamationTriangle } from "react-icons/hi2";

const ErrorState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 animate-fade-up">
      <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
        <HiExclamationTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-red-500 dark:text-red-400">
          Failed to load data
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
          Please refresh the page
        </p>
      </div>
    </div>
  );
};

export default ErrorState;
