function resolveApiUrl(): string {
  const raw = process.env.EXPO_PUBLIC_API_URL;
  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error(
      "API_URL is not set. Add API_URL to pos-app/.env — see .env.example.",
    );
  }
  return raw.trim().replace(/\/$/, "");
}

export const API_URL = resolveApiUrl();
