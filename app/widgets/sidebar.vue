<template>
  <div class="flex gap-3">
    <div class="w-64 flex flex-col mobile:w-full tablet:w-full">
      <!-- Top Section -->
      <div class="flex items-center justify-between px-2 py-1 flex-shrink-0">
        <div class="flex items-center gap-2">
          <NuxtLink :to="getLocalizedItemPath('/')">
            <span class="text-2xl font-bold font-roboto text">LOGO</span>
          </NuxtLink>
          <span class="text-xs text-primary desktop:hidden">
            {{ t("sidebar.to_home") }}
          </span>
        </div>
        <div class="flex items-center gap-7">
          <span class="text-xs text-primary mobile:hidden tablet:hidden">{{
            t("sidebar.to_home")
          }}</span>
          <div class="flex gap-4">
            <div class="flex desktop:hidden gap-3">
              <NuxtLink :to="getLocalizedItemPath('/faqs')">
                <img :src="icons.help" alt="Help" class="w-5 h-5 brightness-150" />
              </NuxtLink>
              <NuxtLink :to="getLocalizedItemPath('/settings')">
                <img :src="icons.settings" alt="Settings" class="w-5 h-5 brightness-150" />
              </NuxtLink>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-sm">EN</span>
              <UIcon name="i-heroicons-chevron-down" class="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <!-- Balance Section -->
      <div class="bg-bg-secondary rounded-[12px] mt-3 flex-shrink-0">
        <div class="flex items-center justify-between px-4 py-3">
          <div>
            <h3 class="text-sm text-[#888888] mb-1">
              {{ t("sidebar.balance") }}
            </h3>
            <p class="text-2xl font-bold font-space-grotesk">$10,100</p>
          </div>
          <NuxtLink :to="getLocalizedItemPath('/wallet/top-up')">
            <img :src="icons.plus" alt="Add Balance" class="w-6 h-6 mb-4 cursor-pointer" />
          </NuxtLink>
        </div>
        <div class="flex w-full bg-bg-tertiary h-[1px]" />
        <div class="px-4 py-3">
          <div class="flex justify-between">
            <h3 class="text-sm text-[#888888] mb-1">
              {{ t("sidebar.barcodes") }}
            </h3>
            <p class="px-2 py-1 bg-bg-tertiary text-primary rounded-[8px] text-[10px]">
              {{ t("sidebar.in") }}
            </p>
          </div>
          <p class="text-[20px] font-space-grotesk font-bold desktop:max-w-[120px]">
            {{ t("sidebar.unlimited") }}
          </p>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav
        class="flex desktop:flex-col gap-1 desktop:overflow-y-auto mt-3 overflow-x-auto tablet:justify-between mobile:justify-between">
        <template v-for="item in sidebarItems" :key="item.path">
          <!-- Regular navigation links -->
          <NuxtLink v-if="!item.hasDropdown" :to="getLocalizedItemPath(item.path)" :class="[
            'flex flex-col desktop:flex-row items-center desktop:gap-3 px-3 py-[10px] rounded-lg min-w-fit gap-1 desktop:max-h-[40px]',
            isActive(item.path)
              ? 'bg-primary text-black font-semibold'
              : ' text-text-tertiary hover:bg-bg-tertiary',
          ]">
            <img :src="item.icon" :alt="item.label" :class="[
              'w-5 h-5',
              isActive(item.path) ? 'filter brightness-0' : '',
            ]" />
            <span class="desktop:text-left text-center w-full">{{
              item.label
            }}</span>
          </NuxtLink>

          <!-- Dropdown items -->
          <div v-else class="flex flex-col">
            <div @click="toggleDropdown(item.id)"
              class="flex items-center desktop:justify-between px-3 py-[10px] rounded-lg cursor-pointer text-text-tertiary min-w-fit hover:bg-bg-tertiary transition-colors">
              <div class="flex items-center desktop:gap-3 desktop:flex-row flex-col min-w-fit gap-1">
                <img :src="item.icon" :alt="item.label" class="w-5 h-5" />
                <span class="desktop:text-left text-center w-full">{{
                  item.label
                }}</span>
              </div>
              <UIcon :name="isDropdownOpen(item.id) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                class="h-4 w-4 hidden desktop:block" />
            </div>

            <!-- Dropdown Children -->
            <div v-if="item.children && item.children.length > 0 && isDropdownOpen(item.id)"
              class="flex flex-col ml-4 desktop:ml-0 pl-4 desktop:pl-6 border-l border-gray-700 desktop:border-l-0">
              <NuxtLink v-for="child in item.children" :key="child.id" :to="getLocalizedItemPath(child.path)" :class="[
                'flex items-center px-3 py-[10px] rounded-lg min-w-fit',
                isActive(child.path, true)
                  ? 'bg-primary text-black font-semibold'
                  : 'text-text-tertiary hover:bg-bg-tertiary',
              ]">
                <span class="desktop:text-left text-center w-full">{{
                  child.label
                }}</span>
              </NuxtLink>
            </div>
          </div>
        </template>
      </nav>

      <!-- Bottom Advertisement -->
      <div class="bg-primary rounded-[12px] mt-10 px-4 py-3 relative overflow-hidden hidden desktop:block">
        <div class="flex flex-col gap-3">
          <p class="text-mb-3 font-hector text-black max-w-[150px]">
            {{ t("sidebar.need_to_generate_barcodes") }}
          </p>
          <NuxtLink :to="getLocalizedItemPath('/generating')">
            <Button color="white" size="sm" class="text-xs max-w-[87px] h-[32px]" text-color="dark">
              {{ t("sidebar.yes_i_do") }}
            </Button>
          </NuxtLink>
          <img src="assets/svg/dark/man.svg" alt="Man" class="absolute top-2 right-[-45px] h-[126px]" />
        </div>
      </div>
    </div>
    <div class="w-[1px] bg-bg-tertiary" />
  </div>
