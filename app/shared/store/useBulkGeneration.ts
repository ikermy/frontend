import { defineStore } from "pinia";
import type { BulkGenerationHistoryItem } from "~/shared/api/types";

export const useBulkGenerationStore = defineStore("bulkGeneration", {
  state: () => ({
    items: [] as BulkGenerationHistoryItem[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    hasItems: state => state.items.length > 0,
  },

  actions: {
    setItems(items: BulkGenerationHistoryItem[]) {
      this.items = items;
    },

    addItem(item: BulkGenerationHistoryItem) {
      this.items.unshift(item);
    },

    updateItem(id: string, updates: Partial<BulkGenerationHistoryItem>) {
      const index = this.items.findIndex(item => item.id === id);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...updates } as BulkGenerationHistoryItem;
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

