<template>
  <div class="flex gap-3">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="selectTab(tab.id)"
      :class="[
        'px-6 py-2 text-sm font-semibold rounded-[12px] cursor-pointer transition-colors flex justify-center items-center',
        activeTab === tab.id
          ? 'bg-white text-black hover:opacity-85'
          : 'bg-bg-secondary text-white hover:bg-bg-tertiary'
      ]"
      style="width: 126.67px; height: 44px;"
    >
      {{ tab.label }}
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

