import { defineStore } from "pinia";

export const useBurgerMenuStore = defineStore("burgerMenu", {
  state: () => ({ isBurgerOpen: false }),
  actions: {
    toggle() {
      console.log("toggle");
      this.isBurgerOpen = !this.isBurgerOpen;
    },
  },
  getters: {
    isOpen: state => state.isBurgerOpen,
  },
});
