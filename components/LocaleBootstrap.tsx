"use client";

import { useEffect, useState } from "react";
import { useLocaleStore } from "@/lib/i18n/store";
import { LOCALE_INFO } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/types";

const STORAGE_KEY = "zawhan-locale";

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "ar-eg";

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const saved = parsed?.state?.locale as Locale | undefined;
      if (saved && LOCALE_INFO[saved]) return saved;
    }
  } catch {
    // ignore
  }

  // كشف من المتصفح
  const browserLang = navigator.language || "ar";
  const lang = browserLang.toLowerCase();

  if (lang === "en" || lang.startsWith("en-")) return "en";
  if (lang === "ar" || lang === "ar-sa" || lang === "ar-ae" || lang === "ar-qa" || lang === "ar-kw" || lang === "ar-bh" || lang === "ar-om" || lang === "ar-ye") return "ar-sa";
  if (lang === "ar-eg") return "ar-eg";
  if (lang === "ar-sy" || lang === "ar-lb" || lang === "ar-jo" || lang === "ar-ps" || lang === "ar-iq") return "ar-levant";
  if (lang === "ar-ma" || lang === "ar-tn" || lang === "ar-dz" || lang === "ar-ly") return "ar-maghreb";

  return "ar-eg";
}

/**
 * يُحدّث <html dir> و <html lang> على العميل فقط
 * لا يُسبب hydration mismatch لأنه يتدخل بعد mount
 */
export function LocaleBootstrap() {
  const locale = useLocaleStore((s) => s.locale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // أول mount: اقرأ من localStorage أو اكشف
    const initial = getInitialLocale();
    useLocaleStore.getState().setLocale(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const info = LOCALE_INFO[locale];
    if (info && typeof document !== "undefined") {
      document.documentElement.dir = info.dir;
      document.documentElement.lang = locale.split("-")[0];
    }
  }, [locale, mounted]);

  return null;
}
