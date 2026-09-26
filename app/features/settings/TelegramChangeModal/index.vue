<template>
  <UDrawer
    v-if="isMobile"
    :open="props.isOpen"
    class="bg-bg-secondary border-bg-secondary rounded-[12px]"
    :ui="{ overlay: 'bg-black/75' }"
    @update:open="emit('update:isOpen', $event)"
  >
    <template #header>
      <Content
        v-on:update:is-open="emit('update:isOpen', $event)"
        v-on:success="emit('success')"
      />
    </template>
  </UDrawer>
  <UModal
    v-else
    :open="props.isOpen"
    class="bg-bg-secondary border-bg-secondary rounded-[12px]"
    :ui="{ overlay: 'bg-black/75' }"
    @update:open="emit('update:isOpen', $event)"
  >
    <template #header>
      <Content
        v-on:update:is-open="emit('update:isOpen', $event)"
        v-on:success="emit('success')"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import Content from "./content.vue";

const props = defineProps<{
  isOpen: boolean;
}>();

const isMobile = ref(false);

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);

  onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
  });
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "success"): void;
}>();
</script>
