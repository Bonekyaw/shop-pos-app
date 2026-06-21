import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { formatCurrency } from "../../lib/apiClient";

interface CartBarProps {
  itemCount: number;
  total: number;
  onPress: () => void;
}

export function CartBar({ itemCount, total, onPress }: CartBarProps) {
  if (itemCount === 0) return null;

  return (
    <TouchableOpacity style={styles.bar} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{itemCount}</Text>
      </View>
      <Text style={styles.label}>View order</Text>
      <Text style={styles.total}>{formatCurrency(total)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  badge: {
    backgroundColor: "#ffffff",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3b82f6",
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  total: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
});
