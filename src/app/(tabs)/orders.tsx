import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import { useActiveOrders } from "../../hooks/useOrder";
import { useAuthStore } from "../../store";
import { formatCurrency } from "../../lib/apiClient";
import type { ActiveOrder } from "../../types/api";

export default function OrdersScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data: orders = [], isLoading, isError, refetch, isRefetching } =
    useActiveOrders(user?.id);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handlePress = useCallback(
    (order: ActiveOrder) => {
      router.push({ pathname: "/order/[id]", params: { id: order.id } });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: ActiveOrder }) => {
      const tableLabel = item.table
        ? `Table ${item.table.number}`
        : item.type === "PARCEL"
          ? "Parcel"
          : "Walk-in";
      const itemCount = item.items.reduce((sum, i) => sum + i.quantity, 0);

const STATUS_BADGE: Record<string, { bg: string }> = {
  PENDING: { bg: "#fef9c3" },
  COOKING: { bg: "#ffedd5" },
  READY: { bg: "#dcfce7" },
};

      const badgeStyle = STATUS_BADGE[item.status] ?? { bg: "#f1f5f9" };

      return (
        <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
          <View style={styles.cardHeader}>
            <Text style={styles.tableLabel}>{tableLabel}</Text>
            <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.meta}>
            {itemCount} items · {formatCurrency(item.totalAmount)}
          </Text>
          <Text style={styles.time}>
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </Text>
        </TouchableOpacity>
      );
    },
    [handlePress],
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load orders</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No active orders</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
  },
  meta: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 6,
  },
  time: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
  empty: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 48,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 12,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
  },
  retryText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
