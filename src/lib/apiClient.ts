import { API_URL } from "./api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiFetchOptions = {
  token: string;
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions): Promise<T> {
  const { token, method = "GET", body } = options;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data.error === "string" ? data.error : `Request failed (${response.status})`;
    throw new ApiError(message, response.status, data.details ?? data);
  }

  return data as T;
}

export function parsePrice(value: string | number): number {
  return typeof value === "number" ? value : parseFloat(value);
}

export function formatCurrency(value: string | number): string {
  const num = parsePrice(value);
  return `$${num.toFixed(2)}`;
}
