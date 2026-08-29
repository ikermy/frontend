<template>
  <div class="flex flex-col gap-4">
    <h3 class="font-medium text-lg text-white">
      {{ title }}
    </h3>

    <div class="flex flex-col md:flex-row gap-4 items-center">
      <!-- Verification Cards -->
      <div class="flex flex-col gap-2 w-full md:w-1/2">
        <MRZVerificationCard
          v-for="(card, index) in verificationCards"
          :key="index"
          :label="card.label"
          :logo-text="card.logoText"
          :icon="card.icon"
          :logo-bg-class="card.logoBgClass"
        />
      </div>

      <!-- Validation Section -->
      <div class="flex flex-col gap-4 w-full md:w-1/2 md:items-center md:justify-center">
        <Button
          color="primary"
          text-color="dark"
          class="px-6 py-3 text-base font-semibold w-[383px]"
          :on-click="onValidate"
        >
          {{ validateButtonText }}
        </Button>

        <div class="flex flex-col gap-1 items-center text-center">
          <p class="text-text-tertiary text-xs">
            {{ packagePlanText }}
          </p>
          <p class="text-text-tertiary text-xs">
            {{ payAsYouGoText }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import MRZVerificationCard from "./MRZVerificationCard.vue";

interface VerificationCard {
  label: string;
  logoText?: string;
  icon?: string;
  logoBgClass?: string;
}

interface Props {
  title?: string;
  verificationCards?: VerificationCard[];
  validateButtonText?: string;
  packagePlanText?: string;
  payAsYouGoText?: string;
  onValidate?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "MRZ Verification",
  verificationCards: () => [],
  validateButtonText: "Run Barcode Validation",
  packagePlanText: "If you have a package plan, 1 barcode will be deducted",
  payAsYouGoText: "If you pay as you go, $5 will be debited from your balance",
  onValidate: undefined,
});
</script>

