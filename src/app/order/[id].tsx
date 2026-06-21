import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrder } from "../../hooks/useOrder";
import { OrderItemList } from "../../components/order/OrderItemList";
import { AuditTrail } from "../../components/order/AuditTrail";
import { formatCurrency } from "../../lib/apiClient";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: order, isLoading, isError } = useOrder(id);

  const canModify =
    order &&
    (order.status === "PENDING" || order.status === "COOKING") &&
    order.paymentStatus !== "PENDING_CONFIRMATION" &&
    order.paymentStatus !== "CONFIRMED";

  const handleAddItems = () => {
    if (!order) return;
    router.push({
      pathname: "/order/new",
      params: {
        orderId: order.id,
        tableId: order.tableId ?? undefined,
      },
    });
  };

  const handleRequestPayment = () => {
    router.push({ pathname: "/payment/confirm", params: { orderId: id } });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (isError || !order) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load order</Text>
      </View>
    );
  }

  const tableLabel = order.table
    ? `Table ${order.table.number}`
    : order.type === "PARCEL"
      ? "Parcel"
      : "No table";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>{tableLabel}</Text>
          <Text style={styles.subtitle}>
            Waiter: {order.waiter.name} · {order.status}
          </Text>
          <Text style={styles.total}>{formatCurrency(order.totalAmount)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Order Items</Text>
        <OrderItemList items={order.items} />

        {canModify && (
          <TouchableOpacity style={styles.addBtn} onPress={handleAddItems}>
            <Text style={styles.addBtnText}>+ Add Items</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Activity</Text>
        <AuditTrail logs={order.auditLogs ?? []} />
      </ScrollView>

      <TouchableOpacity style={styles.paymentButton} onPress={handleRequestPayment}>
        <Text style={styles.paymentText}>Request Payment</Text>
      </TouchableOpacity>
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
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    textTransform: "capitalize",
  },
  total: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3b82f6",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginTop: 16,
    marginBottom: 8,
  },
  addBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#3b82f6",
    borderStyle: "dashed",
    alignItems: "center",
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
  },
  paymentButton: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  paymentText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 16,
    color: "#64748b",
  },
});
