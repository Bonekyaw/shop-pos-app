import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiClient";
import { useAuthStore } from "../store";
import type { DiningTable } from "../types/api";

export function useTables() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const data = await apiFetch<{ tables: DiningTable[] }>("/api/tables", {
        token: token!,
      });
      return data.tables;
    },
    enabled: !!token,
    staleTime: 30_000,
  });
}
