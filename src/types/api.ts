export type TableStatus = "AVAILABLE" | "OCCUPIED" | "CLEANING";
export type OrderStatus = "PENDING" | "COOKING" | "READY" | "COMPLETED";
export type OrderType = "DINE_IN" | "PARCEL";
export type OrderItemStatus = "PENDING" | "COOKING" | "READY" | "DELIVERED";
export type BillPaymentStatus = "PENDING" | "PENDING_CONFIRMATION" | "CONFIRMED";

export interface TableCurrentOrder {
  id: string;
  status: OrderStatus;
  paymentStatus: BillPaymentStatus;
  totalAmount: string | number;
  itemCount: number;
}

export interface DiningTable {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId: string | null;
  currentOrder: TableCurrentOrder | null;
}

export interface MenuItem {
  id: string;
  name: string;
  price: string | number;
  category: string;
  preparationTime: number;
  isAvailable: boolean;
}

export interface MenuResponse {
  categories: string[];
  items: MenuItem[];
}

export interface CartLine {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  price: string | number;
  status: OrderItemStatus;
  notes: string | null;
  createdAt: string;
  menuItem: MenuItem;
  deliveredBy?: { name: string } | null;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: string;
  details: Record<string, unknown> | null;
  user: { name: string };
}

export interface Order {
  id: string;
  tableId: string | null;
  waiterId: string;
  status: OrderStatus;
  type: OrderType;
  totalAmount: string | number;
  paymentStatus: BillPaymentStatus;
  createdAt: string;
  items: OrderItem[];
  table: { id: string; number: number } | null;
  waiter: { name: string };
  auditLogs?: AuditLogEntry[];
}

export interface CreateOrderPayload {
  tableId?: string | null;
  type: OrderType;
  items: { menuItemId: string; quantity: number; notes?: string }[];
}

export interface AddItemsPayload {
  items: { menuItemId: string; quantity: number; notes?: string }[];
}

export interface ActiveOrder extends Order {
  items: (OrderItem & { isDelayed?: boolean })[];
}
