"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/hooks/useLocale";
import { useStats } from "@/hooks/useStats";
import { getCoachMessage, type CoachMessage } from "@/lib/stats/coach";
import type { Locale } from "@/lib/i18n/types";

/**
 * شخصية "زيد" — مدرب الزهق
 * يعرض رسالة واحدة ذكية حسب سياق المستخدم
 */
export function CoachBubble() {
  const { locale: loc } = useLocale();
  const locale = loc as Locale;
  const stats = useStats();
  const [message, setMessage] = useState<CoachMessage | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // يختار السياق حسب حالة المستخدم
    const today = new Date().toISOString().split("T")[0];
    const tasksToday = stats.completedTasks.filter(
      (t) => new Date(t.completedAt).toISOString().split("T")[0] === today
    );

    let context: CoachMessage["context"] = "welcome";
    const hour = new Date().getHours();

    if (stats.completedTasks.length === 0) {
      context = "welcome";
    } else if (tasksToday.length === 0) {
      // لم ينجز اليوم
      if (stats.currentStreak >= 7) {
        context = "streakStrong";
      } else if (hour < 12) {
        context = "morning";
      } else if (hour >= 18) {
        context = "evening";
      } else {
        context = "noTasksToday";
      }
    } else {
      // أنجز اليوم
      if (tasksToday.length === 1) {
        context = "afterTask";
      } else if (stats.completedTasks.length === 1) {
        context = "firstTask";
      } else if (stats.completedTasks.length === 10) {
        context = "tenthTask";
      } else if (stats.currentStreak >= 7) {
        context = "streakStrong";
      } else {
        context = "gentle";
      }
    }

    const vars: Record<string, string | number> = {
      streak: stats.currentStreak,
    };
    setMessage(getCoachMessage(context, locale, vars));
  }, [mounted, stats.completedTasks.length, stats.currentStreak, locale]);

  if (!mounted || !message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
      >
        {/* شخصية "زيد" */}
        <div className="shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl shadow-lg">
            🧑‍🚀
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-primary">زيد</span>
            <span className="text-base">{message.emoji}</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed" dir={locale === "en" ? "ltr" : "rtl"}>
            {message.text[locale]}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
