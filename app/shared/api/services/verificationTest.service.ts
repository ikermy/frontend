/**
 * Verification Test Service
 * Handles verification test-related API calls
 */

import { getApiClient } from '../client';
import { apiConfig } from '~/shared/config/api.config';
import type { VerificationTestItem, ApiResponse } from '../types';
import { mockVerificationTestItems } from '../mocks';
import { useVerificationTestStore } from '~/shared/store';

export class VerificationTestService {
  private client = getApiClient();
  private store = useVerificationTestStore();

  /**
   * Get verification test items list
   */
  async getItems(): Promise<ApiResponse<VerificationTestItem[]>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<VerificationTestItem[]>;

      if (this.client.getMode() === 'mock') {
        await new Promise(resolve => setTimeout(resolve, 300));
        response = {
          data: mockVerificationTestItems,
        };
      } else {
        response = await this.client.get<VerificationTestItem[]>(apiConfig.endpoints.verificationTest.list, "barcodegen");
      }

      this.store.setItems(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load verification test items';
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Get verification test item by ID
   */
  async getItem(id: string): Promise<ApiResponse<VerificationTestItem>> {
    if (this.client.getMode() === 'mock') {
      await new Promise(resolve => setTimeout(resolve, 200));
      const item = mockVerificationTestItems.find(i => i.id === id);
      if (!item) {
        throw new Error('Item not found');
      }
      return {
        data: item,
      };
    }

    return this.client.get<VerificationTestItem>(apiConfig.endpoints.verificationTest.get(id), "barcodegen");
  }

  /**
   * Create verification test item
   */
  async createItem(data: any): Promise<ApiResponse<VerificationTestItem>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<VerificationTestItem>;

      if (this.client.getMode() === 'mock') {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newItem: VerificationTestItem = {
          id: Date.now().toString(),
          title: data.title || 'Verification ID',
          status: 'Success',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toISOString().split('T')[0],
        };
        response = {
          data: newItem,
        };
      } else {
        response = await this.client.post<VerificationTestItem>(apiConfig.endpoints.verificationTest.create, data, "barcodegen");
      }

      this.store.addItem(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create verification test item';
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Download verification test result
   */
  async downloadResult(id: string): Promise<ApiResponse<Blob>> {
    if (this.client.getMode() === 'mock') {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Return mock blob
      const blob = new Blob(['Mock file content'], { type: 'application/pdf' });
      return {
        data: blob as any,
      };
    }

    return this.client.get<Blob>(apiConfig.endpoints.verificationTest.download(id), "barcodegen");
  }
}

// Singleton instance
let verificationTestServiceInstance: VerificationTestService | null = null;

export function getVerificationTestService(): VerificationTestService {
  if (!verificationTestServiceInstance) {
    verificationTestServiceInstance = new VerificationTestService();
  }
  return verificationTestServiceInstance;
}

