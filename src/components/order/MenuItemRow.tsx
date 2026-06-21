import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { formatCurrency, parsePrice } from "../../lib/apiClient";
import type { MenuItem } from "../../types/api";

interface MenuItemRowProps {
  item: MenuItem;
  quantity: number;
  notes?: string;
  onAdd: (item: MenuItem) => void;
  onDecrease: (item: MenuItem) => void;
  onNotesChange: (item: MenuItem, notes: string) => void;
}

const ROW_HEIGHT = 96;

function MenuItemRowComponent({
  item,
  quantity,
  notes,
  onAdd,
  onDecrease,
  onNotesChange,
}: MenuItemRowProps) {
  const price = parsePrice(item.price);
  const initial = item.name.charAt(0).toUpperCase();

  const handleAdd = useCallback(() => onAdd(item), [item, onAdd]);
  const handleDecrease = useCallback(() => onDecrease(item), [item, onDecrease]);

  return (
    <View style={styles.row}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>{initial}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.price}>{formatCurrency(price)}</Text>
        {quantity > 0 && (
          <TextInput
            style={styles.notesInput}
            placeholder="Notes (e.g. No sugar)"
            placeholderTextColor="#94a3b8"
            value={notes ?? ""}
            onChangeText={(text) => onNotesChange(item, text)}
          />
        )}
      </View>
      <View style={styles.controls}>
        {quantity > 0 && (
          <TouchableOpacity style={styles.qtyBtn} onPress={handleDecrease}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
        )}
        {quantity > 0 && <Text style={styles.qty}>{quantity}</Text>}
        <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnAdd]} onPress={handleAdd}>
          <Text style={[styles.qtyBtnText, styles.qtyBtnAddText]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const MenuItemRow = React.memo(MenuItemRowComponent);
export const MENU_ITEM_ROW_HEIGHT = ROW_HEIGHT;

const styles = StyleSheet.create({
  row: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#ffffff",
  },
  placeholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4338ca",
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  price: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  notesInput: {
    marginTop: 4,
    fontSize: 12,
    color: "#334155",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnAdd: {
    backgroundColor: "#3b82f6",
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#475569",
  },
  qtyBtnAddText: {
    color: "#ffffff",
  },
  qty: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 20,
    textAlign: "center",
    color: "#0f172a",
  },
});
