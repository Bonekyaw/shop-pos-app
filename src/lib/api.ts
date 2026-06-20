import Constants from "expo-constants";
import { Platform } from "react-native";

// In dev, use the host machine's IP from Expo dev tools.
// In production, set the API_URL env var.
function getBaseUrl(): string {
  const override = Constants.expoConfig?.extra?.apiUrl;
  if (override) return override;

  // Expo Go / dev-client: use the debuggerHost (e.g. "192.168.1.5:8081")
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (debuggerHost) {
    const ip = debuggerHost.split(":")[0];
    return `http://${ip}:3000`;
  }

  // Fallback
  return Platform.OS === "android"
    ? "http://192.168.100.198:3000"
    : "http://localhost:3000";
}

export const API_URL = getBaseUrl();
