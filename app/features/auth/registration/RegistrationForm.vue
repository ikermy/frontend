<template>
  <form class="flex flex-col gap-2 w-full max-w-lg" @submit.prevent="handleSubmit">
    <input
      v-model="username"
      type="text"
      placeholder="Username"
      class="rounded-[12px] h-10 font-semibold placeholder:font-semibold placeholder:text-text-tertiary bg-bg-secondary p-3 border-none focus:outline-none focus:ring-0"
    />
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      class="rounded-[12px] h-10 font-semibold placeholder:font-semibold placeholder:text-text-tertiary bg-bg-secondary p-3 border-none focus:outline-none focus:ring-0"
    />
    <input
      v-model="password"
      type="password"
      placeholder="Password"
      class="rounded-[12px] h-10 font-semibold placeholder:font-semibold placeholder:text-text-tertiary bg-bg-secondary p-3 border-none focus:outline-none focus:ring-0"
    />

    <p v-if="errorMessage" class="text-negative text-sm font-medium mt-2">
      {{ errorMessage }}
    </p>

    <Button
      size="md"
      :color="isDark ? 'white' : 'primary'"
      text-color="dark"
      class="w-full mt-14"
      :loading="loading"
      :on-click="handleSubmit"
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
import { getAuthService } from "~/shared/api/services";

const localePath = useLocalePath();
const isDark = computed(() => useColorMode().value === "dark");

const username = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  if (!username.value || !email.value || !password.value) {
    errorMessage.value = "Please fill in all fields";
    return;
  }

  loading.value = true;
  errorMessage.value = "";

  try {
    await getAuthService().signUp({
      username: username.value,
      email: email.value,
      password: password.value,
    });
    await navigateTo(localePath("/sign-in"));
  } catch (error: any) {
    errorMessage.value = error.message || "Registration failed. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>
