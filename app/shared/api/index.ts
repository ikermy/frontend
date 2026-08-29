/**
 * API Layer Index
 * Centralized export of API layer
 */

// Client
export { getApiClient, ApiClient } from './client';

// Services
export {
  getWalletService,
  WalletService,
  getNotificationsService,
  NotificationsService,
  getPhotoGeneratorService,
  PhotoGeneratorService,
  getMRZService,
  MRZService,
  getLookupService,
  LookupService,
  getVerificationTestService,
  VerificationTestService,
  getReferralService,
  ReferralService,
  getBulkGenerationService,
  BulkGenerationService,
} from './services';

// Types
export type * from './types';

// Mocks (for testing/development)
export * from './mocks';

