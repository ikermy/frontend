<template>
  <div class="flex flex-col gap-12 w-full">
    <div class="flex justify-between items-center w-full">
      <div class="flex gap-1 items-center">
        <img
          src="assets/svg/dark/Chevron-Left.svg"
          alt="back"
          @click="emit('setIsForgotPasswordModalOpen')"
        />
        <h3 class="font-medium text-[24px]">
          {{ $t("forgot_password.title") }}
        </h3>
      </div>
      <img
        src="assets/svg/dark/Frame 1041.svg"
        alt="close"
        class="cursor-pointer"
        @click="emit('update:isOpen', false)"
      />
    </div>
    <div class="flex flex-col gap-2 text-text-tertiary text-center">
      <p class="max-w-[320px] mx-auto">
        {{ $t("confirm.desc") }} <span class="text-white">email@email.com</span>
      </p>
      <input
        placeholder="Code"
        class="bg-bg-tertiary rounded-[12px] h-11 font-semibold placeholder:font-semibold placeholder:text-text-tertiary p-3 border-none focus:outline-none focus:ring-0"
      />
    </div>
    <div class="flex flex-col gap-2">
      <Button color="white" text-color="dark" class="h-11">
        {{ $t("confirm.reset_password") }}
      </Button>
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
