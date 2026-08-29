<template>
  <div class="flex gap-6 border-b border-gray-700 pb-4">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="selectTab(tab.id)"
      :class="[
        'text-base font-medium pb-1  cursor-pointer transition-all duration-300 relative',
        activeTab === tab.id
          ? 'text-white px-3'
          : 'text-text-tertiary hover:text-white'
      ]"
    >
      {{ tab.label }}
      <span
        v-if="activeTab === tab.id"
        class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  id: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  activeTab?: string;
}

const props = withDefaults(defineProps<Props>(), {
  activeTab: "all",
});

const emit = defineEmits<{
  (e: "update:activeTab", value: string): void;
}>();

const activeTab = ref(props.activeTab);

watch(() => props.activeTab, (newValue) => {
  activeTab.value = newValue;
});

const selectTab = (tabId: string) => {
  activeTab.value = tabId;
  emit("update:activeTab", tabId);
};
</script>

