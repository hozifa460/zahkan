"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { LanguageSelector } from "@/components/LanguageSelector";
import clsx from "clsx";
import type { TaskDuration } from "@/lib/tasks";
import { getRandomChallenge } from "@/lib/stats/doubleTasks";

interface DurationOption {
  value: TaskDuration;
  labelKey: "time.2min" | "time.10min" | "time.30min" | "time.1hour";
  minutes: number;
  color: string;
  emoji: string;
}

const DURATIONS: DurationOption[] = [
  { value: 2, labelKey: "time.2min", minutes: 2, color: "#10b981", emoji: "⚡" },
  { value: 10, labelKey: "time.10min", minutes: 10, color: "#3b82f6", emoji: "☕" },
  { value: 30, labelKey: "time.30min", minutes: 30, color: "#8b5cf6", emoji: "🎯" },
  { value: 60, labelKey: "time.1hour", minutes: 60, color: "#ec4899", emoji: "🚀" },
];

export default function TimePage() {
  const router = useRouter();
  const { t, dir } = useLocale();

  const handleSelect = (duration: TaskDuration) => {
    // حفظ الاختيار في sessionStorage (لأن المهمات تعتمد على وقت + طاقة)
    sessionStorage.setItem("selectedDuration", String(duration));
    router.push("/energy");
  };

  const handleChallenge = () => {
    const challenge = getRandomChallenge();
    if (!challenge) return;
    sessionStorage.setItem("currentChallengeId", challenge.id);
    sessionStorage.setItem("currentTaskId", challenge.task1.id);
    router.push(`/task/${challenge.task1.id}`);
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background via-background to-card/20" />

      {/* Header */}
      <header className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t("common.back")}
        >
          {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t("common.back")}</span>
        </button>
        <LanguageSelector />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-2xl flex flex-col items-center gap-10"
        >
          {/* العنوان */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3"
            >
              <Clock className="w-6 h-6 text-primary" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-light text-foreground">
              {t("time.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("time.subtitle")}
            </p>
          </div>

          {/* بطاقات الوقت */}
          <div className="w-full grid grid-cols-2 gap-4">
            {DURATIONS.map((opt, i) => (
              <motion.button
                key={opt.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(opt.value)}
                className={clsx(
                  "group relative overflow-hidden",
                  "p-6 sm:p-8 rounded-3xl",
                  "bg-card border border-border",
                  "hover:border-primary/40",
                  "transition-all duration-200",
                  "text-center"
                )}
              >
                {/* اللون المتوهّج عند الـ hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at center, ${opt.color}, transparent 70%)` }}
                />

                <div className="relative space-y-2">
                  <div className="text-3xl">{opt.emoji}</div>
                  <div className="text-2xl sm:text-3xl font-light text-foreground">
                    {t(opt.labelKey)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {opt.minutes} {t("common.minutes")}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* تحدي مزدوج */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleChallenge}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/30 hover:border-violet-500/60 transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-start">
              <div className="text-sm font-medium">تحدي مزدوج</div>
              <div className="text-xs text-muted-foreground">مهمتان قصيرتان معاً = XP مضاعف</div>
            </div>
            <div className="text-xs text-primary font-mono">+10 XP</div>
          </motion.button>

          {/* تلميح سفلي */}
          <p className="text-xs text-muted-foreground/50 text-center mt-2">
            اضغط على المدة لاختيارها
          </p>
        </motion.div>
      </main>
    </div>
  );
}
