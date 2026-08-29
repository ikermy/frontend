<template>
  <form class="flex flex-col gap-2 w-full max-w-lg">
    <Input placeholder="Full name" />
    <Input placeholder="Email" />
    <Input placeholder="Password" />

    <Button
      size="md"
      :color="isDark ? 'white' : 'primary'"
      text-color="dark"
      class="w-full mt-14"
    >
      {{ $t("continue") }}
    </Button>
    <NuxtLink
      :to="localePath('/sign-in')"
      class="text-center mt-2 cursor-pointer font-semibold"
    >
      {{ $t("registration.or_sign_in") }}
    </NuxtLink>
  </form>
</template>

<script setup lang="ts">
import Button from "@/shared/ui/Button.vue";
import Input from "~/shared/ui/Input.vue";

const localePath = useLocalePath();
const isDark = computed(() => useColorMode().value === "dark");
</script>
