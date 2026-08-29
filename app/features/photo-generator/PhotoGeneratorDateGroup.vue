<template>
  <div class="flex flex-col gap-3 mb-6">
    <!-- Date Header -->
    <h3 class="font-medium text-lg text-white mb-3">
      {{ formattedDate }}
    </h3>

    <!-- Items List -->
    <div class="flex flex-col gap-2">
      <PhotoGeneratorItem
        v-for="(item, index) in items"
        :key="index"
        :title="item.title"
        :status="item.status"
        :time="item.time"
        :icon="item.icon"
        :on-click="item.onClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PhotoGeneratorItem from "./PhotoGeneratorItem.vue";

interface PhotoGeneratorItem {
  title: string;
  status: string;
  time: string;
  icon?: string;
  onClick?: () => void;
}

interface Props {
  date: string;
  items: PhotoGeneratorItem[];
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

