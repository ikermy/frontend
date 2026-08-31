import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  // devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "nuxt-swiper",
  ],

  devServer: {
    // Порт можно переопределить через NUXT_PORT (в docker-контейнере это 80).
    port: Number(process.env.NUXT_PORT) || 3002,
  },
  fonts: {
    families: [{ name: "Space Grotesk", provider: "google" }],
  },
  i18n: {
    langDir: "locales",
    defaultLocale: "en",
    locales: [{ code: "en", name: "English", file: "en.json" }],
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
  ssr: false,
  css: ["~/assets/css/main.css", "swiper/css", "swiper/css/thumbs"],
  vite: {
    server: {
      allowedHosts: process.env.NUXT_ALLOWED_HOSTS
        ? process.env.NUXT_ALLOWED_HOSTS.split(",")
        : [],
      // Dev: проксируем /api/v1 → BFF (в docker-сети barcode_shared).
      // Только для локальной разработки; в проде тот же origin через Envoy.
      proxy: {
        "/api/v1": {
          target: process.env.NUXT_PROXY_API_TARGET || "http://bff:8080",
          changeOrigin: true,
        },
        // Прямые вызовы сервисов (в проде — через Envoy/прямые docker-имена)
        "/barcodegen": {
          target: process.env.NUXT_PROXY_BARCODEGEN_TARGET || "http://barcodegen:8080",
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/barcodegen/, ""),
        },
        "/billing": {
          target: process.env.NUXT_PROXY_BILLING_TARGET || "http://billing:3000",
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/billing/, ""),
        },
        "/ai": {
          target: process.env.NUXT_PROXY_AI_TARGET || "http://ai-service:8080",
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/ai/, ""),
        },
        "/history": {
          target: process.env.NUXT_PROXY_HISTORY_TARGET || "http://history:3000",
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/history/, ""),
        },
      },
    },
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    // Private keys (only available on server-side)
    // apiSecret: process.env.API_SECRET,

    // Public keys (exposed to client-side)
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "/api/v1",
      apiMode: process.env.NUXT_PUBLIC_API_MODE || "mock",
      // Telegram OAuth: data-telegram-login (без @) и data-auth-url (redirect после входа).
      // Используются реальным Telegram-виджетом в deploy; сейчас — конфиг для mock.
      telegramBotUsername: process.env.NUXT_PUBLIC_TELEGRAM_BOT_USERNAME || "",
      telegramAuthUrl: process.env.NUXT_PUBLIC_TELEGRAM_AUTH_URL || "",
    },
  },
});
