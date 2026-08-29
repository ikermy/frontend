// Minimal ambient module declarations for Swiper in this Nuxt project.
// Remove once proper typings are available from the package.
declare module 'swiper/vue' {
  import type { DefineComponent } from 'vue'
  export const Swiper: DefineComponent<any, any, any>
  export const SwiperSlide: DefineComponent<any, any, any>
}

declare module 'swiper/modules' {
  export const Pagination: any
  export const Autoplay: any
  export const Navigation: any
  export const EffectFade: any
  export const Thumbs: any
}

