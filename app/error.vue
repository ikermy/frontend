<template>
  <NuxtLayout name="empty">
    <div class="flex flex-col items-center justify-center min-h-screen error-page" :style="errorPageStyle" v-if="statusCode === '404'">
      <h1 class="lg:text-[140px] md:text-[190px] text-[48px] font-hector leading-none">404</h1>
      <p class="lg:text-[32px] text-[24px] mb-10">Page not found</p>
      <Button color="white" text-color="dark" class="max-w-[148px] w-full" :on-click="goToHome">Go to home</Button>
    </div>
    <div class="error-page" :style="errorPageStyle" v-else>  
      <div class="container">
        <div class="flex flex-col items-center justify-center min-h-screen ">
          <h1 class="lg:text-[64px] text-[32px] font-hector leading-none lg:mb-10 mb-4">Something's wrong.</h1>
          <p class="lg:text-xl mb-4 font-semibold">Error code 504</p>
          <span class="block max-w-[525px] mx-auto text-center font-medium mb-12">There was an error on the server. We are already working on fixing it.
            Try refreshing the page or logging in later.</span>
          <Button color="white" text-color="dark" class="max-w-[148px] w-full" :on-click="goToHome">Back to home</Button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Button from '~/shared/ui/Button.vue';
import { useAssets } from '~/shared/composables/useAssets';

const statusCode = ref<string>('504');
const localePath = useLocalePath();
const router = useRouter();
const { backgrounds } = useAssets();

const windowWidth = ref(0);

onMounted(() => {
  if (process.client) {
    windowWidth.value = window.innerWidth;
    const updateWidth = () => {
      windowWidth.value = window.innerWidth;
    };
    window.addEventListener('resize', updateWidth);
    onUnmounted(() => {
      window.removeEventListener('resize', updateWidth);
    });
  }
});

const goToHome = () => {
  router.push(localePath('/'));
};

const errorPageStyle = computed(() => {
  const isMobile = windowWidth.value <= 480;
  const isTablet = windowWidth.value <= 1024 && windowWidth.value > 480;
  
  let bgImage = backgrounds.error;
  if (isMobile) {
    bgImage = backgrounds.errorMobile;
  } else if (isTablet) {
    bgImage = backgrounds.errorTablet;
  }
  
  return {
    backgroundImage: `url('${bgImage}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
});

</script>

<style scoped>
.error-page {
  /* Background styles are applied via :style binding */
}
</style>