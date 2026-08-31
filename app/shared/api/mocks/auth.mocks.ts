/**
 * Auth Mocks
 */

import type {
  AuthSession,
  AuthTokens,
  TelegramAuthData,
  TelegramAuthResult,
} from "../types";

export const mockAuthTokens: AuthTokens = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
};

export const mockAuthSession: AuthSession = {
  token: "mock-access-token",
  refreshToken: "mock-refresh-token",
  user: {
    id: "mock-user-1",
    email: "demo@example.com",
    fullName: "Demo User",
  },
};

// --- Telegram OAuth mock ---
// Имитирует реальный Telegram-виджет: генерирует те же GET-параметры, что Telegram
// прислал бы на data-auth-url (id, first_name, last_name, username, photo_url, auth_date, hash),
// и затем повторяет серверную проверку подписи (Step 3) + создание сессии (Step 4).

const MOCK_TELEGRAM_BOT_TOKEN = "mock-bot-token-for-dev";

/**
 * Вспомогательная функция: SHA-256 → Uint8Array (сырые байты).
 * Бэкенд Auth делает secret_key = SHA256(botToken).digest() (сырые байты),
 * поэтому key для HMAC — именно эти байты, а не hex-строка.
 */
async function sha256Bytes(input: string): Promise<Uint8Array> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(digest);
}

/** Вспомогательная функция: HMAC-SHA256 → hex (для подписи data_check_string). */
async function hmacSha256Hex(key: Uint8Array, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Формирует data_check_string строго как бэкенд Auth (telegram-auth.service.ts):
 * ключи по алфавиту (localeCompare), формат key=value, разделитель "\n".
 * Поле hash исключается; опциональные поля (last_name, username, photo_url)
 * включаются ТОЛЬКО если они непустые.
 */
function buildDataCheckString(userData: Record<string, string>): string {
  return Object.keys(userData)
    .filter(key => userData[key] !== undefined && userData[key] !== null && userData[key] !== "")
    .sort((a, b) => a.localeCompare(b))
    .map(key => `${key}=${userData[key]}`)
    .join("\n");
}

/**
 * Генерирует mock-данные Telegram и подпись hash (как сделал бы реальный сервис).
 * Важно: пустые опциональные поля (photo_url и т.п.) НЕ включаются в data_check_string,
 * иначе бэкенд Auth отклонит подпись.
 */
export async function mockTelegramAuth(botToken = MOCK_TELEGRAM_BOT_TOKEN): Promise<TelegramAuthData> {
  // Ждём немного, имитируя переход к Telegram и обратно.
  await new Promise(resolve => setTimeout(resolve, 600));

  const id = String(100000000 + Math.floor(Math.random() * 899999999));
  const userData: Record<string, string> = {
    id,
    first_name: "Telegram",
    last_name: "User",
    username: `tg_user_${id.slice(-4)}`,
    auth_date: String(Math.floor(Date.now() / 1000)),
    // photo_url намеренно не задаём (пустой) — Auth не включает его в подпись.
  };

  // Step 3: серверная проверка подписи.
  const dataCheckString = buildDataCheckString(userData);
  const secretKeyBytes = await sha256Bytes(botToken);
  const hash = await hmacSha256Hex(secretKeyBytes, dataCheckString);

  return { ...userData, hash };
}

/**
 * Проверка подписи (Step 3) — для mock возвращает true, если hash совпал с расчётным.
 */
export async function verifyTelegramAuth(
  data: TelegramAuthData,
  botToken = MOCK_TELEGRAM_BOT_TOKEN
): Promise<boolean> {
  const { hash, ...userData } = data;
  const dataCheckString = buildDataCheckString(userData as Record<string, string>);
  const secretKeyBytes = await sha256Bytes(botToken);
  const calculated = await hmacSha256Hex(secretKeyBytes, dataCheckString);
  return calculated === hash;
}

/**
 * Step 4: создание сессии. В mock-режиме возвращаем фиктивные токены,
 * имитируя то, что Auth вернул бы из telegramAuth.
 */
export async function mockTelegramSession(data: TelegramAuthData): Promise<TelegramAuthResult> {
  return {
    accessToken: `mock-tg-access-${data.id}`,
    refreshToken: `mock-tg-refresh-${data.id}`,
    isNewUser: false,
  };
}
