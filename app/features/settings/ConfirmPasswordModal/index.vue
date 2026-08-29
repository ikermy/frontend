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
        v-on:set-is-forgot-password-modal-open="
          props.setIsForgotPasswordModalOpen()
        "
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
        v-on:set-is-forgot-password-modal-open="
          props.setIsForgotPasswordModalOpen()
        "
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import Content from "./content.vue";
const props = defineProps<{
  isOpen: boolean;
  setIsForgotPasswordModalOpen: () => void;
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
}>();
</script>
