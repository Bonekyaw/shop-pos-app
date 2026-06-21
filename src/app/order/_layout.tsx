import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { useCartStore } from "../../store/cartStore";

function NewOrderHeaderLeft() {
  const router = useRouter();
  const clear = useCartStore((s) => s.clear);

  return (
    <TouchableOpacity
      onPress={() => {
        clear();
        router.back();
      }}
      style={{ marginLeft: 16 }}
    >
      <Text style={{ color: "#3b82f6", fontSize: 16 }}>Cancel</Text>
    </TouchableOpacity>
  );
}

export default function OrderLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="new"
        options={{
          headerLeft: () => <NewOrderHeaderLeft />,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Order Details",
        }}
      />
    </Stack>
  );
}
