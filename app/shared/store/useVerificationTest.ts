import { defineStore } from "pinia";
import type { VerificationTestItem } from "~/shared/api/types";

export const useVerificationTestStore = defineStore("verificationTest", {
  state: () => ({
    items: [] as VerificationTestItem[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    hasItems: (state) => state.items.length > 0,
  },

  actions: {
    setItems(items: VerificationTestItem[]) {
      this.items = items;
    },

    addItem(item: VerificationTestItem) {
      this.items.unshift(item);
    },

    updateItem(id: string, updates: Partial<VerificationTestItem>) {
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

