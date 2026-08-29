<template>
  <form class="flex flex-col gap-2 w-full max-w-lg">
    <Input placeholder="Email" />
    <Input placeholder="Password" />

    <Button
      size="md"
      :color="isDark ? 'white' : 'primary'"
      text-color="dark"
      class="w-full mt-14"
    >
      {{ $t("sign_in.title") }}
    </Button>
    <NuxtLink
      :to="localePath('/registration')"
      class="text-center mt-2 cursor-pointer font-semibold"
    >
      {{ $t("sign_in.or_create_account") }}
    </NuxtLink>
  </form>
</template>

<script setup lang="ts">
import Button from "@/shared/ui/Button.vue";
import Input from "~/shared/ui/Input.vue";

const localePath = useLocalePath();
const isDark = computed(() => useColorMode().value === "dark");
</script>
