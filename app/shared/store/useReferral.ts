import { defineStore } from "pinia";
import type {
  ReferralBalance,
  ReferralStats,
  ReferralProgram,
} from "~/shared/api/types";

export const useReferralStore = defineStore("referral", {
  state: () => ({
    balance: null as ReferralBalance | null,
    stats: null as ReferralStats | null,
    program: null as ReferralProgram | null,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    hasBalance: (state) => state.balance !== null,
    hasStats: (state) => state.stats !== null,
    hasProgram: (state) => state.program !== null,
  },

  actions: {
    setBalance(balance: ReferralBalance) {
      this.balance = balance;
    },

    setStats(stats: ReferralStats) {
      this.stats = stats;
    },

    setProgram(program: ReferralProgram) {
      this.program = program;
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

