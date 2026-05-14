/**
 * Pure utility — no hooks, safe to call anywhere.
 *
 * @param amount   - numeric price
 * @param locale   - current locale string ("ar" | "en" | "it")
 * @param currency - currency label from translations (e.g. "ج.م" or "EGP")
 */

export function formatPrice(amount: number, locale: string, currency: string): string {
    const formatted = amount.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
    return `${formatted} ${currency}`;
}
