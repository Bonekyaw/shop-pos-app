import React, { useCallback, useEffect, useMemo, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useMenu } from "../../hooks/useMenu";
import { useCreateOrder, useAddOrderItems } from "../../hooks/useOrder";
import { useCartStore } from "../../store/cartStore";
import { CategoryTabs } from "../../components/order/CategoryTabs";
import {
  MenuItemRow,
  MENU_ITEM_ROW_HEIGHT,
} from "../../components/order/MenuItemRow";
import { CartBar } from "../../components/order/CartBar";
import { OrderReviewSheet } from "../../components/order/OrderReviewSheet";
import { parsePrice } from "../../lib/apiClient";
import type { CartLine, MenuItem, OrderType } from "../../types/api";

export default function NewOrderScreen() {
  const { tableId, type, orderId } = useLocalSearchParams<{
    tableId?: string;
    type?: string;
    orderId?: string;
  }>();
  const router = useRouter();
  const navigation = useNavigation();
  const isAddMode = !!orderId;
  const orderType: OrderType = type === "PARCEL" ? "PARCEL" : "DINE_IN";

  useLayoutEffect(() => {
    navigation.setOptions({ title: isAddMode ? "Add Items" : "New Order" });
  }, [navigation, isAddMode]);

  const { data: menu, isLoading, isError } = useMenu();
  const createOrder = useCreateOrder();
  const addItems = useAddOrderItems(orderId ?? "");

  const lines = useCartStore((s) => s.lines);
  const setContext = useCartStore((s) => s.setContext);
  const addLine = useCartStore((s) => s.addLine);
  const updateQty = useCartStore((s) => s.updateQty);
  const updateNotes = useCartStore((s) => s.updateNotes);
  const removeLine = useCartStore((s) => s.removeLine);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore((s) => s.total);
  const itemCount = useCartStore((s) => s.itemCount);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [reviewVisible, setReviewVisible] = useState(false);

  useEffect(() => {
    setContext({
      tableId: tableId ?? null,
      orderId: orderId ?? null,
      type: orderType,
    });
  }, [tableId, orderId, orderType, setContext]);

  const filteredItems = useMemo(() => {
    if (!menu) return [];
    return menu.items.filter((item) => {
      const matchesCategory = !category || item.category === category;
      const matchesSearch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menu, category, search]);

  const getLineQty = useCallback(
    (menuItemId: string) => {
      return lines
        .filter((l) => l.menuItemId === menuItemId)
        .reduce((sum, l) => sum + l.quantity, 0);
    },
    [lines],
  );

  const getLineNotes = useCallback(
    (menuItemId: string) => {
      const line = lines.find((l) => l.menuItemId === menuItemId);
      return line?.notes;
    },
    [lines],
  );

  const handleAdd = useCallback(
    (item: MenuItem) => {
      addLine({
        menuItemId: item.id,
        name: item.name,
        price: parsePrice(item.price),
      });
    },
    [addLine],
  );

  const handleDecrease = useCallback(
    (item: MenuItem) => {
      const line = lines.find((l) => l.menuItemId === item.id);
      if (line) {
        updateQty(item.id, line.notes, line.quantity - 1);
      }
    },
    [lines, updateQty],
  );

  const handleNotesChange = useCallback(
    (item: MenuItem, notes: string) => {
      const line = lines.find((l) => l.menuItemId === item.id);
      if (line) {
        updateNotes(item.id, line.notes, notes);
      }
    },
    [lines, updateNotes],
  );

  const handleSubmit = useCallback(async () => {
    if (lines.length === 0) return;

    const payload = {
      items: lines.map((l) => ({
        menuItemId: l.menuItemId,
        quantity: l.quantity,
        notes: l.notes,
      })),
    };

    try {
      if (isAddMode && orderId) {
        await addItems.mutateAsync(payload);
        clear();
        setReviewVisible(false);
        router.back();
      } else {
        const result = await createOrder.mutateAsync({
          ...payload,
          tableId: orderType === "DINE_IN" ? (tableId ?? null) : null,
          type: orderType,
        });
        clear();
        setReviewVisible(false);

        Alert.alert("Print kitchen ticket?", "Send order to kitchen printer?", [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: () => {} },
        ]);

        router.replace({
          pathname: "/order/[id]",
          params: { id: result.order.id },
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit order";
      Alert.alert("Error", message);
    }
  }, [
    lines,
    isAddMode,
    orderId,
    addItems,
    createOrder,
    orderType,
    tableId,
    clear,
    router,
  ]);

  const renderItem = useCallback(
    ({ item }: { item: MenuItem }) => (
      <MenuItemRow
        item={item}
        quantity={getLineQty(item.id)}
        notes={getLineNotes(item.id)}
        onAdd={handleAdd}
        onDecrease={handleDecrease}
        onNotesChange={handleNotesChange}
      />
    ),
    [getLineQty, getLineNotes, handleAdd, handleDecrease, handleNotesChange],
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (isError || !menu) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load menu</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search menu..."
        placeholderTextColor="#94a3b8"
        value={search}
        onChangeText={setSearch}
      />
      <CategoryTabs
        categories={menu.categories}
        selected={category}
        onSelect={setCategory}
      />
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        removeClippedSubviews
        maxToRenderPerBatch={12}
        windowSize={7}
        getItemLayout={(_, index) => ({
          length: MENU_ITEM_ROW_HEIGHT,
          offset: MENU_ITEM_ROW_HEIGHT * index,
          index,
        })}
        contentContainerStyle={styles.listContent}
      />
      <CartBar
        itemCount={itemCount()}
        total={total()}
        onPress={() => setReviewVisible(true)}
      />
      <OrderReviewSheet
        visible={reviewVisible}
        lines={lines}
        total={total()}
        submitting={createOrder.isPending || addItems.isPending}
        mode={isAddMode ? "add" : "create"}
        onClose={() => setReviewVisible(false)}
        onUpdateQty={(line: CartLine, qty: number) =>
          updateQty(line.menuItemId, line.notes, qty)
        }
        onRemove={(line: CartLine) => removeLine(line.menuItemId, line.notes)}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    margin: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    fontSize: 16,
    color: "#0f172a",
  },
  listContent: {
    paddingBottom: 100,
  },
  errorText: {
    fontSize: 16,
    color: "#64748b",
  },
});
