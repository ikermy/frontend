<template>
  <div>
    <div class="h-screen w-full flex flex-col px-6 py-5 max-w-2xl mx-auto gap-2">
      <!-- Header -->
       <div>
         
        <div class="flex items-center justify-center gap-2 mb-6">
           <Button
             color="tertiary"
             text-color="white"
             leading-icon="i-heroicons-chevron-left"
             class="px-4 py-2 text-sm font-semibold rounded-full"
             :on-click="handleBack"
           >
             {{ $t("lookup.back") }}
           </Button>
         </div>
   
         <!-- Title -->
         <h1 class="font-hector text-3xl font-semibold text-white mb-6 text-center uppercase">
           {{ $t("lookup.title_full") }}
         </h1>

       </div>

       <div class="flex-1 flex items-center justify-center">
         <div class="w-full flex flex-col gap-8">
           <!-- Form Fields -->
           <div class="flex flex-col gap-4">
          <!-- Lookup Type Field -->
          <div class="bg-bg-secondary rounded-[12px] px-1 py-1">
            <Select
              :options="lookupTypeOptions"
              :placeholder="$t('lookup.fields.lookup_type')"
              :model-value="selectedLookupType"
              @update:model-value="selectedLookupType = $event"
              class="w-full"
            />
          </div>
   
           <!-- Full Name Field -->
           <div class="bg-bg-secondary rounded-[12px] px-1 py-1">
             <Input
               :value="fullName"
               :placeholder="$t('lookup.fields.full_name')"
               class="w-full"
               @input="(e: any) => fullName = e.target.value"
             />
           </div>
   
           <!-- Address Field -->
           <div class="bg-bg-secondary rounded-[12px] px-1 py-1">
             <Input
               :value="address"
               :placeholder="$t('lookup.fields.address')"
               class="w-full"
               @input="(e: any) => address = e.target.value"
             />
           </div>
   
           <!-- SSN Field -->
           <div class="bg-bg-secondary rounded-[12px] px-1 py-1">
             <Input
               :value="ssn"
               :placeholder="$t('lookup.fields.ssn')"
               class="w-full"
               @input="(e: any) => ssn = e.target.value"
             />
           </div>
         </div>
   
           <!-- Price Options, Divider, Total Cost -->
           <div class="flex flex-col gap-3">
             <!-- Price Options -->
             <div class="flex flex-col gap-3">
               <div
                 v-for="(option, index) in priceOptions"
                 :key="index"
                 class="flex items-center justify-between"
               >
                 <p class="text-white font-medium text-base">
                   {{ option.label }}
                 </p>
                 <p class="text-white font-medium text-base">
                   ${{ option.price.toLocaleString() }}
                 </p>
               </div>
             </div>
       
             <!-- Divider -->
             <div class="border-t border-gray-700"></div>
       
             <!-- Total Cost -->
             <div>
               <TotalCostDisplay
                 :label="$t('lookup.total')"
                 :cost="totalCost"
               />
             </div>
           </div>

           <div class="flex flex-col gap-4">
            <!-- Balance Warning -->
            <BalanceWarning
              v-if="showBalanceWarning"
              :show="showBalanceWarning"
            />
      
            <!-- Pay & Run Button -->
          <Button
            color="primary"
            text-color="dark"
            class="w-full px-6 py-3 text-base font-semibold"
            :on-click="handlePayAndRun"
          >
            {{ $t("lookup.pay_and_run") }}
          </Button>

         </div>
         </div>
       </div>
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
</template>

<script setup lang="ts">

definePageMeta({ middleware: "auth" });
import Button from "~/shared/ui/Button.vue";
import Input from "~/shared/ui/Input.vue";
import Select from "~/shared/ui/Select.vue";
import TotalCostDisplay from "~/features/photo-generator/TotalCostDisplay.vue";
import BalanceWarning from "~/features/photo-generator/BalanceWarning.vue";
import TopUpModal from "~/features/photo-generator/TopUpModal.vue";

definePageMeta({
  layout: "empty",
});

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();

const fullName = ref("");
const address = ref("");
const ssn = ref("");
const selectedLookupType = ref<string | null>(null);
const buttonClicked = ref(false);
const isTopUpModalOpen = ref(false);
const availableBalance = ref(1000); // Mock balance - should come from API

const lookupTypeOptions = [
  t("lookup.types.option1"),
  t("lookup.types.option2"),
  t("lookup.types.option3"),
];

const priceOptions = [
  {
    label: t("lookup.prices.option1"),
    price: 1000,
  },
  {
    label: t("lookup.prices.option2"),
    price: 400,
  },
  {
    label: t("lookup.prices.option3"),
    price: 100,
  },
];

const totalCost = computed(() => {
  return priceOptions.reduce((sum, option) => sum + option.price, 0);
});

const handleBack = () => {
  router.push(localePath("/lookup"));
};

const showBalanceWarning = computed(() => {
  return buttonClicked.value && !selectedLookupType.value;
});

const isFormValid = computed(() => {
  return selectedLookupType.value && 
         fullName.value.trim() !== "" && 
         address.value.trim() !== "" && 
         ssn.value.trim() !== "";
});

const handlePayAndRun = () => {
  buttonClicked.value = true;
  
  if (!selectedLookupType.value) {
    return;
  }

  if (isFormValid.value) {
    isTopUpModalOpen.value = true;
  } else {
    console.log("Pay & Run Lookup", {
      lookupType: selectedLookupType.value,
      fullName: fullName.value,
      address: address.value,
      ssn: ssn.value,
      totalCost: totalCost.value,
    });
    // Handle payment and lookup
  }
};

const handleTopUpConfirm = () => {
  console.log("Top Up and Pay & Run Lookup", {
    lookupType: selectedLookupType.value,
    fullName: fullName.value,
    address: address.value,
    ssn: ssn.value,
    totalCost: totalCost.value,
  });
  // Handle top up and lookup
};

const handleTopUpCancel = () => {
  isTopUpModalOpen.value = false;
};
</script>

