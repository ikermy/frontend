import { defineStore } from "pinia";
import type { GeneratedBarcodeItem, RevisionSchema } from "~/shared/api/types";

export interface GeneratedBarcodeRecord extends GeneratedBarcodeItem {
  revision: string;
  createdAt: string;
}

export const useBarcodeGenerationStore = defineStore("barcodeGeneration", {
  state: () => ({
    items: [] as GeneratedBarcodeRecord[],
    schema: null as RevisionSchema | null,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    hasItems: state => state.items.length > 0,
  },

  actions: {
    setSchema(schema: RevisionSchema | null) {
      this.schema = schema;
    },

    addBarcodes(revision: string, barcodes: GeneratedBarcodeItem[]) {
      const createdAt = new Date().toISOString();
      this.items.unshift(
        ...barcodes.map(b => ({ ...b, revision, createdAt }))
      );
    },

    clear() {
      this.items = [];
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
