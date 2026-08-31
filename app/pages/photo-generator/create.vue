<template>
  <div>
    <div class="h-screen w-full flex flex-col px-6 py-5 max-w-2xl mx-auto mobile:px-4 mobile:py-4">
      <!-- Header Section - Top -->
      <div class="flex-shrink-0 mobile:flex-shrink-0 desktop:h-[20%]">
        <!-- Header -->
        <div class="flex items-center justify-center gap-2 mb-6 mobile:mb-4">
          <Button
            color="tertiary"
            text-color="white"
            leading-icon="i-heroicons-chevron-left"
            class="px-4 py-2 text-sm font-semibold rounded-full"
            :on-click="handleBack"
          >
            {{ $t("photo-generator.back") }}
          </Button>
        </div>
  
        <!-- Title -->
        <h1 class="font-hector text-3xl font-semibold text-white mb-6 text-center mobile:text-2xl mobile:mb-4">
          {{ $t("photo-generator.title") }}
        </h1>
        <!-- Unit Toggle -->
        <div class="mb-6 flex justify-center mobile:mb-4">
          <UnitToggle
            :units="units"
            :active-unit="activeUnit"
            @update:active-unit="activeUnit = $event"
          />
        </div>
      </div>

      <!-- Main Content - Center on Mobile -->
      <div class="flex-1 flex flex-col justify-center desktop:justify-center mobile:justify-center mobile:min-h-0">
        <div v-if="popUpValid" class="flex flex-col gap-6 mb-6">
          <div class="flex items-center gap-2 bg-bg-secondary rounded-[12px] px-4 py-3">
            <Input
              :value="lastName"
              :placeholder="$t('photo-generator.fields.last_name')"
              type="text"
              class="flex-1"
              @input="(e: any) => lastName = e.target.value"
            />
          </div>

          <div class="mobile:hidden">
            <!-- Total Cost -->
            <div class="mb-6 mx-3">
              <TotalCostDisplay
                :label="$t('photo-generator.total')"
                :cost="totalCost + 1000"
              />
            </div>
  
            <Button
            color="primary"
            text-color="dark"
            class="w-full px-6 py-3 text-base font-semibold"
            :on-click="handleGenerate"
          >
            {{ $t("photo-generator.generate_photo") }}
          </Button>
          </div>

        </div>
  
        <!-- Form Fields -->
        <div v-else class="flex flex-col gap-4 mb-6 mobile:mb-0 mobile:gap-3">
          <!-- Height Field -->
          <div class="flex items-center gap-2 bg-bg-secondary rounded-[12px] px-4 py-3">
            <Input
              :value="height"
              :placeholder="$t('photo-generator.fields.height')"
              type="number"
              class="flex-1"
              @input="(e: any) => height = e.target.value"
            />
            <span class="text-white font-medium text-sm flex-shrink-0">{{ activeUnit.toUpperCase() }}</span>
          </div>
  
          <!-- Eye Color Field -->
          <div class="bg-bg-secondary rounded-[12px] px-4 py-3">
            <Select
              :options="eyeColorOptions"
              :placeholder="$t('photo-generator.fields.eye_color')"
              class="w-full"
            />
          </div>
  
          <!-- Hair Color Field -->
          <div class="bg-bg-secondary rounded-[12px] px-4 py-3">
            <Select
              :options="hairColorOptions"
              :placeholder="$t('photo-generator.fields.hair_color')"
              class="w-full"
            />
          </div>
  
          <!-- Background Field -->
          <div class="bg-bg-secondary rounded-[12px] px-4 py-3">
            <Select
              :options="backgroundOptions"
              :placeholder="$t('photo-generator.fields.background')"
              class="w-full"
            />
          </div>
          
          <!-- Desktop: Total, Warning, Button -->
          <div class="mobile:hidden">
            <!-- Total Cost -->
            <div class="mt-6 mx-3">
              <TotalCostDisplay
                :label="$t('photo-generator.total')"
                :cost="totalCost"
              />
            </div>
      
            <!-- Balance Warning -->
            <div class="mb-6">
              <BalanceWarning
                :show="showBalanceWarning"
                :title="$t('photo-generator.balance_warning.title')"
                :available-balance="availableBalance"
                :required-amount="totalCost"
              />
            </div>
      
            <!-- Generate Button -->
            <Button
              color="primary"
              text-color="dark"
              class="w-full px-6 py-3 text-base font-semibold"
              :on-click="handleGenerate"
            >
              {{ $t("photo-generator.generate_photo") }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Mobile Footer - Bottom: Total, Warning, Button -->
      <!-- For popUpValid state -->
      <div v-if="popUpValid" class="flex-shrink-0 hidden mobile:flex flex-col gap-4 mt-auto pb-4">
        <!-- Total Cost -->
        <div class="mx-3">
          <TotalCostDisplay
            :label="$t('photo-generator.total')"
            :cost="totalCost + 1000"
          />
        </div>

        <!-- Generate Button -->
        <Button
          color="primary"
          text-color="dark"
          class="w-full px-6 py-3 text-base font-semibold"
          :on-click="handleGenerate"
        >
          {{ $t("photo-generator.generate_photo") }}
        </Button>
      </div>

      <!-- For normal form state -->
      <div v-if="!popUpValid" class="flex-shrink-0 hidden mobile:flex flex-col gap-4 mt-auto pb-4">
        <!-- Total Cost -->
        <div class="mx-3">
          <TotalCostDisplay
            :label="$t('photo-generator.total')"
            :cost="totalCost"
          />
        </div>

        <!-- Balance Warning -->
        <div>
          <BalanceWarning
            :show="showBalanceWarning"
            :title="$t('photo-generator.balance_warning.title')"
            :available-balance="availableBalance"
            :required-amount="totalCost"
          />
        </div>

        <!-- Generate Button -->
        <Button
          color="primary"
          text-color="dark"
          class="w-full px-6 py-3 text-base font-semibold"
          :on-click="handleGenerate"
        >
          {{ $t("photo-generator.generate_photo") }}
        </Button>
      </div>

      <!-- Top Up Modal -->
      <TopUpModal
        :is-open="isTopUpModalOpen"
        :title="$t('photo-generator.top_up.title')"
        :selected-currency="'BTC'"
        :wallet-address="'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'"
        :btc-amount="0.0000032432"
        :usd-amount="321"
        :current-balance="availableBalance"
        :balance-label="$t('photo-generator.top_up.current_balance')"
        :confirm-button-text="$t('photo-generator.top_up.confirm_button')"
        :cancel-button-text="$t('photo-generator.top_up.cancel_button')"
        @update:is-open="isTopUpModalOpen = $event"
        @confirm="handleTopUpConfirm"
        @cancel="handleTopUpCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({ middleware: "auth" });
import Button from "~/shared/ui/Button.vue";
import Input from "~/shared/ui/Input.vue";
import Select from "~/shared/ui/Select.vue";
import UnitToggle from "~/features/photo-generator/UnitToggle.vue";
import TotalCostDisplay from "~/features/photo-generator/TotalCostDisplay.vue";
import BalanceWarning from "~/features/photo-generator/BalanceWarning.vue";
import TopUpModal from "~/features/photo-generator/TopUpModal.vue";

definePageMeta({
  layout: "empty",
});

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();

const activeUnit = ref("cm");
const height = ref("");

const lastName = ref("");

const units = [
  {
    id: "cm",
    label: "CM",
  },
  {
    id: "in",
    label: "IN",
  },
];

const eyeColorOptions = [
  t("photo-generator.options.brown"),
  t("photo-generator.options.blue"),
  t("photo-generator.options.green"),
  t("photo-generator.options.hazel"),
];

const hairColorOptions = [
  t("photo-generator.options.black"),
  t("photo-generator.options.brown"),
  t("photo-generator.options.blonde"),
  t("photo-generator.options.red"),
];

const backgroundOptions = [
  t("photo-generator.options.white"),
  t("photo-generator.options.blue"),
  t("photo-generator.options.gray"),
];

const totalCost = ref(2500);
const availableBalance = ref(1000); // Mock balance - should come from API
const isTopUpModalOpen = ref(false);

const popUpValid = ref(false);

const showBalanceWarning = computed(() => {
  return availableBalance.value < totalCost.value;
});

const handleBack = () => {
  router.push(localePath("/photo-generator"));
};

const handleGenerate = () => {
  if (availableBalance.value < totalCost.value) {
    isTopUpModalOpen.value = true;
  } else {
    console.log("Generate photo", {
      unit: activeUnit.value,
      height: height.value,
      totalCost: totalCost.value,
    });
    // Navigate to generation page or trigger generation
  }
};

const handleTopUpConfirm = () => {
  popUpValid.value = true;
  console.log("Top Up and Generate");
  // Handle top up and generate
};

const handleTopUpCancel = () => {
  isTopUpModalOpen.value = false;
};
</script>

