/**
 * Photo Generator Service
 * Handles photo generator-related API calls
 */

import { getApiClient } from '../client';
import { apiConfig } from '~/shared/config/api.config';
import type { PhotoGeneratorItem, ApiResponse } from '../types';
import { mockPhotoGeneratorItems } from '../mocks';
import { usePhotoGeneratorStore } from '~/shared/store';

export class PhotoGeneratorService {
  private client = getApiClient();
  private store = usePhotoGeneratorStore();

  /**
   * Get photo generator items list
   */
  async getItems(filters?: { type?: 'photo' | 'signature' }): Promise<ApiResponse<PhotoGeneratorItem[]>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<PhotoGeneratorItem[]>;

      if (this.client.getMode() === 'mock') {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let filtered = [...mockPhotoGeneratorItems];
        
        if (filters?.type) {
          filtered = filtered.filter(item => item.type === filters.type);
        }
        
        response = {
          data: filtered,
        };
      } else {
        const params = new URLSearchParams();
        if (filters?.type) params.append('type', filters.type);
        
        const endpoint = filters?.type 
          ? `${apiConfig.endpoints.photoGenerator.list}?${params.toString()}`
          : apiConfig.endpoints.photoGenerator.list;
        
        response = await this.client.get<PhotoGeneratorItem[]>(endpoint, "barcodegen");
      }

      this.store.setItems(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load photo generator items';
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Get photo generator item by ID
   */
  async getItem(id: string): Promise<ApiResponse<PhotoGeneratorItem>> {
    if (this.client.getMode() === 'mock') {
      await new Promise(resolve => setTimeout(resolve, 200));
      const item = mockPhotoGeneratorItems.find(i => i.id === id);
      if (!item) {
        throw new Error('Item not found');
      }
      return {
        data: item,
      };
    }

    return this.client.get<PhotoGeneratorItem>(apiConfig.endpoints.photoGenerator.get(id), "barcodegen");
  }

  /**
   * Create photo generator item
   */
  async createItem(data: any): Promise<ApiResponse<PhotoGeneratorItem>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<PhotoGeneratorItem>;

      if (this.client.getMode() === 'mock') {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newItem: PhotoGeneratorItem = {
          id: Date.now().toString(),
          title: data.title || 'Photo ID',
          status: 'Success',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toISOString().split('T')[0],
          type: data.type || 'photo',
        };
        response = {
          data: newItem,
        };
      } else {
        response = await this.client.post<PhotoGeneratorItem>(apiConfig.endpoints.photoGenerator.create, data, "barcodegen");
      }

      this.store.addItem(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create photo generator item';
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }
}

// Singleton instance
let photoGeneratorServiceInstance: PhotoGeneratorService | null = null;

export function getPhotoGeneratorService(): PhotoGeneratorService {
  if (!photoGeneratorServiceInstance) {
    photoGeneratorServiceInstance = new PhotoGeneratorService();
  }
  return photoGeneratorServiceInstance;
}

