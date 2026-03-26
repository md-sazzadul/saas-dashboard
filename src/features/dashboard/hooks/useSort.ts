import { useMemo, useState } from "react";

export type SortDirection = "asc" | "desc";

export type SortConfig<T> = {
  key: keyof T;
  direction: SortDirection;
} | null;

export const useSort = <T>(items: T[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null);

  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;

    return [...items].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  const toggleSort = (key: keyof T) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        // Cycle: asc → desc → null
        if (prev.direction === "asc") return { key, direction: "desc" };
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  return { sortedItems, sortConfig, toggleSort };
};
