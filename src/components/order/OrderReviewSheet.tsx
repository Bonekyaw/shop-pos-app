import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { formatCurrency } from "../../lib/apiClient";
import type { CartLine } from "../../types/api";

interface OrderReviewSheetProps {
  visible: boolean;
  lines: CartLine[];
  total: number;
  submitting: boolean;
  mode: "create" | "add";
  onClose: () => void;
  onUpdateQty: (line: CartLine, quantity: number) => void;
  onRemove: (line: CartLine) => void;
  onSubmit: () => void;
}

export function OrderReviewSheet({
  visible,
  lines,
  total,
  submitting,
  mode,
  onClose,
  onUpdateQty,
  onRemove,
  onSubmit,
}: OrderReviewSheetProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Review Order</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={lines}
            keyExtractor={(item) => `${item.menuItemId}::${item.notes ?? ""}`}
            style={styles.list}
            renderItem={({ item }) => (
              <View style={styles.line}>
                <View style={styles.lineInfo}>
                  <Text style={styles.lineName}>{item.name}</Text>
                  {item.notes ? (
                    <Text style={styles.lineNotes}>{item.notes}</Text>
                  ) : null}
                  <Text style={styles.linePrice}>
                    {formatCurrency(item.price)} each
                  </Text>
                </View>
                <View style={styles.lineControls}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => onUpdateQty(item, item.quantity - 1)}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => onUpdateQty(item, item.quantity + 1)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onRemove(item)}>
                    <Text style={styles.remove}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>No items in cart</Text>
            }
          />

          <View style={styles.footer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.total}>{formatCurrency(total)}</Text>
            <TouchableOpacity
              style={[styles.submitBtn, submitting && styles.submitDisabled]}
              onPress={onSubmit}
              disabled={submitting || lines.length === 0}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitText}>
                  {mode === "create" ? "Submit to Kitchen" : "Add Items to Order"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  close: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "600",
  },
  list: {
    maxHeight: 360,
  },
  line: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  lineInfo: {
    flex: 1,
  },
  lineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  lineNotes: {
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
    marginTop: 2,
  },
  linePrice: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },
  lineControls: {
    alignItems: "flex-end",
    gap: 6,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },
  qty: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  remove: {
    fontSize: 12,
    color: "#ef4444",
    fontWeight: "600",
    marginTop: 4,
  },
  empty: {
    textAlign: "center",
    color: "#94a3b8",
    padding: 32,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  totalLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  total: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
});
