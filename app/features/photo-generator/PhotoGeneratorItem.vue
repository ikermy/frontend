<template>
  <div
    class="group flex items-center justify-between gap-3 px-4 py-3 bg-bg-secondary rounded-[12px] hover:bg-bg-tertiary transition-colors cursor-pointer"
    @click="handleClick"
  >
    <!-- Icon -->
    <div
      class="w-10 h-10 bg-bg-tertiary group-hover:bg-bg-secondary rounded-[12px] flex items-center justify-center flex-shrink-0"
    >
      <img
        v-if="icon"
        :src="icon"
        :alt="title"
        class="w-7 h7 brightness-0 invert"
      />
      <UIcon
        v-else
        name="i-heroicons-camera"
        class="w-5 h-5 text-white"
      />
    </div>

    <!-- Title and Status -->
    <div class="flex-1 min-w-0 flex flex-col gap-1">
      <p class="text-white font-medium text-base leading-relaxed">
        {{ title }}
      </p>
      <p :class="statusClass">
        {{ status }}
      </p>
    </div>

    <!-- Time -->
    <div class="flex-shrink-0">
      <p class="text-text-secondary text-xs font-medium whitespace-nowrap">
        {{ time }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  status: string;
  time: string;
  icon?: string;
  onClick?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  onClick: undefined,
});

const statusClass = computed(() => {
  if (props.status === "Success") {
    return "text-primary text-xs font-medium";
  } else if (props.status === "Error") {
    return "text-negative text-xs font-medium";
  } else {
    return "text-text-tertiary text-xs font-medium";
  }
});

const handleClick = () => {
  if (props.onClick) {
    props.onClick();
  }
};
</script>

