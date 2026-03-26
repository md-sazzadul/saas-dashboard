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
    <div
      className="flex items-center justify-between px-5 py-3 border-t"
      style={{
        background: "var(--surface-1)",
        borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
      }}
    >
      <p
        className="text-xs text-gray-400 dark:text-gray-600 tabular-nums"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {startItem}–{endItem}
        <span className="text-gray-300 dark:text-gray-700 mx-1">/</span>
        {totalItems}
      </p>

      <div className="flex items-center gap-1">
        <NavButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <HiChevronLeft className="w-3.5 h-3.5" />
        </NavButton>

        {pages.map((page, i) =>
          page === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-7 text-center text-xs text-gray-300 dark:text-gray-700"
            >
              ···
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
          <HiChevronRight className="w-3.5 h-3.5" />
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
    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all duration-150 tabular-nums ${
      isActive
        ? "text-white"
        : "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`}
    style={
      isActive
        ? { background: "var(--accent)", fontFamily: "var(--font-mono)" }
        : { fontFamily: "var(--font-mono)" }
    }
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
    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-600
      hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
      disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
  >
    {children}
  </button>
);

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
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
