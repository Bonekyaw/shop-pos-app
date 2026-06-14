import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const handleRequestPayment = () => {
    router.push({ pathname: '/payment/confirm', params: { orderId: id } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order #{id}</Text>
      <Text style={styles.subtitle}>Order items will appear here.</Text>
      
      <View style={{ flex: 1 }} />
      
      <TouchableOpacity style={styles.paymentButton} onPress={handleRequestPayment}>
        <Text style={styles.paymentText}>Request Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  paymentButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
