import { defineStore } from "pinia";
import type { LookupItem } from "~/shared/api/types";

export const useLookupStore = defineStore("lookup", {
  state: () => ({
    items: [] as LookupItem[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    hasItems: state => state.items.length > 0,
  },

  actions: {
    setItems(items: LookupItem[]) {
      this.items = items;
    },

    addItem(item: LookupItem) {
      this.items.unshift(item);
    },

    updateItem(id: string, updates: Partial<LookupItem>) {
      const index = this.items.findIndex(item => item.id === id);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...updates } as LookupItem;
      }
    },

    removeItem(id: string) {
      const index = this.items.findIndex(item => item.id === id);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },

    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    setError(error: string | null) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    },
  },
});
