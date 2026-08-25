"use client";

import { useEffect } from "react";
import { useLocaleStore } from "@/lib/i18n/store";
import { t as translate } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/i18n/types";

/**
 * Hook رئيسي للترجمة.
 * يُرجع: { locale, dir, t, setLocale }
 */
export function useLocale() {
  const locale = useLocaleStore((s) => s.locale);
  const dir = useLocaleStore((s) => s.dir);
  const setLocale = useLocaleStore((s) => s.setLocale);

  return {
    locale,
    dir,
    setLocale,
    t: (key: TranslationKey) => translate(locale, key),
  };
}
