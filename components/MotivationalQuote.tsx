"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTodayQuote, QUOTES } from "@/lib/i18n/quotes";
import { useLocale } from "@/hooks/useLocale";

interface QuoteProps {
  /** تغيّر الجملة في كل visit (افتراضي: false = جملة اليوم) */
  randomize?: boolean;
  className?: string;
}

export function MotivationalQuote({ randomize = false, className = "" }: QuoteProps) {
  const { locale } = useLocale();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (randomize) {
      setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
    } else {
      // نفس الجملة طوال اليوم
      const today = new Date();
      const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      setQuoteIndex(dayOfYear % QUOTES.length);
    }
  }, [randomize]);

  if (!mounted) return null;

  const quote = QUOTES[quoteIndex];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={quoteIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className={`text-center px-4 ${className}`}
      >
        <p
          className="text-sm sm:text-base text-muted-foreground italic max-w-md mx-auto"
          dir={locale === "en" ? "ltr" : "rtl"}
        >
          <span className="text-primary mr-1">{quote.emoji}</span>
          {quote.text[locale]}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
