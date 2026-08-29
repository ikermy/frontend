/**
 * Referral Service
 * Handles referral-related API calls
 */

import { getApiClient } from '../client';
import { apiConfig } from '~/shared/config/api.config';
import type { ReferralStats, ReferralBalance, ReferralProgram, ApiResponse } from '../types';
import { mockReferralBalance, mockReferralStats, mockReferralProgram } from '../mocks';
import { useReferralStore } from '~/shared/store';

export class ReferralService {
  private client = getApiClient();
  private store = useReferralStore();

  /**
   * Get referral balance
   */
  async getBalance(): Promise<ApiResponse<ReferralBalance>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<ReferralBalance>;

      if (this.client.getMode() === 'mock') {
        await new Promise(resolve => setTimeout(resolve, 300));
        response = {
          data: mockReferralBalance,
        };
      } else {
        response = await this.client.get<ReferralBalance>(apiConfig.endpoints.referral.balance);
      }

      this.store.setBalance(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load referral balance';
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Get referral stats
   */
  async getStats(): Promise<ApiResponse<ReferralStats>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<ReferralStats>;

      if (this.client.getMode() === 'mock') {
        await new Promise(resolve => setTimeout(resolve, 300));
        response = {
          data: mockReferralStats,
        };
      } else {
        response = await this.client.get<ReferralStats>(apiConfig.endpoints.referral.stats);
      }

      this.store.setStats(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load referral stats';
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Get referral program info
   */
  async getProgram(): Promise<ApiResponse<ReferralProgram>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<ReferralProgram>;

      if (this.client.getMode() === 'mock') {
        await new Promise(resolve => setTimeout(resolve, 300));
        response = {
          data: mockReferralProgram,
        };
      } else {
        // This endpoint might not exist in the config, so we'll use a generic approach
        response = await this.client.get<ReferralProgram>(apiConfig.endpoints.referral.stats);
      }

      this.store.setProgram(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load referral program';
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Transfer referral balance
   */
  async transfer(data: { amount: number; currency: string }): Promise<ApiResponse<any>> {
    if (this.client.getMode() === 'mock') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        data: { success: true, transactionId: Date.now() },
      };
    }

    return this.client.post(apiConfig.endpoints.referral.transfer, data);
  }
}

// Singleton instance
let referralServiceInstance: ReferralService | null = null;

export function getReferralService(): ReferralService {
  if (!referralServiceInstance) {
    referralServiceInstance = new ReferralService();
  }
  return referralServiceInstance;
}

