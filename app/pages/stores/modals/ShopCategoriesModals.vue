<template>
  <div class="modal absolute top-[calc(100%+24px)] left-0 w-full h-dvh bg-bg-secondary z-100">
    <div class="max-w-[772px] mx-auto flex gap-2.5">
      <div>
        <ul class="flex flex-col gap-2 pt-9 pr-3 border-r border-[#292929] h-dvh">
          <li v-for="item in 5" :key="item">
            <NuxtLink 
              text-color="dark"
              color="primary"
              class="flex items-center gap-8 parent-link px-3 py-2.5 text-[#A6A6A6] rounded-[12px] hover:bg-primary hover:text-gray-dark transition-all"
              :to="`/stores/${item}`">
              <div class="flex items-center gap-2">
                <div class="flex items-center justify-center"><TempCatIcon /></div>
                <span>Category name</span>
              </div>
              <div class="flex items-center justify-center -mb-1"><ChevronIcon /></div>
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div>
        <ul class="grid lg:grid-cols-3 pt-9 pl-6 gap-9">
          <li v-for="item in 5" :key="item" class="flex flex-col gap-2">
            <h3 class="text-sm font-semibold">Sub category name</h3>
            <ul class="flex flex-col gap-1">
              <li v-for="item in 5" :key="item" class="flex">
                <NuxtLink to="/" class="text-xs">Label 1</NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import ChevronIcon from '~/components/icons/ChevronIcon.vue';
import TempCatIcon from '~/components/icons/TempCatIcon.vue';

</script>

<style scoped>

.parent-link.router-link-exact-active {
  background-color: var(--color-bg-primary-accent);
  color: #000;
}

.modal:before {
  position: absolute;
  content: '';
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 10000%;
  height: 100%;
  background-color: var(--color-bg-secondary);
  z-index: -1;
}

</style>