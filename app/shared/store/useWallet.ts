import { defineStore } from "pinia";
import type { WalletBalance, Transaction } from "~/shared/api/types";

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    balances: [] as WalletBalance[],
    transactions: [] as Transaction[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    totalBalance: (state) => {
      return state.balances.reduce((total, balance) => total + balance.usdValue, 0);
    },
    hasBalances: (state) => state.balances.length > 0,
    hasTransactions: (state) => state.transactions.length > 0,
  },

  actions: {
    setBalances(balances: WalletBalance[]) {
      this.balances = balances;
    },

    setTransactions(transactions: Transaction[]) {
      this.transactions = transactions;
    },

    addTransaction(transaction: Transaction) {
      this.transactions.unshift(transaction);
    },

    updateTransaction(id: number, updates: Partial<Transaction>) {
      const index = this.transactions.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.transactions[index] = { ...this.transactions[index], ...updates };
      }
    },

    removeTransaction(id: number) {
      const index = this.transactions.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.transactions.splice(index, 1);
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

