import { defineStore } from "pinia";
import type { PhotoGeneratorItem } from "~/shared/api/types";

export const usePhotoGeneratorStore = defineStore("photoGenerator", {
  state: () => ({
    items: [] as PhotoGeneratorItem[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    hasItems: (state) => state.items.length > 0,
    photos: (state) => state.items.filter((item) => item.type === "photo"),
    signatures: (state) => state.items.filter((item) => item.type === "signature"),
  },

  actions: {
    setItems(items: PhotoGeneratorItem[]) {
      this.items = items;
    },

    addItem(item: PhotoGeneratorItem) {
      this.items.unshift(item);
    },

    updateItem(id: string, updates: Partial<PhotoGeneratorItem>) {
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

