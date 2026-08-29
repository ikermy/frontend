<template>
  <div class="">
    <div>
      <div>
        <CheckboxIcon />
      </div>
      <div>
        <img :src="images.basketCard" alt="">
      </div>
      <h3>Apple card 1000 руб, РУ регион</h3>
    </div>
    <div>
      <div class="qty max-w-[115px] flex items-stretch justify-center gap-1.5">
        <button type="button" class="w-[30px] h-[30px] flex items-center justify-center bg-gray-dark rounded-lg cursor-pointer" @click="decrementQuantity"><MinusIcon /></button>
        <input type="number" :value="quantity" class="max-w-11 bg-gray-dark flex items-center justify-center text-center border-none outline-none rounded-lg text-sm font-semibold">
        <button type="button" class="w-[30px] h-[30px] flex items-center justify-center bg-gray-dark rounded-lg cursor-pointer" @click="incrementQuantity"><PlusIcon /></button>
      </div>
    </div>
    <div>1 420₽</div>
  </div>
</template>

<script setup lang="ts">
import CheckboxIcon from '~/components/icons/CheckboxIcon.vue';
import MinusIcon from '~/components/icons/MinusIcon.vue';
import PlusIcon from '~/components/icons/PlusIcon.vue';
import { useAssets } from "~/shared/composables/useAssets";

const { images } = useAssets();

const quantity = ref(1)

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}
const incrementQuantity = () => {
  quantity.value++
}
</script>

<style scoped>

</style>