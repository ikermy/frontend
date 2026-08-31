/**
 * API Types
 * Common types for API layer
 */

export type ApiMode = "mock" | "api";

export interface UserProfile {
  userId: string;
  email: string;
  username: string;
  nickname: string;
  photoBase64: string;
  telegramUsername: string;
  telegramId: string;
  telegramPhotoUrl: string;
  origin: "email" | "telegram" | string;
  isTelegramVerified: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: any;
}

// Wallet types
export interface WalletBalance {
  currency: string;
  amount: number;
  usdValue: number;
}

export interface Transaction {
  id: number;
  title: string;
  date: string;
  category: string;
  value: string;
  svg?: string;
  status: string;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  time: string;
  date: string;
  icon?: string;
  type: "update" | "news";
  categoryId: string;
}

// Photo Generator types
export interface PhotoGeneratorItem {
  id: string;
  title: string;
  status: string;
  time: string;
  date: string;
  type: "photo" | "signature";
  icon?: string;
}

// MRZ types
export interface MRZItem {
  id: string;
  identifier: string;
  time: string;
  date: string;
  icon?: string;
}

// Lookup types
export interface LookupItem {
  id: string;
  title: string;
  status: string;
  time: string;
  date: string;
}

// Verification Test types
export interface VerificationTestItem {
  id: string;
  title: string;
  status: string;
  time: string;
  date: string;
}

// Referral types
export interface ReferralStats {
  totalCount: string;
  levels: Array<{
    label: string;
    count: string;
    showInfoIcon: boolean;
    infoText: string;
  }>;
}

export interface ReferralBalance {
  totallyEarned: number;
  unclaimedBalance: number;
}

export interface ReferralProgram {
  title: string;
  commissionRules: string[];
  referralLink: string;
  copyButtonText: string;
}

// Bulk Generation types
export interface BulkGenerationHistoryItem {
  id: string;
  date: string;
  batchName: string;
  type: string;
  status: string;
  time: string;
  price: number;
  currency?: string;
}

// Auth types
export interface SignUpPayload {
  username: string;
  email: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

// Данные, которые Telegram присылает после успешного входа (data-auth-url GET-параметры).
export interface TelegramAuthData {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
}

// Ответ бэкенда telegramAuth — { accessToken, refreshToken, isNewUser }.
export interface TelegramAuthResult {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  user?: AuthUser;
}
