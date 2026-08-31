<template>
  <div class="w-full px-9 py-[24px] flex justify-between items-center relative header">
    <NuxtLink :to="localePath('/')">
      <h1 class="text-2xl font-roboto uppercase font-bold cursor-pointer">
        Logo
      </h1>
    </NuxtLink>
    <div
      class="gap-[30px] absolute right-0 w-full justify-center hidden desktop:flex pointer-events-none">
      <NuxtLink :to="localePath('/')" class="pointer-events-auto"> {{ t("home.home") }} </NuxtLink>
      <NuxtLink :to="localePath('/barcodes')" class="pointer-events-auto"> {{ t("home.store") }} </NuxtLink>
      <NuxtLink :to="localePath('/mrz')" class="pointer-events-auto"> {{ t("home.discussion") }} </NuxtLink>
      <NuxtLink :to="localePath('/mrz')" class="pointer-events-auto"> {{ t("home.faq") }} </NuxtLink>
    </div>
    <div class="flex gap-[10px] desktop:gap-[20px] items-center justify-between relative z-10">
      <div class="items-center hidden desktop:flex gap-1">
        <span class="text-sm">EN</span>
        <UIcon name="i-heroicons-chevron-down" class="h-4 w-4" />
      </div>
      <NuxtLink :to="localePath('/lookup')" aria-label="Search">
        <img :src="icons.button" alt="Search" class="cursor-pointer my-auto w-9 pt-[6px]" />
      </NuxtLink>
      <div class="border-bg-tertiary border-[1px] rounded-[16px] px-[14px] py-3 font-semibold text-sm">
        <h4>1700 <span class="text-text-tertiary">$</span></h4>
      </div>
      <NuxtLink :to="localePath('/stores/basket')" aria-label="Cart" class="relative block cursor-pointer">
        <img :src="icons.minus" alt="Cart" class="w-6 h-6" />
        <div
          class="absolute top-[-5px] right-[-5px] w-4 h-4 bg-bg-secondary rounded-[12px] flex items-center justify-center p-2">
          <p class="text-[8px] font-semibold">13</p>
        </div>
      </NuxtLink>
      <template v-if="authStore.isAuthenticated">
        <div class="relative hidden desktop:block">
          <button
            class="cursor-pointer flex items-center gap-2"
            @click="isAccountOpen = !isAccountOpen"
          >
            <div
              v-if="authStore.avatarSource"
              class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
              <img
                :src="authStore.avatarSource"
                alt="Account"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-xs font-bold uppercase">
              {{ initials }}
            </div>
          </button>

          <!-- Account dropdown -->
          <div
            v-if="isAccountOpen"
            class="absolute right-0 mt-2 w-64 bg-bg-secondary border border-bg-tertiary rounded-[12px] shadow-lg z-50 overflow-hidden"
            @click.stop
          >
            <NuxtLink :to="localePath('/settings')" class="block p-4 hover:bg-bg-tertiary/40">
              <div class="flex items-center gap-3">
                <div
                  v-if="authStore.avatarSource"
                  class="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    :src="authStore.avatarSource"
                    alt="Account"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center text-sm font-bold uppercase shrink-0">
                  {{ initials }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold truncate">{{ displayName }}</p>
                  <p v-if="authStore.profile.email" class="text-xs text-text-secondary truncate">
                    {{ authStore.profile.email }}
                  </p>
                </div>
              </div>
              <p v-if="telegramHandle" class="mt-3 flex items-center gap-2 text-xs font-medium">
                <img :src="icons.telegram" alt="Telegram" class="w-4 h-4" />
                {{ telegramHandle }}
              </p>
            </NuxtLink>
            <div class="border-t border-bg-tertiary">
              <NuxtLink
                :to="localePath('/settings')"
                class="block px-4 py-3 text-sm hover:bg-bg-tertiary/40 cursor-pointer"
              >
                {{ t("settings.title") || "Settings" }}
              </NuxtLink>
              <button
                class="w-full text-left px-4 py-3 text-sm text-negative hover:bg-bg-tertiary/40 cursor-pointer"
                @click="handleLogout"
              >
                {{ t("header.logout") }}
              </button>
            </div>
          </div>
        </div>
        <button
          class="cursor-pointer font-semibold text-sm hover:text-text-tertiary hidden desktop:block"
          @click="handleLogout"
        >
          {{ t("header.logout") }}
        </button>
      </template>
      <template v-else>
        <NuxtLink :to="localePath('/sign-in')" aria-label="Sign in">
          <img :src="icons.account" alt="Sign in" class="cursor-pointer my-auto w-8 mt-[6px] hidden desktop:block" />
        </NuxtLink>
      </template>
      <img v-if="!burgerMenuStore.isOpen" :src="icons.menuLineHorizontal" alt="Search"
        class="cursor-pointer my-auto w-9 mt-[6px] block desktop:hidden" @click="burgerMenuStore.toggle()" />
      <img v-if="burgerMenuStore.isOpen" :src="icons.close" alt="Search"
        class="cursor-pointer my-auto w-9 mt-[6px] block desktop:hidden" @click="burgerMenuStore.toggle()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBurgerMenuStore } from "~/shared/store/useBurgerMenu";
import { useAuthStore } from "~/shared/store/useAuth";
import { useAssets } from "~/shared/composables/useAssets";

const burgerMenuStore = useBurgerMenuStore();
const authStore = useAuthStore();
const { icons } = useAssets();

const localePath = useLocalePath();
const { t } = useI18n();

// Инициалы для аватара (из email до @, первые буквы)
const initials = computed(() => {
  const email = authStore.token ? atob(authStore.token.split(".")[1] || "").match(/"email":"([^"]+)"/)?.[1] : "";
  if (!email) return "U";
  const local = email.split("@")[0];
  return (local.slice(0, 2) || "U").toUpperCase();
});

const displayName = computed(() => authStore.displayName || initials.value);
const telegramHandle = computed(() => authStore.telegramHandle || "");

// Открытие/закрытие account-выпадающего меню
const isAccountOpen = ref(false);

// Закрываем dropdown при навигации
watch(
  () => useRoute().fullPath,
  () => {
    isAccountOpen.value = false;
  }
);

async function handleLogout() {
  await authStore.logout();
  await navigateTo(localePath("/"));
}
</script>
