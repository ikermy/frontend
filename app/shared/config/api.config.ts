/**
 * API Configuration
 * Centralized configuration for all API endpoints and service targets.
 *
 * Маршрутизация:
 *   - auth → BFF (через /api/v1, проксирует в Auth Service)
 *   - barcodegen, billing, ai, history → напрямую в соответствующие сервисы
 */

// Префиксы vite-proxy в dev (см. nuxt.config.ts vite.server.proxy).
// В проде фронт ходит к сервисам через Envoy или прямые docker-имена.
export const serviceURLs = {
  barcodegen: process.env.NUXT_PUBLIC_BARCODEGEN_URL || "/barcodegen",
  billing: process.env.NUXT_PUBLIC_BILLING_URL || "/billing",
  ai: process.env.NUXT_PUBLIC_AI_URL || "/ai",
  history: process.env.NUXT_PUBLIC_HISTORY_URL || "/history",
};

export const apiConfig = {
  // Base API URL (BFF) — /api/v1
  baseURL: process.env.NUXT_PUBLIC_API_BASE_URL || "/api/v1",

  // API endpoints
  endpoints: {
    // Auth (через BFF, baseURL = /api/v1)
    auth: {
      signIn: "/auth/login",
      signUp: "/auth/register",
      signOut: "/auth/logout",
      refresh: "/auth/refresh",
      forgotPassword: "/auth/forgot-password",
      resetPassword: "/auth/reset-password",
      confirm: "/auth/confirm",
      telegramAuth: "/auth/telegram",
    },

    // Barcodes (→ barcodegen)
    barcodes: {
      list: "/barcodes",
      get: (id: string) => `/barcodes/${id}`,
      create: "/barcodes",
      update: (id: string) => `/barcodes/${id}`,
      delete: (id: string) => `/barcodes/${id}`,
      history: "/barcodes/history",
    },

    // MRZ (→ barcodegen)
    mrz: {
      list: "/mrz",
      get: (id: string) => `/mrz/${id}`,
      create: "/mrz",
      verify: (id: string) => `/mrz/${id}/verify`,
    },

    // Bulk Generation (→ barcodegen)
    bulk: {
      upload: "/bulk/upload",
      generate: "/bulk/generate",
      history: "/bulk/history",
      download: (id: string) => `/bulk/${id}/download`,
    },

    // Photo Generator (→ barcodegen/ai)
    photoGenerator: {
      create: "/photo-generator",
      list: "/photo-generator",
      get: (id: string) => `/photo-generator/${id}`,
    },

    // Lookup (→ barcodegen)
    lookup: {
      create: "/lookup",
      list: "/lookup",
      get: (id: string) => `/lookup/${id}`,
    },

    // Wallet (→ billing)
    wallet: {
      balance: "/wallet/balance",
      transactions: "/wallet/transactions",
      topUp: "/wallet/top-up",
      packages: "/wallet/packages",
      subscription: "/wallet/subscription",
    },

    // Referral (→ billing)
    referral: {
      stats: "/referral/stats",
      balance: "/referral/balance",
      transfer: "/referral/transfer",
    },

    // Notifications (→ history)
    notifications: {
      list: "/notifications",
      markRead: (id: string) => `/notifications/${id}/read`,
      markAllRead: "/notifications/read-all",
    },

    // Settings
    settings: {
      get: "/settings/profile",
      update: "/settings",
      changePassword: "/settings/password",
      uploadAvatar: "/settings/avatar",
      updateTelegram: "/settings/telegram",
      updateNickname: "/settings/nickname",
    },

    // Store Orders (→ history)
    storeOrders: {
      list: "/store-orders",
      get: (id: string) => `/store-orders/${id}`,
    },

    // Verification Test (→ barcodegen)
    verificationTest: {
      create: "/verification-test",
      list: "/verification-test",
      get: (id: string) => `/verification-test/${id}`,
      download: (id: string) => `/verification-test/${id}/download`,
    },
  },
};
