<template>
  <UDrawer
    v-if="isMobile"
    :open="isOpen"
    class="bg-bg-secondary border-transparent rounded-t-[24px] z-[101]"
    :ui="{ overlay: 'bg-black/75 backdrop-blur-sm' }"
    @update:open="(value) => emit('update:isOpen', value)"
  >
    <template #header>
      <div class="flex flex-col justify-between h-[392px] p-1">
        <!-- Title with Close Button -->
        <div class="flex items-start justify-between">
          <h3 class="font-semibold text-2xl text-white">
            {{ title }}
          </h3>
          <button
            @click="handleClose"
            class="w-8 h-8 flex items-center justify-center bg-bg-tertiary rounded-full hover:bg-bg-secondary transition-colors flex-shrink-0"
          >
            <UIcon
              name="i-heroicons-x-mark"
              class="w-5 h-5 text-white"
            />
          </button>
        </div>

        <!-- Content with Icon -->
        <div class="flex gap-4 items-center">
          <!-- Icon -->
          <div class="w-12 h-12 p-3 bg-bg-tertiary rounded-[12px] flex items-center justify-center flex-shrink-0">
            <UIcon
              :name="'i-heroicons-information-circle'"
              class="w-6 h-6 text-white"
            />
          </div>

          <!-- Description -->
          <p class="text-white text-sm leading-relaxed flex-1">
            {{ description }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col md:flex-row gap-3">
          <Button
            color="tertiary"
            text-color="white"
            class="w-full md:flex-1 px-6 py-3 text-base font-semibold"
            :on-click="handleCancel"
          >
            {{ cancelButtonText }}
          </Button>
          <Button
            color="white"
            text-color="dark"
            class="w-full md:flex-1 px-6 py-3 text-base font-semibold"
            :on-click="handleConfirm"
          >
            {{ confirmButtonText }}
          </Button>
        </div>
      </div>
    </template>
  </UDrawer>
  <UModal
    v-else
    :open="isOpen"
    class="bg-bg-secondary border-transparent rounded-[24px] z-[101]"
    style="width: 550px;"
    :ui="{ overlay: 'bg-black/75 backdrop-blur-sm' }"
    @update:open="(value) => emit('update:isOpen', value)"
  >
    <template #header>
      <div class="flex flex-col justify-between h-[287px] p-1">
        <!-- Title with Close Button -->
        <div class="flex items-start justify-between">
          <h3 class="font-semibold text-2xl text-white">
            {{ title }}
          </h3>
          <button
            @click="handleClose"
            class="w-8 h-8 flex items-center justify-center bg-bg-tertiary rounded-full hover:bg-bg-secondary transition-colors flex-shrink-0"
          >
            <UIcon
              name="i-heroicons-x-mark"
              class="w-5 h-5 text-white"
            />
          </button>
        </div>

        <!-- Content with Icon -->
        <div class="flex gap-4 items-center">
          <!-- Icon -->
          <div class="w-12 h-12 p-3 bg-bg-tertiary rounded-[12px] flex items-center justify-center flex-shrink-0">
            <UIcon
              :name="'i-heroicons-information-circle'"
              class="w-6 h-6 text-white"
            />
          </div>

          <!-- Description -->
          <p class="text-white text-sm leading-relaxed flex-1">
            {{ description }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col md:flex-row gap-3">
          <Button
            color="tertiary"
            text-color="white"
            class="w-full md:flex-1 px-6 py-3 text-base font-semibold"
            :on-click="handleCancel"
          >
            {{ cancelButtonText }}
          </Button>
          <Button
            color="white"
            text-color="dark"
            class="w-full md:flex-1 px-6 py-3 text-base font-semibold"
            :on-click="handleConfirm"
          >
            {{ confirmButtonText }}
          </Button>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";

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

interface Props {
  isOpen: boolean;
  title?: string;
  description?: string;
  icon?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Information",
  description: "",
  icon: "i-heroicons-exclamation-triangle",
  confirmButtonText: "Confirm",
  cancelButtonText: "Cancel",
  onConfirm: undefined,
  onCancel: undefined,
});

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const handleClose = () => {
  emit("update:isOpen", false);
  if (props.onCancel) {
    props.onCancel();
  }
  emit("cancel");
};

const handleCancel = () => {
  handleClose();
};

const handleConfirm = () => {
  if (props.onConfirm) {
    props.onConfirm();
  }
  emit("confirm");
  emit("update:isOpen", false);
};
</script>

