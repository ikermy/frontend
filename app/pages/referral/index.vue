<template>
  <NuxtLayout name="main">
    <div class="pt-2 h-full flex flex-col w-full mx-auto relative">
      <h1 class="font-hector text-3xl font-semibold">
        {{ $t("referral.title") }}
      </h1>
      <div class="mt-[38px] w-full flex gap-4 mobile:flex-col">
        <ReferralBalanceBlock :top-section="topSection" :bottom-section="bottomSection"
          container-class="flex-1 w-full" />
        <ReferralStatsBlock :total-label="statsBlock.totalLabel" :total-count="statsBlock.totalCount"
          :levels="statsBlock.levels" container-class="flex-1 w-full" />
      </div>
      <div class="mt-4 w-full">
        <ReferralProgramCard :title="programCard.title" :commission-rules="programCard.commissionRules"
          :referral-link="programCard.referralLink" :copy-button-text="programCard.copyButtonText"
          container-class="w-full" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import ReferralBalanceBlock from "~/features/referral/ReferralBalanceBlock.vue";
import ReferralStatsBlock from "~/features/referral/ReferralStatsBlock.vue";
import ReferralProgramCard from "~/features/referral/ReferralProgramCard.vue";
import { useMoneyFormatting } from "~/shared/composables/useMoneyFormatting";
import { getReferralService } from "~/shared/api";
import { useReferralStore } from "~/shared/store";

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();
const { formatTotalBalance } = useMoneyFormatting();
const referralService = getReferralService();
const referralStore = useReferralStore();

// Load referral data from API if not already loaded
onMounted(async () => {
  if (!referralStore.hasBalance || !referralStore.hasStats || !referralStore.hasProgram) {
    try {
      await Promise.all([
        referralService.getBalance(),
        referralService.getStats(),
        referralService.getProgram(),
      ]);
    } catch (error) {
      console.error("Failed to load referral data:", error);
    }
  }
});

const topSection = computed(() => ({
  label: t("referral.totally_earned"),
  value: formatTotalBalance(referralStore.balance?.totallyEarned || 0, "USD"),
}));

const bottomSection = computed(() => ({
  label: t("referral.unclaimed_balance"),
  value: formatTotalBalance(referralStore.balance?.unclaimedBalance || 0, "USD"),
  buttonText: t("referral.transfer"),
  buttonColor: "white" as const,
  buttonTextColor: "dark" as const,
  onButtonClick: () => {
    router.push(localePath("/referral/transfer"));
  },
}));

const statsBlock = computed(() => {
  if (!referralStore.stats) {
    return {
      totalLabel: t("referral.totally_invited"),
      totalCount: "0",
      levels: [],
    };
  }

  return {
    totalLabel: t("referral.totally_invited"),
    totalCount: referralStore.stats.totalCount,
    levels: referralStore.stats.levels.map((level: any) => ({
      label: level.label,
      count: level.count,
      showInfoIcon: level.showInfoIcon,
      infoText: level.infoText,
    })),
  };
});

const programCard = computed(() => {
  if (!referralStore.program) {
    return {
      title: t("referral.program_title"),
      commissionRules: [
        t("referral.rule_1"),
        t("referral.rule_2"),
        t("referral.rule_3"),
      ],
      referralLink: "",
      copyButtonText: t("referral.copy"),
    };
  }

  return {
    title: referralStore.program.title || t("referral.program_title"),
    commissionRules: referralStore.program.commissionRules || [
      t("referral.rule_1"),
      t("referral.rule_2"),
      t("referral.rule_3"),
    ],
    referralLink: referralStore.program.referralLink,
    copyButtonText: referralStore.program.copyButtonText || t("referral.copy"),
  };
});
</script>