</template>

<script setup lang="ts">
import Button from "~/shared/ui/Button.vue";
import { useSidebarMenu } from "~/shared/composables/useSidebarMenu";
import { useRouteActivity } from "~/shared/composables/useRouteActivity";
import { useAssets } from "~/shared/composables/useAssets";

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const { icons } = useAssets();

// Use sidebar menu composable
const { getVisibleItems, getLocalizedPath } = useSidebarMenu();

// Use route activity composable
const { isRouteActive } = useRouteActivity();

// Get visible menu items
const sidebarItems = computed(() => getVisibleItems());

// Dropdown state management
const openDropdowns = ref<Set<string>>(new Set());

// Open dropdown when any child is active
const checkAndOpenDropdown = () => {
  sidebarItems.value.forEach((item) => {
    if (item.hasDropdown && item.children) {
      const hasActiveChild = item.children.some((child) => isActive(child.path, true));
      if (hasActiveChild) {
        openDropdowns.value.add(item.id);
      }
    }
  });
};

onMounted(() => {
  checkAndOpenDropdown();
});

watch(() => route.path, () => {
  checkAndOpenDropdown();
});

const toggleDropdown = (itemId: string) => {
  if (openDropdowns.value.has(itemId)) {
    openDropdowns.value.delete(itemId);
  } else {
    openDropdowns.value.add(itemId);
  }
};

const isDropdownOpen = (itemId: string): boolean => {
  return openDropdowns.value.has(itemId);
};

// Check if a menu item is active
// For dropdown children, use startsWith to match sub-routes like /verification-test/create
const isActive = (path: string, isChild: boolean = false): boolean => {
  if (isChild) {
    return isRouteActive(path, { startsWith: true });
  }
  return isRouteActive(path);
};

// Get localized path for navigation
const getLocalizedItemPath = (path: string): string => {
  return getLocalizedPath(path);
};
</script>
