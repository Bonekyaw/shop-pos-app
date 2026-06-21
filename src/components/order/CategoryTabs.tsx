import React, { useCallback } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";

interface CategoryTabsProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

const ALL = "__all__";

function CategoryTabsComponent({ categories, selected, onSelect }: CategoryTabsProps) {
  const data = [ALL, ...categories];

  const renderItem = useCallback(
    ({ item }: { item: string }) => {
      const isAll = item === ALL;
      const active = isAll ? selected === null : selected === item;
      return (
        <TouchableOpacity
          style={[styles.tab, active && styles.tabActive]}
          onPress={() => onSelect(isAll ? null : item)}
        >
          <Text style={[styles.tabText, active && styles.tabTextActive]}>
            {isAll ? "All" : item}
          </Text>
        </TouchableOpacity>
      );
    },
    [selected, onSelect],
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

export const CategoryTabs = React.memo(CategoryTabsComponent);

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  list: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  tabTextActive: {
    color: "#ffffff",
  },
});
