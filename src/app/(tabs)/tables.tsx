import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const MOCK_TABLES = [
  { id: '1', number: 1, status: 'AVAILABLE', capacity: 4 },
  { id: '2', number: 2, status: 'OCCUPIED', capacity: 2, currentOrderId: 'ord-123' },
  { id: '3', number: 3, status: 'AVAILABLE', capacity: 6 },
  { id: '4', number: 4, status: 'CLEANING', capacity: 4 },
];

export default function TablesScreen() {
  const router = useRouter();

  const handleTablePress = (table: any) => {
    if (table.status === 'AVAILABLE') {
      router.push({ pathname: '/order/new', params: { tableId: table.id } });
    } else if (table.status === 'OCCUPIED') {
      router.push({ pathname: '/order/[id]', params: { id: table.currentOrderId } });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_TABLES}
        numColumns={2}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tableCard,
              item.status === 'AVAILABLE' && styles.tableAvailable,
              item.status === 'OCCUPIED' && styles.tableOccupied,
              item.status === 'CLEANING' && styles.tableCleaning,
            ]}
            onPress={() => handleTablePress(item)}
          >
            <Text style={styles.tableNumber}>Table {item.number}</Text>
            <Text style={styles.tableStatus}>{item.status}</Text>
            <Text style={styles.tableCapacity}>{item.capacity} seats</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  list: {
    padding: 16,
    gap: 16,
  },
  tableCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tableAvailable: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
    borderWidth: 1,
  },
  tableOccupied: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderWidth: 1,
  },
  tableCleaning: {
    backgroundColor: '#fef9c3',
    borderColor: '#fde047',
    borderWidth: 1,
  },
  tableNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tableStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 4,
  },
  tableCapacity: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});
