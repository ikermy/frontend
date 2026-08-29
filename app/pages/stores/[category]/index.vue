<template>
  <div class="page pt-8 pb-24">
    <ShopCategoryAndSearch class="mb-[38px]">
      <h1 class="lg:text-[32px] text-2xl lg:min-w-[230px]">All products</h1>
    </ShopCategoryAndSearch>
    <div class="container flex gap-[28px]">
      <ShopSidebar class="min-w-[300px]"/>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-4">
        <ProductsCard title="Microsoft office 360" price="100" link="/stores/1" v-for="item in 10" :key="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShopSidebar from '~/pages/stores/components/ShopSidebar.vue';
import ShopCategoryAndSearch from '~/pages/stores/components/ShopCategoryAndSearch.vue';
import ProductsCard from '~/components/card/ProductsCard.vue';
</script>

<style scoped>

</style>