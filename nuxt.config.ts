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
    port: 3002,
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
    },
  },
});
