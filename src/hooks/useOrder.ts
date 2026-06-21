import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiClient";
import { useAuthStore } from "../store";
import type {
  ActiveOrder,
  AddItemsPayload,
  CreateOrderPayload,
  Order,
} from "../types/api";

export function useOrder(orderId: string | undefined) {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const data = await apiFetch<{ order: Order }>(`/api/orders/${orderId}`, {
        token: token!,
      });
      return data.order;
    },
    enabled: !!token && !!orderId,
  });
}

export function useActiveOrders(waiterId: string | undefined) {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["orders", "active", waiterId],
    queryFn: async () => {
      const data = await apiFetch<{ orders: ActiveOrder[] }>(
        `/api/orders/active?waiterId=${waiterId}`,
        { token: token! },
      );
      return data.orders;
    },
    enabled: !!token && !!waiterId,
    staleTime: 15_000,
  });
}

export function useCreateOrder() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      apiFetch<{ order: Order }>("/api/orders", {
        token: token!,
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useAddOrderItems(orderId: string) {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddItemsPayload) =>
      apiFetch<{ order: Order }>(`/api/orders/${orderId}/items`, {
        token: token!,
        method: "PATCH",
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
