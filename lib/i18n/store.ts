"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LOCALE_INFO } from "./index";
import type { Locale } from "./types";

interface LocaleState {
  locale: Locale;
  dir: "rtl" | "ltr";
  setLocale: (locale: Locale) => void;
}

const STORAGE_KEY = "zawhan-locale";

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      // الافتراضي قبل init — يجب أن يكون Locale صالح دائماً
      locale: "ar-eg",
      dir: "rtl",

      setLocale: (locale) => {
        const info = LOCALE_INFO[locale];
        set({ locale, dir: info.dir });

        if (typeof document !== "undefined") {
          document.documentElement.dir = info.dir;
          document.documentElement.lang = locale.split("-")[0];
        }
      },
    }),
    {
      name: STORAGE_KEY,
      // استخدم storage آمن: لو localStorage غير موجود (SSR) ارجع null store
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({ locale: state.locale, dir: state.dir }),
      // عند الـ hydration من localStorage، تأكد أن القيمة صالحة
      onRehydrateStorage: () => (state) => {
        if (state && (!state.locale || !LOCALE_INFO[state.locale])) {
          state.locale = "ar-eg";
          state.dir = "rtl";
        }
      },
    }
  )
);
