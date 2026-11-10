import { useState, useEffect, useCallback } from 'react';
import { scopedStorage } from '@lark-apaas/client-toolkit-lite';

export function useDiaryStore<T>(key: string, initialValue: T[]): {
  items: T[];
  addItem: (item: T) => void;
  updateItem: (id: string, updates: Partial<T>) => void;
  deleteItem: (id: string) => void;
  setItems: (items: T[]) => void;
} {
  const [items, setItemsState] = useState<T[]>(() => {
    try {
      const stored = scopedStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored) as T[];
      }
    } catch {
      // ignore
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      scopedStorage.setItem(key, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [key, items]);

  const addItem = useCallback((item: T) => {
    setItemsState((prev) => [item, ...prev]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setItemsState((prev) =>
      prev.map((item) => {
        const itemWithId = item as { id?: string };
        if (itemWithId.id === id) {
          return { ...item, ...updates } as T;
        }
        return item;
      })
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItemsState((prev) =>
      prev.filter((item) => {
        const itemWithId = item as { id?: string };
        return itemWithId.id !== id;
      })
    );
  }, []);

  const setItems = useCallback((newItems: T[]) => {
    setItemsState(newItems);
  }, []);

  return { items, addItem, updateItem, deleteItem, setItems };
}
