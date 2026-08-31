/**
 * Notifications Service
 * Handles notifications-related API calls
 */

import { getApiClient } from '../client';
import { apiConfig } from '~/shared/config/api.config';
import type { Notification, ApiResponse } from '../types';
import { mockNotifications } from '../mocks';
import { useNotificationsStore } from '~/shared/store';

export class NotificationsService {
  private client = getApiClient();
  private store = useNotificationsStore();

  /**
   * Get notifications list
   */
  async getNotifications(filters?: { categoryId?: string; type?: string }): Promise<ApiResponse<Notification[]>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<Notification[]>;

      if (this.client.getMode() === 'mock') {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let filtered = [...mockNotifications];
        
        if (filters?.categoryId) {
          filtered = filtered.filter(n => n.categoryId === filters.categoryId);
        }
        
        if (filters?.type) {
          filtered = filtered.filter(n => n.type === filters.type);
        }
        
        response = {
          data: filtered,
        };
      } else {
        const params = new URLSearchParams();
        if (filters?.categoryId) params.append('categoryId', filters.categoryId);
        if (filters?.type) params.append('type', filters.type);
        
        const endpoint = `${apiConfig.endpoints.notifications.list}?${params.toString()}`;
        response = await this.client.get<Notification[]>(endpoint, "history");
      }

      this.store.setNotifications(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load notifications';
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<ApiResponse<void>> {
    try {
      let response: ApiResponse<void>;

      if (this.client.getMode() === 'mock') {
        await new Promise(resolve => setTimeout(resolve, 200));
        response = {
          data: undefined,
        };
      } else {
        response = await this.client.post<void>(apiConfig.endpoints.notifications.markRead(id), "history");
      }

      this.store.markAsRead(id);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to mark notification as read';
      this.store.setError(errorMessage);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse<void>> {
    try {
      let response: ApiResponse<void>;

      if (this.client.getMode() === 'mock') {
        await new Promise(resolve => setTimeout(resolve, 200));
        response = {
          data: undefined,
        };
      } else {
        response = await this.client.post<void>(apiConfig.endpoints.notifications.markAllRead, "history");
      }

      this.store.markAllAsRead();
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to mark all notifications as read';
      this.store.setError(errorMessage);
      throw error;
    }
  }
}

// Singleton instance
let notificationsServiceInstance: NotificationsService | null = null;

export function getNotificationsService(): NotificationsService {
  if (!notificationsServiceInstance) {
    notificationsServiceInstance = new NotificationsService();
  }
  return notificationsServiceInstance;
}

