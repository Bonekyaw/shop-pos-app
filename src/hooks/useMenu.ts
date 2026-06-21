import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiClient";
import { useAuthStore } from "../store";
import type { MenuResponse } from "../types/api";

export function useMenu() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["menu"],
    queryFn: () => apiFetch<MenuResponse>("/api/menu", { token: token! }),
    enabled: !!token,
    staleTime: 5 * 60_000,
  });
}
