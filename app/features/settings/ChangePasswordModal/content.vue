<template>
  <div class="flex flex-col gap-12 w-full">
    <div class="flex justify-between items-center w-full">
      <div class="flex gap-1 items-center">
        <!-- <img src="assets/svg/dark/Chevron-Left.svg" alt="back" /> -->
        <h3 class="font-medium text-[24px]">
          {{ $t("settings.change_password.title") }}
        </h3>
      </div>
      <img
        src="assets/svg/dark/Frame 1041.svg"
        alt="close"
        class="cursor-pointer"
        @click="emit('update:isOpen', false)"
      />
    </div>
    <div class="flex flex-col gap-2">
      <input
        :placeholder="$t('settings.change_password.old_password')"
        class="bg-bg-tertiary rounded-[12px] h-11 font-semibold placeholder:font-semibold placeholder:text-text-tertiary p-3 border-none focus:outline-none focus:ring-0"
      />
      <input
        :placeholder="$t('settings.change_password.new_password')"
        class="bg-bg-tertiary rounded-[12px] h-11 font-semibold placeholder:font-semibold placeholder:text-text-tertiary p-3 border-none focus:outline-none focus:ring-0"
      />
    </div>
    <div class="flex flex-col gap-2">
      <Button color="white" text-color="dark" class="h-11">
        {{ $t("settings.change_password.change") }}
      </Button>
      <p
        class="text-center mt-2 cursor-pointer font-semibold"
        @click="emit('setIsForgotPasswordModalOpen')"
      >
        {{ $t("settings.change_password.forgot_password") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "setIsForgotPasswordModalOpen"): void;
}>();
</script>
