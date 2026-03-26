import { useState } from "react";

export const usePagination = <T>(items: T[], pageSize = 5) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Clamp current page whenever items/pageSize change
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = items.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Reset to page 1 (call this when filter changes)
  const reset = () => setCurrentPage(1);

  return {
    currentPage: safePage,
    totalPages,
    totalItems: items.length,
    pageSize,
    paginatedItems,
    goToPage,
    reset,
  };
};
