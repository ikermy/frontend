<template>
  <div class="flex flex-col gap-3 mb-6">
    <!-- Date Header -->
    <h3 class="font-medium text-lg text-white mb-3">
      {{ formattedDate }}
    </h3>

    <!-- MRZ Items List -->
    <div class="flex flex-col gap-2">
      <MRZItem
        v-for="(item, index) in items"
        :key="index"
        :identifier="item.identifier"
        :time="item.time"
        :icon="item.icon"
        :on-click="item.onClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MRZItem from "./MRZItem.vue";

interface MRZItem {
  identifier: string;
  time: string;
  icon?: string;
  onClick?: () => void;
}

interface Props {
  date: string;
  items: MRZItem[];
}

const props = defineProps<Props>();

const formattedDate = computed(() => {
  try {
    const dateObj = new Date(props.date);
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return props.date;
  }
});
</script>

