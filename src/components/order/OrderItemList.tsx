import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { formatCurrency, parsePrice } from "../../lib/apiClient";
import type { OrderItem } from "../../types/api";

interface OrderItemListProps {
  items: OrderItem[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#fef9c3", text: "#a16207" },
  COOKING: { bg: "#ffedd5", text: "#c2410c" },
  READY: { bg: "#dcfce7", text: "#15803d" },
  DELIVERED: { bg: "#f1f5f9", text: "#475569" },
};

function OrderItemRow({ item }: { item: OrderItem }) {
  const colors = STATUS_COLORS[item.status] ?? STATUS_COLORS.PENDING;
  const lineTotal = parsePrice(item.price) * item.quantity;

  return (
    <View style={styles.row}>
      <View style={styles.rowMain}>
        <Text style={styles.name}>
          {item.quantity}× {item.menuItem.name}
        </Text>
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
        <View style={[styles.badge, { backgroundColor: colors.bg }]}>
          <Text style={[styles.badgeText, { color: colors.text }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.price}>{formatCurrency(lineTotal)}</Text>
    </View>
  );
}

export function OrderItemList({ items }: OrderItemListProps) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <OrderItemRow item={item} />}
      scrollEnabled={false}
      ListEmptyComponent={
        <Text style={styles.empty}>No items in this order</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  rowMain: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  notes: {
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
    marginTop: 2,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  price: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  empty: {
    color: "#94a3b8",
    textAlign: "center",
    paddingVertical: 24,
  },
});
