/**
 * Lookup Service
 * Handles lookup-related API calls
 */

import { getApiClient } from "../client";
import { apiConfig } from "~/shared/config/api.config";
import type { LookupItem, ApiResponse } from "../types";
import { mockLookupItems } from "../mocks";
import { useLookupStore } from "~/shared/store";

export class LookupService {
  private client = getApiClient();
  private store = useLookupStore();

  /**
   * Get lookup items list
   */
  async getItems(): Promise<ApiResponse<LookupItem[]>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<LookupItem[]>;

      if (this.client.getMode() === "mock") {
        await new Promise(resolve => setTimeout(resolve, 300));
        response = {
          data: mockLookupItems,
        };
      } else {
        response = await this.client.get<LookupItem[]>(
          apiConfig.endpoints.lookup.list,
          "barcodegen"
        );
      }

      this.store.setItems(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to load lookup items";
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Get lookup item by ID
   */
  async getItem(id: string): Promise<ApiResponse<LookupItem>> {
    if (this.client.getMode() === "mock") {
      await new Promise(resolve => setTimeout(resolve, 200));
      const item = mockLookupItems.find(i => i.id === id);
      if (!item) {
        throw new Error("Item not found");
      }
      return {
        data: item,
      };
    }

    return this.client.get<LookupItem>(apiConfig.endpoints.lookup.get(id), "barcodegen");
  }

  /**
   * Create lookup item
   */
  async createItem(data: any): Promise<ApiResponse<LookupItem>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<LookupItem>;

      if (this.client.getMode() === "mock") {
        await new Promise(resolve => setTimeout(resolve, 500));
        const dateStr =
          new Date().toISOString().split("T")[0] ||
          new Date().toISOString().substring(0, 10);
        const newItem: LookupItem = {
          id: Date.now().toString(),
          title: (data?.title as string) || "Lookup ID",
          status: "Success",
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: dateStr,
        };
        response = {
          data: newItem,
        };
      } else {
        response = await this.client.post<LookupItem>(
          apiConfig.endpoints.lookup.create,
          data,
          "barcodegen"
        );
      }

      this.store.addItem(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create lookup item";
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }
}

// Singleton instance
let lookupServiceInstance: LookupService | null = null;

export function getLookupService(): LookupService {
  if (!lookupServiceInstance) {
    lookupServiceInstance = new LookupService();
  }
  return lookupServiceInstance;
}
