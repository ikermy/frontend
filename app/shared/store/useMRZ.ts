import { defineStore } from "pinia";
import type { MRZItem } from "~/shared/api/types";

export const useMRZStore = defineStore("mrz", {
  state: () => ({
    items: [] as MRZItem[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    hasItems: (state) => state.items.length > 0,
  },

  actions: {
    setItems(items: MRZItem[]) {
      this.items = items;
    },

    addItem(item: MRZItem) {
      this.items.unshift(item);
    },

    updateItem(id: string, updates: Partial<MRZItem>) {
      const index = this.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...updates };
      }
    },

    removeItem(id: string) {
      const index = this.items.findIndex((item) => item.id === id);
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

