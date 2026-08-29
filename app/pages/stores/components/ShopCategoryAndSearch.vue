<template>
  <div class="container flex items-center justify-start gap-[100px] relative z-40" >  
    <slot />
    <div class="max-w-[769px] w-full flex items-stretch justify-center gap-3" :class="{'mx-auto': center}">
      <Button text-color="dark" color="primary" @click="isModalOpen = !isModalOpen">
        <span>Categories</span>
        <div><component :is="isModalOpen ? CloseIcon : CategoryIcon" /></div>
      </Button>
      <div class="flex items-center justify-start bg-bg-secondary rounded-xl px-3.5 flex-grow">
        <div><SearchIcon /></div>
        <Input placeholder="Search" class="w-full flex-grow"/>
      </div>
    </div>
    <ShopCategoriesModals v-if="isModalOpen" />
  </div>
</template>

<script setup lang="ts">
import Button from '~/shared/ui/Button.vue';
import Input from '~/shared/ui/Input.vue';
import CategoryIcon from '~/components/icons/CategoryIcon.vue';
import CloseIcon from '~/components/icons/CloseIcon.vue';
import SearchIcon from '~/components/icons/SearchIcon.vue';
import ShopCategoriesModals from '../modals/ShopCategoriesModals.vue';


const props = defineProps<{
  center?: boolean;
}>();

const isModalOpen = ref(false);

const BODY_MODAL_CLASS = 'modal-open';

watch(isModalOpen, (open) => {
  if (!import.meta.client) return;
  document.body.classList.toggle(BODY_MODAL_CLASS, open);
}, { immediate: true });

onUnmounted(() => {
  if (!import.meta.client) return;
  document.body.classList.remove(BODY_MODAL_CLASS);
});
</script>

<style scoped>

</style>