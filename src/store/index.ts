import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { differenceInHours } from 'date-fns';
import { API_URL } from '../lib/api';

export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'WAITER';
}

interface AuthState {
  user: User | null;
  token: string | null;
  loginAt: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkSession: () => boolean;
  /**
   * Verify session with the server. Returns false and triggers
   * logout if the session has been revoked by an admin.
   */
  validateSession: () => Promise<boolean>;
}

interface OrderState {
  activeOrderIds: string[];
  addActiveOrder: (id: string) => void;
  removeActiveOrder: (id: string) => void;
}

const secureStorage = {
  getItem: (name: string): string | null => {
    return SecureStore.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    SecureStore.setItem(name, value);
  },
  removeItem: (name: string): void => {
    SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loginAt: null,
      login: (user, token) => set({ user, token, loginAt: new Date().toISOString() }),
      logout: () => set({ user: null, token: null, loginAt: null }),
      checkSession: () => {
        const { loginAt, logout } = get();
        if (!loginAt) return false;
        
        // Auto logout after 8 hours
        const isExpired = differenceInHours(new Date(), new Date(loginAt)) >= 8;
        if (isExpired) {
          logout();
          return false;
        }
        return true;
      },
      validateSession: async () => {
        const { token, logout } = get();
        if (!token) return false;

        try {
          const response = await fetch(`${API_URL}/api/auth/session-check`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();

          if (!data.valid) {
            logout();
            return false;
          }
          return true;
        } catch {
          // Network error — don't logout, just return false
          return false;
        }
      },
    }),
    {
      name: 'waiter-auth-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

export const useOrderStore = create<OrderState>((set) => ({
  activeOrderIds: [],
  addActiveOrder: (id) => set((state) => ({ activeOrderIds: [...new Set([...state.activeOrderIds, id])] })),
  removeActiveOrder: (id) => set((state) => ({ activeOrderIds: state.activeOrderIds.filter((orderId) => orderId !== id) })),
}));
