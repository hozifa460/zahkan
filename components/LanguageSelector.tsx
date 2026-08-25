"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { LOCALE_INFO, LOCALES, t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/types";
import clsx from "clsx";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t: translate } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = LOCALE_INFO[locale];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "flex items-center gap-2 px-3 py-2 rounded-full",
          "bg-card/60 hover:bg-card border border-border",
          "text-sm text-foreground transition-colors",
          "backdrop-blur-sm"
        )}
        aria-label={translate("settings.language")}
      >
        <Globe className="w-4 h-4" />
        {!compact && <span>{current.flag} {current.name}</span>}
        {compact && <span>{current.flag}</span>}
        <ChevronDown className={clsx("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              "absolute top-full mt-2 min-w-[200px] z-50",
              locale === "en" ? "right-0" : "left-0",
              "bg-card border border-border rounded-2xl shadow-2xl",
              "overflow-hidden backdrop-blur-xl"
            )}
          >
            {LOCALES.map((code) => {
              const info = LOCALE_INFO[code];
              const isActive = code === locale;
              return (
                <button
                  key={code}
                  onClick={() => {
                    setLocale(code as Locale);
                    setOpen(false);
                  }}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm",
                    "hover:bg-background/60 transition-colors",
                    isActive && "bg-primary/10"
                  )}
                >
                  <span className="text-lg">{info.flag}</span>
                  <span className="flex-1 text-start">
                    <span className="block text-foreground font-medium">{info.name}</span>
                    <span className="block text-xs text-muted-foreground">{info.nameEn}</span>
                  </span>
                  {isActive && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
