/**
 * Wallet Service
 * Handles wallet-related API calls
 */

import { getApiClient } from '../client';
import { apiConfig } from '~/shared/config/api.config';
import type { WalletBalance, Transaction, ApiResponse } from '../types';
import { mockWalletBalances, mockTransactions } from '../mocks';
import { useWalletStore } from '~/shared/store';

export class WalletService {
  private client = getApiClient();
  private store = useWalletStore();

  /**
   * Get wallet balances
   */
  async getBalances(): Promise<ApiResponse<WalletBalance[]>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<WalletBalance[]>;

      if (this.client.getMode() === 'mock') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        response = {
          data: mockWalletBalances,
        };
      } else {
        response = await this.client.get<WalletBalance[]>(apiConfig.endpoints.wallet.balance, "billing");
      }

      this.store.setBalances(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load balances';
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Get transaction history
   */
  async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    this.store.setLoading(true);
    this.store.clearError();

    try {
      let response: ApiResponse<Transaction[]>;

      if (this.client.getMode() === 'mock') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        response = {
          data: mockTransactions,
        };
      } else {
        response = await this.client.get<Transaction[]>(apiConfig.endpoints.wallet.transactions, "billing");
      }

      this.store.setTransactions(response.data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load transactions';
      this.store.setError(errorMessage);
      throw error;
    } finally {
      this.store.setLoading(false);
    }
  }

  /**
   * Top up wallet
   */
  async topUp(data: { amount: number; currency: string; paymentMethod: string }): Promise<ApiResponse<any>> {
    if (this.client.getMode() === 'mock') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        data: { success: true, transactionId: Date.now() },
      };
    }

    return this.client.post(apiConfig.endpoints.wallet.topUp, data, "billing");
  }

  /**
   * Get packages
   */
  async getPackages(): Promise<ApiResponse<any[]>> {
    if (this.client.getMode() === 'mock') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        data: [],
      };
    }

    return this.client.get(apiConfig.endpoints.wallet.packages, "billing");
  }

  /**
   * Get subscription info
   */
  async getSubscription(): Promise<ApiResponse<any>> {
    if (this.client.getMode() === 'mock') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        data: {},
      };
    }

    return this.client.get(apiConfig.endpoints.wallet.subscription, "billing");
  }
}

// Singleton instance
let walletServiceInstance: WalletService | null = null;

export function getWalletService(): WalletService {
  if (!walletServiceInstance) {
    walletServiceInstance = new WalletService();
  }
  return walletServiceInstance;
}

