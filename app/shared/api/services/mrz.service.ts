/**
 * MRZ Service
 * Handles MRZ-related API calls
 */

import { getApiClient } from '../client';
import { apiConfig } from '~/shared/config/api.config';
import type { MRZItem, ApiResponse } from '../types';
import { mockMRZItems } from '../mocks';
import { useMRZStore } from '~/shared/store';

export class MRZService {
  private client = getApiClient();
  private store = useMRZStore();

  /**
   * Get MRZ items list
   */
  async getItems(): Promise<ApiResponse<MRZItem[]>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<MRZItem[]>;

      if (this.client.getMode() === 'mock') {
        await new Promise(resolve => setTimeout(resolve, 300));
        response = {
          data: mockMRZItems,
        };
      } else {
        response = await this.client.get<MRZItem[]>(apiConfig.endpoints.mrz.list, "barcodegen");
      }

      this.store.setItems(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load MRZ items';
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Get MRZ item by ID
   */
  async getItem(id: string): Promise<ApiResponse<MRZItem>> {
    if (this.client.getMode() === 'mock') {
      await new Promise(resolve => setTimeout(resolve, 200));
      const item = mockMRZItems.find(i => i.id === id);
      if (!item) {
        throw new Error('Item not found');
      }
      return {
        data: item,
      };
    }

    return this.client.get<MRZItem>(apiConfig.endpoints.mrz.get(id), "barcodegen");
  }

  /**
   * Create MRZ item
   */
  async createItem(data: any): Promise<ApiResponse<MRZItem>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<MRZItem>;

      if (this.client.getMode() === 'mock') {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newItem: MRZItem = {
          id: Date.now().toString(),
          identifier: `MRZ #${Date.now()}_${data.name || 'USER'}`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toISOString().split('T')[0],
        };
        response = {
          data: newItem,
        };
      } else {
        response = await this.client.post<MRZItem>(apiConfig.endpoints.mrz.create, data, "barcodegen");
      }

      this.store.addItem(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create MRZ item';
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Verify MRZ item
   */
  async verifyItem(id: string): Promise<ApiResponse<any>> {
    if (this.client.getMode() === 'mock') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        data: { verified: true, score: 0.95 },
      };
    }

    return this.client.post(apiConfig.endpoints.mrz.verify(id), "barcodegen");
  }
}

// Singleton instance
let mrzServiceInstance: MRZService | null = null;

export function getMRZService(): MRZService {
  if (!mrzServiceInstance) {
    mrzServiceInstance = new MRZService();
  }
  return mrzServiceInstance;
}

