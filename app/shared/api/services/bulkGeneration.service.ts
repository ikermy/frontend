/**
 * Bulk Generation Service
 * Handles bulk generation-related API calls
 */

import { getApiClient } from "../client";
import { apiConfig } from "~/shared/config/api.config";
import type { BulkGenerationHistoryItem, ApiResponse } from "../types";
import { mockBulkGenerationHistory } from "../mocks";
import { useBulkGenerationStore } from "~/shared/store";

export class BulkGenerationService {
  private client = getApiClient();
  private store = useBulkGenerationStore();

  /**
   * Get bulk generation history
   * Only loads if there are items in the API
   */
  async getHistory(): Promise<ApiResponse<BulkGenerationHistoryItem[]>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<BulkGenerationHistoryItem[]>;

      if (this.client.getMode() === "mock") {
        await new Promise(resolve => setTimeout(resolve, 300));
        response = {
          data: mockBulkGenerationHistory,
        };
      } else {
        response = await this.client.get<BulkGenerationHistoryItem[]>(
          apiConfig.endpoints.bulk.history
        );
      }

      // Only set items in store if there are items
      if (response.data && response.data.length > 0) {
        this.store.setItems(response.data);
      }

      return response;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to load bulk generation history";
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Upload file for bulk generation
   */
  async uploadFile(file: File): Promise<ApiResponse<any>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      const formData = new FormData();
      formData.append("file", file);

      let response: ApiResponse<any>;

      if (this.client.getMode() === "mock") {
        await new Promise(resolve => setTimeout(resolve, 500));
        response = {
          data: { success: true, fileId: Date.now().toString() },
        };
      } else {
        response = await this.client.post(apiConfig.endpoints.bulk.upload, formData);
      }

      return response;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to upload file";
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Generate barcodes from uploaded file
   */
  async generate(data: { fileId: string; options?: any }): Promise<ApiResponse<BulkGenerationHistoryItem>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<BulkGenerationHistoryItem>;

      if (this.client.getMode() === "mock") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const now = new Date();
        const newItem: BulkGenerationHistoryItem = {
          id: Date.now().toString(),
          date: now.toISOString().split("T")[0],
          batchName: `Batch ${Date.now()}`,
          type: "Purchase",
          status: "Success",
          time: now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: 600,
          currency: "USD",
        };
        response = {
          data: newItem,
        };
      } else {
        response = await this.client.post<BulkGenerationHistoryItem>(
          apiConfig.endpoints.bulk.generate,
          data
        );
      }

      // Add new item to store only if generation was successful
      if (response.data) {
        this.store.addItem(response.data);
      }

      return response;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to generate barcodes";
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Download generated file
   */
  async download(id: string, type?: "pdf417" | "128-codes" | "full"): Promise<ApiResponse<Blob>> {
    try {
      let response: ApiResponse<Blob>;

      if (this.client.getMode() === "mock") {
        await new Promise(resolve => setTimeout(resolve, 500));
        const blob = new Blob(["Mock file content"], { type: "application/zip" });
        response = {
          data: blob as any,
        };
      } else {
        const endpoint = type
          ? `${apiConfig.endpoints.bulk.download(id)}?type=${type}`
          : apiConfig.endpoints.bulk.download(id);
        response = await this.client.get<Blob>(endpoint);
      }

      return response;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to download file";
      this.store.setError(errorMessage);
      throw error;
    }
  }
}

// Singleton instance
let bulkGenerationServiceInstance: BulkGenerationService | null = null;

export function getBulkGenerationService(): BulkGenerationService {
  if (!bulkGenerationServiceInstance) {
    bulkGenerationServiceInstance = new BulkGenerationService();
  }
  return bulkGenerationServiceInstance;
}

