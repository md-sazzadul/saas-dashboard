const Skeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
      <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
    </div>
  );
};

export default Skeleton;
