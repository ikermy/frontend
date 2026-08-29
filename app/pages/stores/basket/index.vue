<template>
  <div class="page">
    <div class="container">
      <div class="mb-10">
        <NuxtLink :to="$localePath('/stores')" class="flex items-center gap-2 lg:mb-7 mb-6">
          <div class="size-8 flex items-center justify-center bg-gray-dark rounded-full"><BackIcon /></div>
          <span class="lg:text-xl">Basket</span>
        </NuxtLink>
      </div>
      <div>
        <div class="flex justify-between items-center bg-gray-dark px-3.5 py-2.5 rounded-[20px]">
          <div class="flex items-center gap-5">
            <div class="flex items-center justify-center size-9 bg-[#292929] rounded-[12px]">
              <DiscountIcon/>
            </div>
            <span>Discounted items </span>
          </div>
          <span class="text-sm text-primary font-semibold">2 days left</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DiscountIcon from '~/components/icons/DiscountIcon.vue';
import BackIcon from '~/components/icons/BackIcon.vue';

</script>

<style scoped>

</style>