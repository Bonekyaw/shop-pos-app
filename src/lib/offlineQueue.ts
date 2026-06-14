import * as SecureStore from 'expo-secure-store';

const QUEUE_KEY = 'waiter-offline-queue';

export interface QueueAction {
  id: string;
  type: 'CREATE_ORDER' | 'UPDATE_ORDER' | 'DELIVER_ITEM' | 'REQUEST_PAYMENT';
  payload: any;
  timestamp: string;
}

export const offlineQueue = {
  getQueue: async (): Promise<QueueAction[]> => {
    try {
      const data = await SecureStore.getItemAsync(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get offline queue', e);
      return [];
    }
  },

  addAction: async (action: Omit<QueueAction, 'id' | 'timestamp'>) => {
    try {
      const queue = await offlineQueue.getQueue();
      const newAction: QueueAction = {
        ...action,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
      };
      queue.push(newAction);
      await SecureStore.setItemAsync(QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('Failed to add action to queue', e);
    }
  },

  removeAction: async (id: string) => {
    try {
      const queue = await offlineQueue.getQueue();
      const updatedQueue = queue.filter(a => a.id !== id);
      await SecureStore.setItemAsync(QUEUE_KEY, JSON.stringify(updatedQueue));
    } catch (e) {
      console.error('Failed to remove action from queue', e);
    }
  },

  clearQueue: async () => {
    try {
      await SecureStore.deleteItemAsync(QUEUE_KEY);
    } catch (e) {
      console.error('Failed to clear queue', e);
    }
  }
};
