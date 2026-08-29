<template>
  <form class="flex flex-col gap-2 w-full max-w-lg">
    <Input placeholder="Email" />

    <Button
      size="md"
      :color="isDark ? 'white' : 'primary'"
      text-color="dark"
      class="w-full mt-14"
    >
      {{ $t("forgot_password.send_code") }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import Button from "@/shared/ui/Button.vue";
import Input from "~/shared/ui/Input.vue";

const isDark = computed(() => useColorMode().value === "dark");
</script>
