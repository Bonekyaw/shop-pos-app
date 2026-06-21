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
import { useTables } from "../../hooks/useTables";
import { TableCard } from "../../components/order/TableCard";
import type { DiningTable } from "../../types/api";

export default function TablesScreen() {
  const router = useRouter();
  const { data: tables = [], isLoading, isError, refetch, isRefetching } = useTables();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handleTablePress = useCallback(
    (table: DiningTable) => {
      if (table.status === "AVAILABLE") {
        router.push({ pathname: "/order/new", params: { tableId: table.id } });
      } else if (table.status === "OCCUPIED" && table.currentOrder) {
        router.push({
          pathname: "/order/[id]",
          params: { id: table.currentOrder.id },
        });
      }
    },
    [router],
  );

  const handleParcel = useCallback(() => {
    router.push({ pathname: "/order/new", params: { type: "PARCEL" } });
  }, [router]);

  const renderItem = useCallback(
    ({ item }: { item: DiningTable }) => (
      <TableCard table={item} onPress={handleTablePress} />
    ),
    [handleTablePress],
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
        <Text style={styles.errorText}>Failed to load tables</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tables}
        numColumns={2}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
      <TouchableOpacity style={styles.parcelBtn} onPress={handleParcel}>
        <Text style={styles.parcelText}>Parcel / Takeaway</Text>
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
    backgroundColor: "#f8fafc",
  },
  list: {
    padding: 8,
    paddingBottom: 80,
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
  parcelBtn: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: "#0f172a",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  parcelText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
