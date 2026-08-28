"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, ArrowLeft, ArrowRight, Trophy } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Rating } from "@/components/Rating";
import { useStats } from "@/hooks/useStats";
import { celebrate, miniCelebrate, sideCelebrate } from "@/components/Confetti";
import { CATEGORIES, filterTasks, getTaskById } from "@/lib/tasks";
import { useTask } from "@/hooks/useTasks";
import clsx from "clsx";
import type { Task, TaskDuration, TaskEnergy } from "@/lib/tasks";
import type { Mood } from "@/lib/stats/types";

export default function DonePage() {
  const router = useRouter();
  const { t, locale, dir } = useLocale();
  const stats = useStats();

  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null);
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const completedTask = useTask(completedTaskId);

  const [nextTask, setNextTask] = useState<Task | null>(null);
  const [showRating, setShowRating] = useState(true);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [isChallengeStep, setIsChallengeStep] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  useEffect(() => {
    setCompletedTaskId(sessionStorage.getItem("completedTaskId"));
    setChallengeId(sessionStorage.getItem("currentChallengeId"));
  }, []);

  // عند وجود المهمة: سجّلها + اقترح التالية
  useEffect(() => {
    if (!completedTask) return;
    if (rating === null) return;  // ننتظر التقييم

    // سجّل المهمة
    const result = stats.completeTask({
      taskId: completedTask.id,
      category: completedTask.category,
      duration: completedTask.duration,
      energy: completedTask.energy,
      rating,
      baseXp: completedTask.xp,
    });

    // تسجيل تقدم التحدي لو كانت المهمة جزءاً من تحدي 30 يوم
    const chId = sessionStorage.getItem("currentChallengeId") || sessionStorage.getItem("challengeId");
    const chDay = sessionStorage.getItem("challengeDay");
    if (chId && chDay) {
      stats.completeChallengeDay(chId, Number(chDay));
      sessionStorage.removeItem("currentChallengeId");
      sessionStorage.removeItem("challengeId");
      sessionStorage.removeItem("challengeDay");
    }

    setNewAchievements(result.newAchievements);
    setShowRating(false);

    // 🎉 confetti احتفال!
    if (rating === 5) {
      // تقييم 5 نجوم = احتفال ذهبي
      miniCelebrate();
      setTimeout(() => celebrate(), 200);
    } else {
      celebrate();
    }

    // إنجازات جديدة = confetti جانبي
    if (result.newAchievements.length > 0) {
      setTimeout(() => sideCelebrate(), 600);
    }

    // اقترح مهمة جديدة
    const durationStr = sessionStorage.getItem("selectedDuration");
    const duration = durationStr ? (Number(durationStr) as TaskDuration) : undefined;

    const next = stats.recommend({ duration });
    setNextTask(next);

    // شغّل نغمة إنجاز جميلة بدون أي ملفات خارجية مفقودة
    if (stats.soundEnabled && typeof window !== "undefined") {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(587.33, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        }
      } catch {}
    }
  }, [completedTask, rating]);

  const handleContinue = () => {
    if (nextTask) {
      sessionStorage.setItem("currentTaskId", nextTask.id);
      router.push(`/task/${nextTask.id}`);
    } else {
      router.push("/time");
    }
  };

  const handleHome = () => {
    sessionStorage.removeItem("currentTaskId");
    sessionStorage.removeItem("completedTaskId");
    sessionStorage.removeItem("taskXp");
    router.push("/");
  };

  const completedCategory = completedTask
    ? CATEGORIES.find((c) => c.id === completedTask.category)
    : null;

  const nextCategory = nextTask
    ? CATEGORIES.find((c) => c.id === nextTask.category)
    : null;

  if (!completedTask) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background via-card/10 to-background" />

      <header className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
        <button onClick={handleHome} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t("common.close")}</span>
        </button>
        <LanguageSelector />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 gap-6">
        {/* الاحتفال */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="text-5xl">🎉</div>
          </div>
          {newAchievements.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg"
            >
              <Trophy className="w-5 h-5 text-yellow-900" />
            </motion.div>
          )}
        </motion.div>

        {/* العنوان */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center space-y-1">
          <h1 className="text-3xl sm:text-4xl font-light text-foreground">
            {t("next.title")}
          </h1>
          <p className="text-sm text-muted-foreground" dir={dir}>
            {completedTask.title[locale]}
          </p>
        </motion.div>

        {/* التقييم */}
        <AnimatePresence>
          {showRating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border"
            >
              <p className="text-sm text-muted-foreground">كيف كانت المهمة؟</p>
              <Rating value={rating ?? undefined} onChange={setRating} size="lg" showLabels />
            </motion.div>
          )}
        </AnimatePresence>

        {/* الإحصائيات */}
        {!showRating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-2xl font-light text-primary">
                <Sparkles className="w-5 h-5" />
                <span>+{completedTask.xp}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{t("next.xp")}</div>
            </div>

            <div className="w-px h-10 bg-border" />

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-2xl font-light text-orange-400">
                <Flame className="w-5 h-5" />
                <span>{stats.currentStreak}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{t("next.streak")}</div>
            </div>
          </motion.div>
        )}

        {/* الإنجازات الجديدة */}
        {newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="w-full max-w-md p-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
          >
            <div className="text-center">
              <div className="text-sm font-medium text-yellow-300 mb-2">
                🏆 إنجاز جديد!
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {newAchievements.map((id) => {
                  const ach = stats.achievements.find((a) => a.id === id);
                  if (!ach) return null;
                  return (
                    <div key={id} className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/30 text-xs">
                      <span>{ach.icon}</span>
                      <span>{ach.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* المهمة التالية */}
        {!showRating && nextTask && nextCategory && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full max-w-md">
            <div className="text-xs text-muted-foreground mb-2 text-center">{t("next.suggestion")}</div>
            <button onClick={handleContinue} className="group w-full p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all text-start">
              <div className="flex items-center gap-3">
                <div className="w-2 h-12 rounded-full shrink-0" style={{ background: nextCategory.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-0.5">{nextCategory.name[locale]}</div>
                  <div className="text-base font-medium text-foreground" dir={dir}>{nextTask.title[locale]}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{nextTask.duration} {t("common.minutes")}</span>
                    <span>·</span>
                    <span className="text-primary">+{nextTask.xp} {t("next.xp")}</span>
                  </div>
                </div>
                {dir === "rtl" ? (
                  <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:-translate-x-1 group-hover:text-foreground transition-all" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-foreground transition-all" />
                )}
              </div>
            </button>
          </motion.div>
        )}

        {!showRating && (
          <button onClick={handleHome} className="text-xs text-muted-foreground hover:text-foreground">
            أو عُد للرئيسية
          </button>
        )}
      </main>
    </div>
  );
}
