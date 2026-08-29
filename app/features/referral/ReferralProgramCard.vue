<template>
  <div
    class="flex flex-col gap-4 bg-transparent border border-[#292929] rounded-[16px] px-4 py-[14px]"
    :class="containerClass"
  >
    <!-- Title -->
    <h2 class="text-xl font-semibold font-hector">{{ title }}</h2>

    <!-- Commission Rules List -->
    <ul v-if="commissionRules && commissionRules.length > 0" class="flex flex-col gap-2">
      <li
        v-for="(rule, index) in commissionRules"
        :key="index"
        class="flex items-center gap-2"
      >
        <span class="text-primary text-lg font-bold">•</span>
        <p class="text-sm text-text-tertiary flex-1">{{ rule }}</p>
      </li>
    </ul>

    <!-- Referral Link Section -->
    <div v-if="referralLink" class="flex gap-3 mt-2 bg-gray-dark rounded-[12px] p-3">
      <input
        :value="referralLink"
        type="text"
        readonly
        class="flex-1 rounded-[12px] h-10 font-semibold text-white bg-gray-dark border-none focus:outline-none focus:ring-0"
      />
      <Button
        color="tertiary"
        text-color="white"
        class="px-4 py-2 text-sm h-10 min-w-[80px]"
        :on-click="handleCopy"
      >
        {{ copyButtonText }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";

interface Props {
  title: string;
  commissionRules?: string[];
  referralLink?: string;
  copyButtonText?: string;
  containerClass?: string;
  onCopy?: (link: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  copyButtonText: "Copy",
  containerClass: "",
  commissionRules: () => [],
  referralLink: "",
  onCopy: undefined,
});

const handleCopy = () => {
  if (props.referralLink) {
    navigator.clipboard.writeText(props.referralLink);
    if (props.onCopy) {
      props.onCopy(props.referralLink);
    }
  }
};
</script>
