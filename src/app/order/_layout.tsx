import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function OrderLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen 
        name="new" 
        options={{ 
          title: 'New Order',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
              <Text style={{ color: '#3b82f6', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          )
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Order Details' 
        }} 
      />
    </Stack>
  );
}
