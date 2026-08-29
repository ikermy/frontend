<template>
  <div
    class="flex flex-col gap-2 bg-bg-secondary rounded-[16px] px-4 py-[14px]"
    :class="containerClass"
  >
    <!-- Top Section -->
    <div class="flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <h3 class="text-sm text-text-tertiary font-semibold">
          {{ topSection.label }}
        </h3>
        <h2 class="text-[20px] font-semibold">{{ topSection.value }}</h2>
      </div>
      <Button
        v-if="topSection.buttonText"
        :color="topSection.buttonColor || 'tertiary'"
        :text-color="topSection.buttonTextColor || 'white'"
        class="px-4 py-2 text-sm h-9"
        :on-click="topSection.onButtonClick"
      >
        {{ topSection.buttonText }}
      </Button>
    </div>

    <!-- Divider -->
    <div v-if="showDivider" class="w-full h-[1px] bg-text-secondary mt-2"></div>

    <!-- Bottom Section -->
    <div v-if="bottomSection" class="flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <h3 class="text-sm text-text-tertiary font-semibold">
          {{ bottomSection.label }}
        </h3>
        <h2 class="text-[20px] font-semibold">{{ bottomSection.value }}</h2>
      </div>
      <Button
        v-if="bottomSection.buttonText"
        :color="bottomSection.buttonColor || 'white'"
        :text-color="bottomSection.buttonTextColor || 'dark'"
        class="px-4 py-2 text-sm h-9"
        :on-click="bottomSection.onButtonClick"
      >
        {{ bottomSection.buttonText }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";

interface BalanceSection {
  label: string;
  value: string;
  buttonText?: string;
  buttonColor?: "primary" | "white" | "tertiary" | "secondary";
  buttonTextColor?: "primary" | "dark" | "white" | "negative";
  onButtonClick?: () => void;
}

interface Props {
  topSection: BalanceSection;
  bottomSection?: BalanceSection;
  showDivider?: boolean;
  containerClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showDivider: true,
  containerClass: "",
});
</script>
