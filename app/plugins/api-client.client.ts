/**
 * API Client plugin — инициализирует глобальный ApiClient на старте приложения,
 * чтобы useRuntimeConfig() вызывался в контексте плагина (не в обработчике событий).
 */
import { getApiClient } from "~/shared/api/client";

export default defineNuxtPlugin(() => {
  getApiClient();
});
