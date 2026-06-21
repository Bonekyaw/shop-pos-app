import { create } from "zustand";
import type { CartLine, OrderType } from "../types/api";

interface CartState {
  tableId: string | null;
  orderId: string | null;
  type: OrderType;
  lines: CartLine[];
  setContext: (ctx: {
    tableId?: string | null;
    orderId?: string | null;
    type?: OrderType;
  }) => void;
  addLine: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  updateQty: (menuItemId: string, notes: string | undefined, quantity: number) => void;
  updateNotes: (menuItemId: string, oldNotes: string | undefined, notes: string) => void;
  removeLine: (menuItemId: string, notes?: string) => void;
  clear: () => void;
  total: () => number;
  itemCount: () => number;
}

function lineKey(menuItemId: string, notes?: string) {
  return `${menuItemId}::${notes ?? ""}`;
}

export const useCartStore = create<CartState>((set, get) => ({
  tableId: null,
  orderId: null,
  type: "DINE_IN",
  lines: [],

  setContext: (ctx) =>
    set((state) => ({
      tableId: ctx.tableId !== undefined ? ctx.tableId : state.tableId,
      orderId: ctx.orderId !== undefined ? ctx.orderId : state.orderId,
      type: ctx.type ?? state.type,
    })),

  addLine: (line) =>
    set((state) => {
      const notes = line.notes?.trim() || undefined;
      const existing = state.lines.find(
        (l) => lineKey(l.menuItemId, l.notes) === lineKey(line.menuItemId, notes),
      );
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            lineKey(l.menuItemId, l.notes) === lineKey(line.menuItemId, notes)
              ? { ...l, quantity: l.quantity + (line.quantity ?? 1) }
              : l,
          ),
        };
      }
      return {
        lines: [
          ...state.lines,
          {
            menuItemId: line.menuItemId,
            name: line.name,
            price: line.price,
            quantity: line.quantity ?? 1,
            notes,
          },
        ],
      };
    }),

  updateQty: (menuItemId, notes, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          lines: state.lines.filter(
            (l) => lineKey(l.menuItemId, l.notes) !== lineKey(menuItemId, notes),
          ),
        };
      }
      return {
        lines: state.lines.map((l) =>
          lineKey(l.menuItemId, l.notes) === lineKey(menuItemId, notes)
            ? { ...l, quantity }
            : l,
        ),
      };
    }),

  updateNotes: (menuItemId, oldNotes, notes) =>
    set((state) => ({
      lines: state.lines.map((l) =>
        lineKey(l.menuItemId, l.notes) === lineKey(menuItemId, oldNotes)
          ? { ...l, notes: notes.trim() || undefined }
          : l,
      ),
    })),

  removeLine: (menuItemId, notes) =>
    set((state) => ({
      lines: state.lines.filter(
        (l) => lineKey(l.menuItemId, l.notes) !== lineKey(menuItemId, notes),
      ),
    })),

  clear: () => set({ lines: [], tableId: null, orderId: null, type: "DINE_IN" }),

  total: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),

  itemCount: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
}));
