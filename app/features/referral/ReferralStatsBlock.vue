<template>
  <div
    class="flex flex-col gap-2 bg-bg-secondary rounded-[16px] px-4 py-[14px]"
    :class="containerClass"
  >
    <!-- Top Section - Totally Invited -->
    <div class="flex flex-col gap-1">
      <h3 class="text-sm text-text-tertiary font-semibold">
        {{ totalLabel }}
      </h3>
      <h2 class="text-[20px] font-semibold">{{ totalCount }}</h2>
    </div>


    <!-- Bottom Section - Levels -->
    <div v-if="levels && levels.length > 0" class="flex gap-4">
      <div
        v-for="(level, index) in levels"
        :key="index"
        class="flex flex-col gap-1 flex-1"
        :class="index < levels.length - 1 ? 'border-r border-text-secondary pr-4' : ''"
      >
        <div class="flex items-center gap-2">
          <h3 class="text-sm text-text-tertiary font-semibold">
            {{ level.label }}
          </h3>
          <div
            v-if="level.showInfoIcon"
            class="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-primary flex items-center justify-center cursor-pointer flex-shrink-0"
            :title="level.infoText || ''"
          >
            <span class="text-black text-xs font-bold">?</span>
          </div>
        </div>
        <h2 class="text-[20px] font-semibold">{{ level.count }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ReferralLevel {
  label: string;
  count: string | number;
  showInfoIcon?: boolean;
  infoText?: string;
}

interface Props {
  totalLabel: string;
  totalCount: string | number;
  levels?: ReferralLevel[];
  containerClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  containerClass: "",
  levels: () => [],
});
</script>
