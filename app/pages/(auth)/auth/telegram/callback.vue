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
  // [DEBUG] фиксируем сырой query, чтобы видеть, что реально пришло от Telegram.
  const debugCtx = `[telegram-callback] path=${window.location.pathname}${window.location.search}`;
  console.log(debugCtx, "query:", JSON.stringify(route.query));

  const q = route.query;

  const id = String(q.id ?? "");
  const hash = String(q.hash ?? "");
  const authDate = String(q.auth_date ?? "");
  const firstName = String(q.first_name ?? "");

  if (!id || !hash || !authDate || !firstName) {
    console.error(debugCtx, "MISSING REQUIRED FIELDS, got:", {
      id,
      first_name: firstName,
      auth_date: authDate,
      hash: hash ? `${hash.slice(0, 8)}…` : "",
    });
    error.value = "Invalid Telegram authentication data. Please try again.";
    loading.value = false;
    return;
  }

  const payload = {
    id,
    first_name: firstName,
    last_name: String(q.last_name ?? ""),
    username: String(q.username ?? ""),
    photo_url: String(q.photo_url ?? ""),
    auth_date: authDate,
    hash,
  };
  console.log(debugCtx, "payload:", {
    ...payload,
    hash: `${payload.hash.slice(0, 8)}…`,
  });

  try {
    console.log(debugCtx, "calling telegramAuth...");
    const { data } = await getAuthService().telegramAuth(payload);
    console.log(debugCtx, "telegramAuth OK, accessToken len:", data.accessToken?.length);
    console.log(debugCtx, "token from store:", authStore.token ? "set" : "empty");

    authStore.setToken(data.accessToken);
    await authStore.loadProfile();
    console.log(debugCtx, "profile loaded, redirecting to /");
    await navigateTo(localePath("/"));
  } catch (e: any) {
    console.error(debugCtx, "telegramAuth FAILED:", e?.message, e?.code, e);
    error.value = e?.message || "Telegram sign in failed. Please try again.";
    loading.value = false;
  }
});

definePageMeta({
  layout: "empty",
});
</script>
