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
    /*
      <nav> with aria-label identifies this as pagination navigation.
      This creates a named landmark that AT users can jump to directly,
      and distinguishes it from the sidebar nav (WCAG 2.4.1, 4.1.2).
    */
    <nav
      aria-label={`Pagination, page ${currentPage} of ${totalPages}`}
      className="flex items-center justify-between px-5 py-3 border-t"
      style={{
        background: "var(--surface-1)",
        borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
      }}
    >
      {/*
        Showing items X–Y of Z.
        aria-live="polite" announces the range update to AT when the user
        navigates pages, without interrupting their current action.
      */}
      <p
        className="text-xs text-gray-400 dark:text-gray-600 tabular-nums"
        style={{ fontFamily: "var(--font-mono)" }}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="sr-only">Showing items </span>
        {startItem}–{endItem}
        <span
          className="text-gray-300 dark:text-gray-700 mx-1"
          aria-hidden="true"
        >
          /
        </span>
        <span className="sr-only"> of </span>
        {totalItems}
        <span className="sr-only"> total</span>
      </p>

      {/*
        <ol> is semantically appropriate for an ordered list of page links.
        Screen readers announce "list, N items" giving users a count of pages.
      */}
      <ol className="flex items-center gap-1 list-none p-0 m-0" role="list">
        <li>
          <NavButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            <HiChevronLeft aria-hidden="true" className="w-3.5 h-3.5" />
          </NavButton>
        </li>

        {pages.map((page, i) =>
          page === "…" ? (
            <li key={`ellipsis-${i}`} aria-hidden="true">
              <span className="w-7 text-center text-xs text-gray-300 dark:text-gray-700">
                ···
              </span>
            </li>
          ) : (
            <li key={page}>
              <PageButton
                page={page as number}
                isActive={page === currentPage}
                onClick={() => onPageChange(page as number)}
              />
            </li>
          ),
        )}

        <li>
          <NavButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            <HiChevronRight aria-hidden="true" className="w-3.5 h-3.5" />
          </NavButton>
        </li>
      </ol>
    </nav>
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
    type="button"
    /*
      aria-current="page" marks the active page for AT (WCAG 2.4.8).
      It's read as "Page 2, current" vs just "Page 3".
    */
    aria-current={isActive ? "page" : undefined}
    aria-label={`Go to page ${page}`}
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
    type="button"
    disabled={disabled}
    aria-label={ariaLabel}
    /*
      aria-disabled would be the alternative to disabled for keeping the
      button focusable; here disabled is appropriate since we want to
      remove it from the tab order when unavailable.
    */
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
