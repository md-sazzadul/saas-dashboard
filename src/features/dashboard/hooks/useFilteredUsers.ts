import { useMemo } from "react";
import type { User } from "../types";

/**
 * Isolates the filter derivation so Dashboard doesn't recompute
 * filteredUsers on every render — only when users or filter change.
 *
 * Keeping this in its own hook also makes the filter logic easy to test
 * independently from the component tree.
 */
export const useFilteredUsers = (users: User[], filter: string): User[] => {
  return useMemo(() => {
    if (filter === "all") return users;
    return users.filter((u) => u.status === filter);
  }, [users, filter]);
};
