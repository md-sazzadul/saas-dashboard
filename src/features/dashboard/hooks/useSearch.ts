import { useMemo, useState } from "react";
import type { User } from "../types";

export const useSearch = (users: User[]) => {
  const [query, setQuery] = useState("");

  const filteredBySearch = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.id.toString().includes(q),
    );
  }, [users, query]);

  return { query, setQuery, filteredBySearch };
};
