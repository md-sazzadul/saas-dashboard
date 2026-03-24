type Props = {
  onFilterChange: (value: string) => void;
};

const Filters = ({ onFilterChange }: Props) => {
  return (
    <div className="flex gap-4 mb-6">
      <select
        onChange={(e) => onFilterChange(e.target.value)}
        className="border px-3 py-2 rounded-lg"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
};

export default Filters;
