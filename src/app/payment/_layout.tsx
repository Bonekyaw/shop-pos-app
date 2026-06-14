import { Stack } from 'expo-router';

export default function PaymentLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="confirm"
        options={{
          title: 'Payment Confirmation',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
