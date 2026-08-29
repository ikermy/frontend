<template>
  <div
    class="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-700 hover:bg-bg-tertiary transition-colors cursor-pointer"
    @click="handleClick"
  >
    <!-- Icon -->
    <div
      class="w-10 h-10 bg-bg-tertiary rounded-[12px] flex items-center justify-center flex-shrink-0"
    >
      <img
        v-if="icon"
        :src="icon"
        :alt="title"
        class="w-5 h-5 brightness-0 invert"
      />
      <UIcon
        v-else
        name="i-heroicons-barcode"
        class="w-5 h-5 text-white"
      />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <p class="text-white font-medium text-sm leading-relaxed">
        {{ title }}
      </p>
      <p class="text-text-tertiary text-xs font-medium whitespace-nowrap">
        {{ time }}
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  time: string;
  icon?: string;
  onClick?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  onClick: undefined,
});

const handleClick = () => {
  if (props.onClick) {
    props.onClick();
  }
};
</script>

