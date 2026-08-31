<template>
  <div class="flex flex-col items-center justify-center h-full gap-4 px-4 text-center">
    <p v-if="loading" class="font-inter text-text-tertiary">
      {{ $t("telegramAuth.redirecting") }}
    </p>
    <p v-else-if="error" class="font-inter text-negative">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { getAuthService } from "~/shared/api/services";
import { useAuthStore } from "~/shared/store/useAuth";

// Telegram перенаправляет сюда (data-auth-url) с GET-параметрами:
// id, first_name, last_name, username, photo_url, auth_date, hash.
const route = useRoute();
const localePath = useLocalePath();
const authStore = useAuthStore();

const loading = ref(true);
const error = ref("");

onMounted(async () => {
  const q = route.query;

  const id = String(q.id ?? "");
  const hash = String(q.hash ?? "");
  const authDate = String(q.auth_date ?? "");
  const firstName = String(q.first_name ?? "");

  if (!id || !hash || !authDate || !firstName) {
    error.value = "Invalid Telegram authentication data. Please try again.";
    loading.value = false;
    return;
  }

  try {
    const { data } = await getAuthService().telegramAuth({
      id,
      first_name: firstName,
      last_name: String(q.last_name ?? ""),
      username: String(q.username ?? ""),
      photo_url: String(q.photo_url ?? ""),
      auth_date: authDate,
      hash,
    });

    authStore.setToken(data.accessToken);
    await authStore.loadProfile();
    await navigateTo(localePath("/"));
  } catch (e: any) {
    error.value = e?.message || "Telegram sign in failed. Please try again.";
    loading.value = false;
  }
});

definePageMeta({
  layout: "empty",
});
</script>
