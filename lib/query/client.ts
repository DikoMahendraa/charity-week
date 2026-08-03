import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 5 minutes before a background refetch is triggered
      staleTime: 5 * 60 * 1_000,
      // Cache entry lives 10 minutes after all observers unmount
      gcTime: 10 * 60 * 1_000,
      // Retry once on network error; don't retry on 4xx
      retry: (failureCount, error: unknown) => {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
