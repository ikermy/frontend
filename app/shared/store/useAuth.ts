/**
 * Auth Store — состояние авторизации (токены, вход/выход).
 * Токены хранятся в cookie (см. AuthService), здесь — реактивное состояние.
 */
import { defineStore } from "pinia";
import { getAuthService } from "~/shared/api/services";

const ACCESS_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "" as string,
    initialized: false,
    profile: {
      userId: "",
      email: "",
      username: "",
      nickname: "",
      photoBase64: "",
      telegramUsername: "",
      telegramId: "",
      telegramPhotoUrl: "",
      origin: "",
      isTelegramVerified: false,
    },
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    displayName(state) {
      return state.profile.nickname || state.profile.username || state.profile.email.split("@")[0] || "";
    },
    telegramHandle(state) {
      return state.profile.telegramUsername ? `@${state.profile.telegramUsername}` : "";
    },
    // Аккаунт создан через Telegram — смена пароля/full name/telegram недоступна.
    isTelegramAccount(state) {
      return state.profile.origin === "telegram" || state.profile.isTelegramVerified;
    },
    // Аватар: загруженная фото > фото из Telegram.
    avatarSource(state) {
      return state.profile.photoBase64 || state.profile.telegramPhotoUrl || "";
    },
  },

  actions: {
    /** Инициализация из cookie (вызывается при старте приложения). */
    init() {
      this.token = getCookie(ACCESS_TOKEN_KEY);
      this.initialized = true;
    },

    /** Установить токен после логина/регистрации. */
    setToken(token: string) {
      this.token = token;
      setCookie(ACCESS_TOKEN_KEY, token, 7);
    },

    /** Загрузить полный профиль (email, имя, фото, telegram) из BFF → Auth. */
    async loadProfile() {
      if (!this.token) return;
      try {
        const { data } = await getAuthService().getProfile();
        this.profile = {
          userId: data.userId || "",
          email: data.email || "",
          username: data.username || "",
          nickname: data.nickname || "",
          photoBase64: data.photoBase64 || "",
          telegramUsername: data.telegramUsername || "",
          telegramId: data.telegramId || "",
          telegramPhotoUrl: data.telegramPhotoUrl || "",
          origin: data.origin || "",
          isTelegramVerified: !!data.isTelegramVerified,
        };
      } catch (error) {
        // Профиль недоступен (например, истёк токен) — оставляем текущие данные.
      }
    },

    /** Выйти из системы. */
    logout() {
      clearCookie(ACCESS_TOKEN_KEY);
      clearCookie(REFRESH_TOKEN_KEY);
      this.token = "";
      this.profile = {
        userId: "",
        email: "",
        username: "",
        nickname: "",
        photoBase64: "",
        telegramUsername: "",
        telegramId: "",
        telegramPhotoUrl: "",
        origin: "",
        isTelegramVerified: false,
      };
    },
  },
});

// --- Cookie helpers (на клиенте; вне setup-контекста) ---

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${date.toUTCString()}; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
