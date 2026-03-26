import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

type Props = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: Props) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-200">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {startItem}–{endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {totalItems}
        </span>{" "}
        users
      </p>

      <div className="flex items-center gap-1">
        <NavButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <HiChevronLeft className="w-4 h-4" />
        </NavButton>

        {pages.map((page, i) =>
          page === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 text-center text-sm text-gray-400 dark:text-gray-500 select-none"
            >
              …
            </span>
          ) : (
            <PageButton
              key={page}
              page={page as number}
              isActive={page === currentPage}
              onClick={() => onPageChange(page as number)}
            />
          ),
        )}

        <NavButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <HiChevronRight className="w-4 h-4" />
        </NavButton>
      </div>
    </div>
  );
};

const PageButton = ({
  page,
  isActive,
  onClick,
}: {
  page: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? "bg-indigo-600 dark:bg-indigo-500 text-white"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`}
  >
    {page}
  </button>
);

const NavButton = ({
  children,
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  "aria-label": string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400
      hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed
      transition-colors duration-150"
  >
    {children}
  </button>
);

/** Returns page numbers with ellipsis where needed. */
function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "…")[] = [1];

  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("…");

  pages.push(total);

  return pages;
}

export default Pagination;
