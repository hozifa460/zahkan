import { en } from "./en";
import { ar } from "./ar";
import { arEg } from "./ar-eg";
import { arSa } from "./ar-sa";
import { arLevant } from "./ar-levant";
import { arMaghreb } from "./ar-maghreb";
import type { Locale, Translations, TranslationKey } from "./types";

export * from "./types";

export const translations: Record<Locale, Translations> = {
  en,
  ar,
  "ar-eg": arEg,
  "ar-sa": arSa,
  "ar-levant": arLevant,
  "ar-maghreb": arMaghreb,
};

/**
 * ترجمة مفتاح حسب اللغة مع fallback ذكي:
 * 1. اللهجة المطلوبة (مثلاً ar-eg)
 * 2. الفصحى (ar) إن وُجد
 * 3. الإنجليزية (en) كآخر حل
 */
export function t(locale: Locale, key: TranslationKey): string {
  // جرّب اللهجة المحددة أولاً
  const direct = translations[locale]?.[key];
  if (direct) return direct;

  // fallback إلى الفصحى إن كانت اللهجة عربية
  if (locale.startsWith("ar-") && locale !== "ar") {
    const msa = translations.ar[key];
    if (msa) return msa;
  }

  // fallback أخير للإنجليزية
  return translations.en[key] || key;
}

/**
 * كشف اللغة من لغة المتصفح
 */
export function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return "ar-eg";

  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || "en";
  const langLower = browserLang.toLowerCase();

  // مطابقة دقيقة أولاً
  if (langLower === "en" || langLower.startsWith("en-")) return "en";
  if (langLower === "ar" || langLower === "ar-sa" || langLower === "ar-ae" || langLower === "ar-qa" || langLower === "ar-kw" || langLower === "ar-bh" || langLower === "ar-om" || langLower === "ar-ye") return "ar-sa";
  if (langLower === "ar-eg") return "ar-eg";
  if (langLower === "ar-sy" || langLower === "ar-lb" || langLower === "ar-jo" || langLower === "ar-ps" || langLower === "ar-iq") return "ar-levant";
  if (langLower === "ar-ma" || langLower === "ar-tn" || langLower === "ar-dz" || langLower === "ar-ly" || langLower === "ar-mr") return "ar-maghreb";

  // أي عربي آخر → مصري (الافتراضي)
  if (langLower.startsWith("ar")) return "ar-eg";

  return "en";
}
