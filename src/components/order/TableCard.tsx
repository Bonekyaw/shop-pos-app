import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { formatCurrency } from "../../lib/apiClient";
import type { DiningTable } from "../../types/api";

interface TableCardProps {
  table: DiningTable;
  onPress: (table: DiningTable) => void;
}

function TableCardComponent({ table, onPress }: TableCardProps) {
  const isPaymentPending =
    table.currentOrder?.paymentStatus === "PENDING_CONFIRMATION";

  const statusStyle =
    table.status === "AVAILABLE"
      ? styles.available
      : table.status === "OCCUPIED"
        ? isPaymentPending
          ? styles.paymentPending
          : styles.occupied
        : styles.cleaning;

  const disabled = table.status === "CLEANING";

  return (
    <TouchableOpacity
      style={[styles.card, statusStyle, disabled && styles.disabled]}
      onPress={() => onPress(table)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.number}>Table {table.number}</Text>
      <Text style={styles.status}>{table.status.replace("_", " ")}</Text>
      <Text style={styles.capacity}>{table.capacity} seats</Text>
      {table.currentOrder && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {table.currentOrder.itemCount} items ·{" "}
            {formatCurrency(table.currentOrder.totalAmount)}
          </Text>
          {isPaymentPending && (
            <Text style={styles.paymentBadge}>Payment pending</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

export const TableCard = React.memo(TableCardComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    minHeight: 130,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  available: {
    backgroundColor: "#dcfce7",
    borderColor: "#86efac",
  },
  occupied: {
    backgroundColor: "#fee2e2",
    borderColor: "#fca5a5",
  },
  paymentPending: {
    backgroundColor: "#fef9c3",
    borderColor: "#fde047",
  },
  cleaning: {
    backgroundColor: "#f1f5f9",
    borderColor: "#cbd5e1",
  },
  disabled: {
    opacity: 0.6,
  },
  number: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  status: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    marginTop: 4,
    textTransform: "capitalize",
  },
  capacity: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  summary: {
    marginTop: 8,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
  },
  paymentBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#a16207",
    marginTop: 2,
  },
});
