// نظام أنواع i18n لـ "زهقان"

export type Locale = "en" | "ar" | "ar-eg" | "ar-sa" | "ar-levant" | "ar-maghreb";

export const LOCALES: Locale[] = [
  "en",
  "ar",
  "ar-eg",
  "ar-sa",
  "ar-levant",
  "ar-maghreb",
];

export interface LocaleInfo {
  code: Locale;
  name: string;        // اسم اللغة بصيغتها الأصلية
  nameEn: string;      // اسم اللغة بالإنجليزي
  dir: "ltr" | "rtl";
  flag: string;        // emoji علم
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  en:        { code: "en",        name: "English",    nameEn: "English",       dir: "ltr", flag: "🇬🇧" },
  ar:        { code: "ar",        name: "العربية",   nameEn: "Arabic (MSA)",  dir: "rtl", flag: "🌍" },
  "ar-eg":   { code: "ar-eg",     name: "مصري",      nameEn: "Egyptian",      dir: "rtl", flag: "🇪🇬" },
  "ar-sa":   { code: "ar-sa",     name: "خليجي",     nameEn: "Gulf",          dir: "rtl", flag: "🇸🇦" },
  "ar-levant":{ code: "ar-levant", name: "شامي",      nameEn: "Levantine",     dir: "rtl", flag: "🇱🇧" },
  "ar-maghreb":{ code: "ar-maghreb", name: "مغاربي", nameEn: "Maghrebi",      dir: "rtl", flag: "🇲🇦" },
};

// مفاتيح الترجمة (single source of truth)
export type TranslationKey =
  // العلامة والشعار
  | "app.name"
  | "app.tagline"
  // الشاشة الرئيسية
  | "home.placeholder"
  | "home.cta"
  | "home.hint"
  | "home.tagline"
  | "home.footer"
  // اختيار الوقت
  | "time.title"
  | "time.subtitle"
  | "time.2min"
  | "time.10min"
  | "time.30min"
  | "time.1hour"
  // نوع الطاقة
  | "energy.title"
  | "energy.subtitle"
  | "energy.mental"
  | "energy.mental.desc"
  | "energy.physical"
  | "energy.physical.desc"
  | "energy.creative"
  | "energy.creative.desc"
  // المهمة
  | "task.start"
  | "task.done"
  | "task.stop"
  | "task.steps"
  | "task.output"
  | "task.complete.title"
  | "task.complete.rate"
  // الضربة الجاية
  | "next.title"
  | "next.continue"
  | "next.streak"
  | "next.xp"
  | "next.suggestion"
  // الإعدادات
  | "settings.title"
  | "settings.language"
  | "settings.sound"
  | "settings.clear"
  | "settings.about"
  // عام
  | "common.back"
  | "common.next"
  | "common.cancel"
  | "common.save"
  | "common.minutes"
  | "common.hour"
  | "common.close";

export type Translations = Record<TranslationKey, string>;
