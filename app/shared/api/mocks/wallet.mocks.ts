/**
 * Wallet Mocks
 */

import type { WalletBalance, Transaction } from '../types';

export const mockWalletBalances: WalletBalance[] = [
  { currency: 'BTC', amount: 0.0000003, usdValue: 150 },
  { currency: 'USDT', amount: 200, usdValue: 200 },
  { currency: 'ETH', amount: 0.0003, usdValue: 50 },
  { currency: 'LTC', amount: 0.0, usdValue: 0 },
];

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    title: 'Barcode',
    date: '2025-02-10T12:03:00Z',
    category: 'Purchase',
    value: 'x12',
    status: 'Success',
  },
  {
    id: 2,
    title: 'Balance Top up',
    date: '2025-02-10T12:03:00Z',
    category: 'Top up',
    value: '$600 USD',
    status: 'Pending',
  },
  {
    id: 3,
    title: '30 barcode package',
    date: '2025-01-18T12:03:00Z',
    category: 'Purchase',
    value: 'x1',
    status: 'Canceled',
  },
  {
    id: 4,
    title: 'Store',
    date: '2025-01-18T12:03:00Z',
    category: 'Purchase',
    value: 'x1, $30 USD',
    status: 'Failed',
  },
  {
    id: 5,
    title: 'Unlimited for 168 hours',
    date: '2025-01-14T12:03:00Z',
    category: 'Purchase',
    value: 'x1, $400 USD',
    status: 'Success',
  },
];

