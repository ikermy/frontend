<template>
  <div
    class="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
    :class="[
      isActive
        ? 'bg-bg-tertiary text-white'
        : 'text-text-tertiary hover:bg-bg-tertiary',
    ]"
    @click="handleClick"
  >
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <!-- Icon -->
      <div
        class="w-10 h-10 bg-bg-secondary rounded-[12px] flex items-center justify-center flex-shrink-0"
      >
        <img
          v-if="icon"
          :src="icon"
          :alt="label"
          class="w-5 h-5 brightness-0 invert"
        />
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-1 flex-1 min-w-0">
        <p class="text-sm font-medium truncate text-white">{{ label }}</p>
        <div
          v-if="email || rating"
          class="text-xs text-text-tertiary truncate flex items-center gap-1 "
        >
          <span>{{ newReview }}</span>
          <span v-if="rating" class="text-xs">{{ starsDisplay }}</span>
          <span>{{ from }}</span>
          <span v-if="email">{{ email }}</span>
        </div>
      </div>
    </div>

    <!-- Badge and Date -->
    <div class="flex items-end flex-col gap-2 flex-shrink-0">
      <!-- Badge -->
      <div
        v-if="badgeCount"
        class="w-5 h-5 bg-primary rounded-full flex items-center justify-center"
      >
        <span class="text-black text-xs font-semibold">{{ badgeCount }}</span>
      </div>
      <!-- Date -->
      <span
        v-if="date"
        class="text-xs text-text-tertiary whitespace-nowrap"
      >
        {{ date }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  icon?: string;
  email?: string;
  date?: string;
  badgeCount?: number;
  rating?: number;
  newReview?: string;
  from?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  email: undefined,
  date: undefined,
  badgeCount: undefined,
  rating: undefined,
  newReview: "New Review:",
  from: "from",
  isActive: false,
  onClick: undefined,
});

const starsDisplay = computed(() => {
  if (!props.rating) return "";
  return "★".repeat(props.rating);
});

const handleClick = () => {
  if (props.onClick) {
    props.onClick();
  }
};
</script>

