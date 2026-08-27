"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowDown, Flame, Compass, Target, Brain, LogIn, LogOut, Cloud, CloudOff, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { LanguageSelector } from "@/components/LanguageSelector";
import { AuthButton } from "@/components/AuthButton";
import { StreakBadge } from "@/components/StreakBadge";
import { LevelBadge } from "@/components/LevelBadge";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { CoachBubble } from "@/components/CoachBubble";
import { DailyHabitsButton } from "@/components/DailyHabitsButton";
import { useStats } from "@/hooks/useStats";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const { t, dir } = useLocale();
  const stats = useStats();
  const { user } = useAuth();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background via-background to-card/20" />

      <header className="absolute top-4 inset-x-4 flex flex-col items-end gap-2 z-10">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>{t("app.name")}</span>
        </div>
        <div className="flex items-center gap-2">
          {stats.completedTasks.length > 0 && (
            <>
              <button
                onClick={() => router.push("/quiz")}
                className="p-2 rounded-full bg-card/60 hover:bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
                aria-label="اختبار الزهقان"
                title="أي نوع زهقان أنت؟"
              >
                <Brain className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push("/challenges")}
                className="p-2 rounded-full bg-card/60 hover:bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
                aria-label="تحديات 30 يوم"
                title="تحديات 30 يوم"
              >
                <Target className="w-4 h-4" />
              </button>
            </>
          )}
          <LanguageSelector />
        </div>
        <div className="flex items-center gap-2">
          <AuthButton />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md flex flex-col items-center gap-12"
        >
          <div className="text-center space-y-3">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl sm:text-7xl font-light text-foreground tracking-tight"
            >
              {t("app.name")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-sm text-muted-foreground max-w-xs mx-auto"
            >
              <span className="block text-sm sm:text-base text-muted-foreground max-w-xs mx-auto leading-relaxed">
                {t("home.tagline") || "حوّل زهقك لشي يتفيد بجد"}
              </span>
              <span className="block text-xs text-muted-foreground/70 max-w-xs mx-auto mt-1.5">
                {t("home.hint") || "دقيقتين ممكن يغيّروا يومك كله."}
              </span>
            </motion.p>
          </div>

          {/* الإحصائيات (تظهر بعد أول إنجاز) */}
          {stats.totalXp > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-3"
            >
              <LevelBadge level={stats.level} totalXp={stats.totalXp} progress={stats.levelProgress} size="sm" />
              {stats.currentStreak > 0 && <StreakBadge streak={stats.currentStreak} size="sm" />}
            </motion.div>
          )}

          {/* الجملة التحفيزية */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="-mt-4"
          >
            <MotivationalQuote />
          </motion.div>

          {/* مدرب الزهق "زيد" — يظهر بعد أول مهمة */}
          {stats.completedTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="w-full"
            >
              <CoachBubble />
            </motion.div>
          )}

          {/* الزر الكبير */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            onClick={() => router.push("/time")}
            data-testid="start-button"
            type="button"
            className="group relative px-16 py-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full text-2xl font-medium shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="flex items-center gap-3">
              {t("home.cta")}
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown className="w-5 h-5" />
              </motion.span>
            </span>
          </motion.button>

          {/* زر عادات اليوم — ذكي حسب الوقت */}
          <DailyHabitsButton />

          {/* تلميح */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-muted-foreground/60 text-center"
          >
            {t("home.hint")}
          </motion.p>
        </motion.div>
      </main>

      {/* الفوتر — يُظهر الروابط دائماً (سواء للمستخدمين المسجلين أو بعد أول إنجاز) */}
      <footer className="py-4 text-center text-xs text-muted-foreground/40 flex items-center justify-center gap-2 flex-wrap">
        <span>{t("home.footer")}</span>
        <span>·</span>
        <button
          onClick={() => router.push("/discover")}
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <Compass className="w-3 h-3" />
          استكشاف
        </button>
        {stats.completedTasks.length > 0 && (
          <>
            <span>·</span>
            <button
              onClick={() => router.push("/stats")}
              className="hover:text-foreground transition-colors"
            >
              إحصائياتي
            </button>
            <span>·</span>
            <button
              onClick={() => router.push("/favorites")}
              className="hover:text-foreground transition-colors"
            >
              مفضّلاتي
            </button>
            <span>·</span>
            <button
              onClick={() => router.push("/history")}
              className="hover:text-foreground transition-colors"
            >
              السجل
            </button>
          </>
        )}
        {user && (
          <>
            <span>·</span>
            <span className="text-primary/60">☁️ مُزامن</span>
          </>
        )}
      </footer>
      {/* لا Dialog — الزر يذهب مباشرة للروتين */}
    </div>
  );
}
