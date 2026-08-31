/**
 * Auth Service
 * Handles authentication API calls (sign up / sign in)
 */

import { getApiClient } from '../client';
import { apiConfig } from '~/shared/config/api.config';
import type { AuthTokens, SignInPayload, SignUpPayload, ApiResponse, UserProfile, TelegramAuthData, TelegramAuthResult } from '../types';
import { mockAuthTokens, mockTelegramAuth, mockTelegramSession } from '../mocks';

export class AuthService {
  private client = getApiClient();

  /**
   * Register a new user — POST /api/v1/auth/register → Auth Service (via BFF).
   * Возвращает токены; cookie-запись выполняет AuthStore (setToken).
   */
  async signUp(payload: SignUpPayload): Promise<ApiResponse<AuthTokens>> {
    if (this.client.getMode() === 'mock') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: mockAuthTokens };
    }

    return this.client.post<AuthTokens>(apiConfig.endpoints.auth.signUp, {
      username: payload.username,
      email: payload.email,
      password: payload.password,
    });
  }

  /**
   * Sign in an existing user — POST /api/v1/auth/login → Auth Service (via BFF).
   * Возвращает токены; cookie-запись выполняет AuthStore (setToken).
   */
  async signIn(payload: SignInPayload): Promise<ApiResponse<AuthTokens>> {
    if (this.client.getMode() === 'mock') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: mockAuthTokens };
    }

    return this.client.post<AuthTokens>(apiConfig.endpoints.auth.signIn, {
      email: payload.email,
      password: payload.password,
    });
  }

  /**
   * Telegram OAuth. Генерирует данные Telegram-виджета (id/first_name/.../hash — Step 3),
   * затем в real-режиме отправляет их в BFF → Auth (auth.telegramAuth), который проверяет
   * HMAC-подпись и возвращает настоящие токены. В mock-режиме возвращает mock-сессию.
   */
  async telegramAuth(payload?: Partial<TelegramAuthData>): Promise<ApiResponse<TelegramAuthResult>> {
    const mode = this.client.getMode();
    console.log(`[telegramAuth] mode=${mode}, hasPayload=${!!payload}`);

    if (mode === 'mock') {
      const data = await mockTelegramAuth();
      const session = await mockTelegramSession({ ...data, ...payload });
      return { data: session };
    }

    // В real-режиме данные приходят GET-параметрами на data-auth-url от реального
    // Telegram-виджета (payload). Никакая клиентская криптография здесь не нужна —
    // hash уже подписан Telegram; BFF → Auth проверит подпись.
    const data = payload ?? await mockTelegramAuth();

    // BFF → Auth.telegramAuth возвращает { access_token, refresh_token }.
    console.log(`[telegramAuth] POST ${apiConfig.endpoints.auth.telegramAuth} id=${data.id} auth_date=${data.auth_date} hash=${data.hash?.slice(0, 8)}…`);
    try {
      const { data: tokens } = await this.client.post<AuthTokens>(
        apiConfig.endpoints.auth.telegramAuth,
        {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name || "",
          username: data.username || "",
          photo_url: data.photo_url || "",
          auth_date: data.auth_date,
          hash: data.hash,
        },
      );
      console.log(`[telegramAuth] OK accessToken len=${tokens.access_token?.length}`);
      return {
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          isNewUser: false,
        },
      };
    } catch (e: any) {
      console.error(`[telegramAuth] FAILED:`, e?.message, e?.code, e?.details ?? e);
      throw e;
    }
  }

  /**
   * Sign out (best-effort на сервере; локально cookie чистит AuthStore.logout).
   */
  async signOut(): Promise<ApiResponse<{ success: boolean }>> {
    if (this.client.getMode() === 'mock') {
      return { data: { success: true } };
    }

    try {
      return await this.client.post<{ success: boolean }>(apiConfig.endpoints.auth.signOut);
    } catch {
      return { data: { success: true } };
    }
  }

  /**
   * Получить полный профиль пользователя — GET /api/v1/settings/profile (через BFF → Auth).
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    if (this.client.getMode() === 'mock') {
      return {
        data: {
          userId: 'mock-user-1',
          email: 'mock@example.com',
          username: 'mockuser',
          nickname: 'Mock User',
          photoBase64: '',
          telegramUsername: '',
          telegramId: '',
          telegramPhotoUrl: '',
          origin: 'email',
          isTelegramVerified: false,
        },
      };
    }

    return this.client.get<UserProfile>(apiConfig.endpoints.settings.get);
  }

  /**
   * Обновить Telegram username (без @) — POST /api/v1/settings/telegram (через BFF → Auth).
   */
  async updateTelegramUsername(telegramUsername: string): Promise<ApiResponse<{ success: boolean; telegramUsername: string }>> {
    if (this.client.getMode() === 'mock') {
      return { data: { success: true, telegramUsername } };
    }

    return this.client.post<{ success: boolean; telegramUsername: string }>(
      apiConfig.endpoints.settings.updateTelegram,
      { telegram: telegramUsername },
    );
  }

  /**
   * Обновить отображаемое имя (nickname) — POST /api/v1/settings/nickname (через BFF → Auth).
   */
  async updateNickname(nickname: string): Promise<ApiResponse<{ success: boolean; nickname: string }>> {
    if (this.client.getMode() === 'mock') {
      return { data: { success: true, nickname } };
    }

    return this.client.post<{ success: boolean; nickname: string }>(
      apiConfig.endpoints.settings.updateNickname,
      { nickname },
    );
  }
}

// Singleton instance
let authServiceInstance: AuthService | null = null;

export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService();
  }
  return authServiceInstance;
}
