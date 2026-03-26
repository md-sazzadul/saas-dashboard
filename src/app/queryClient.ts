import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes — no refetch on window focus
      // for data that hasn't changed. Dashboards show aggregate data that
      // doesn't need to be live.
      staleTime: 5 * 60 * 1000,
      // Keep unused query data in cache for 10 minutes before GC
      gcTime: 10 * 60 * 1000,
      // Only retry once on failure — fast feedback over resilience for a dashboard
      retry: 1,
      // Don't refetch just because the user switched tabs
      refetchOnWindowFocus: false,
    },
  },
});
