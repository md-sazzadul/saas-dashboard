import { HiExclamationTriangle } from "react-icons/hi2";

const ErrorState = () => {
  return (
    <div className="text-center py-10 flex flex-col items-center gap-2">
      <HiExclamationTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
      <p className="text-red-500 dark:text-red-400 font-semibold">
        Failed to load data
      </p>
    </div>
  );
};

export default ErrorState;
