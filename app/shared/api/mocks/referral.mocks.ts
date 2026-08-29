/**
 * Referral Mocks
 */

import type { ReferralStats, ReferralBalance, ReferralProgram } from '../types';

export const mockReferralBalance: ReferralBalance = {
  totallyEarned: 1000,
  unclaimedBalance: 600,
};

export const mockReferralStats: ReferralStats = {
  totalCount: '321',
  levels: [
    {
      label: 'Level 1 referrals',
      count: '100',
      showInfoIcon: true,
      infoText: 'Level 1 referrals info',
    },
    {
      label: 'Level 2 referrals',
      count: '100',
      showInfoIcon: true,
      infoText: 'Level 2 referrals info',
    },
    {
      label: 'Level 3 referrals',
      count: '121',
      showInfoIcon: true,
      infoText: 'Level 3 referrals info',
    },
  ],
};

export const mockReferralProgram: ReferralProgram = {
  title: 'Referral Program',
  commissionRules: [
    'Rule 1',
    'Rule 2',
    'Rule 3',
  ],
  referralLink: 'Https/:www.Linkhere2909302',
  copyButtonText: 'Copy',
};

