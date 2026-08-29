/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

export const apiConfig = {
  // Base API URL - should be set via environment variables
  baseURL: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:3000",

  // API endpoints
  endpoints: {
    // Auth
    auth: {
      signIn: "/api/auth/signin",
      signUp: "/api/auth/signup",
      signOut: "/api/auth/signout",
      refresh: "/api/auth/refresh",
      forgotPassword: "/api/auth/forgot-password",
      resetPassword: "/api/auth/reset-password",
      confirm: "/api/auth/confirm",
    },

    // Barcodes
    barcodes: {
      list: "/api/barcodes",
      get: (id: string) => `/api/barcodes/${id}`,
      create: "/api/barcodes",
      update: (id: string) => `/api/barcodes/${id}`,
      delete: (id: string) => `/api/barcodes/${id}`,
      history: "/api/barcodes/history",
    },

    // MRZ
    mrz: {
      list: "/api/mrz",
      get: (id: string) => `/api/mrz/${id}`,
      create: "/api/mrz",
      verify: (id: string) => `/api/mrz/${id}/verify`,
    },

    // Bulk Generation
    bulk: {
      upload: "/api/bulk/upload",
      generate: "/api/bulk/generate",
      history: "/api/bulk/history",
      download: (id: string) => `/api/bulk/${id}/download`,
    },

    // Photo Generator
    photoGenerator: {
      create: "/api/photo-generator",
      list: "/api/photo-generator",
      get: (id: string) => `/api/photo-generator/${id}`,
    },

    // Lookup
    lookup: {
      create: "/api/lookup",
      list: "/api/lookup",
      get: (id: string) => `/api/lookup/${id}`,
    },

    // Wallet
    wallet: {
      balance: "/api/wallet/balance",
      transactions: "/api/wallet/transactions",
      topUp: "/api/wallet/top-up",
      packages: "/api/wallet/packages",
      subscription: "/api/wallet/subscription",
    },

    // Referral
    referral: {
      stats: "/api/referral/stats",
      balance: "/api/referral/balance",
      transfer: "/api/referral/transfer",
    },

    // Notifications
    notifications: {
      list: "/api/notifications",
      markRead: (id: string) => `/api/notifications/${id}/read`,
      markAllRead: "/api/notifications/read-all",
    },

    // Settings
    settings: {
      get: "/api/settings",
      update: "/api/settings",
      changePassword: "/api/settings/password",
      uploadAvatar: "/api/settings/avatar",
    },

    // Store Orders
    storeOrders: {
      list: "/api/store-orders",
      get: (id: string) => `/api/store-orders/${id}`,
    },

    // Verification Test
    verificationTest: {
      create: "/api/verification-test",
      list: "/api/verification-test",
      get: (id: string) => `/api/verification-test/${id}`,
      download: (id: string) => `/api/verification-test/${id}/download`,
    },
  },
};
