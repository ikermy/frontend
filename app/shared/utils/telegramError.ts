/**
 * Маппинг сырых ошибок BFF/Auth по Telegram на i18n-ключи.
 * Возвращает ключ перевода или null, если специфичного сообщения нет.
 */
export function telegramErrorKey(message?: string): string | null {
  const m = message || "";
  if (/already linked to another account/i.test(m)) {
    return "settings.telegram_already_linked";
  }
  if (/cannot be changed once linked/i.test(m)) {
    return "settings.telegram_id_locked";
  }
  return null;
}
