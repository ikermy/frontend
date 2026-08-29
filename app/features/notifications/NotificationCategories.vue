<template>
  <div class="flex flex-col gap-1">
    <NotificationCategory
      v-for="category in categories"
      :key="category.id"
      :label="category.label"
      :icon="category.icon"
      :email="category.email"
      :date="category.date"
      :badge-count="category.badgeCount"
      :rating="category.rating"
      :is-active="activeCategoryId === category.id"
      :on-click="() => selectCategory(category.id)"
    />
  </div>
</template>

<script setup lang="ts">
import NotificationCategory from "./NotificationCategory.vue";

interface Category {
  id: string;
  label: string;
  icon?: string;
  email?: string;
  date?: string;
  badgeCount?: number;
  rating?: number;
}

interface Props {
  categories: Category[];
  activeCategoryId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  activeCategoryId: undefined,
});

const emit = defineEmits<{
  (e: "update:activeCategoryId", value: string): void;
}>();

const activeCategoryId = ref(props.activeCategoryId);

watch(() => props.activeCategoryId, (newValue) => {
  activeCategoryId.value = newValue;
});

const selectCategory = (categoryId: string) => {
  activeCategoryId.value = categoryId;
  emit("update:activeCategoryId", categoryId);
};
</script>

