"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Target, Check, X, Trophy } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useStats } from "@/hooks/useStats";
import { getAllChallenges, type Challenge30Day } from "@/lib/stats/challenges";
import type { Locale } from "@/lib/i18n/types";
import { useTask } from "@/hooks/useTasks";
import { CATEGORIES } from "@/lib/tasks";
import clsx from "clsx";

export default function ChallengesPage() {
  const router = useRouter();
  const { dir, locale: loc } = useLocale();
  const locale = loc as Locale;
  const stats = useStats();
  const challenges = getAllChallenges();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = challenges.find((c) => c.id === selectedId);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background via-background to-card/20" />

      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>رجوع</span>
          </button>
          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full space-y-4">
        <div>
          <h1 className="text-2xl font-light flex items-center gap-2">
            <Target className="w-5 h-5" />
            تحدّيات 30 يوم
          </h1>
          <p className="text-sm text-muted-foreground">غيّر عادة في شهر</p>
        </div>

        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {challenges.map((challenge) => {
                const progress = stats.challengeProgress[challenge.id] || 0;
                const isActive = stats.activeChallenge === challenge.id;
                return (
                  <motion.button
                    key={challenge.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedId(challenge.id)}
                    className="w-full p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all text-start"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                        style={{ background: `${challenge.color}20` }}
                      >
                        {challenge.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-base font-semibold">{challenge.name[locale]}</h2>
                          {isActive && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                              نشط
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {challenge.description[locale]}
                        </p>
                        {progress > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                              <span>التقدم</span>
                              <span>{progress}/30 يوم</span>
                            </div>
                            <div className="h-1 bg-border rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${(progress / 30) * 100}%`, background: challenge.color }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <ChallengeDetail
              challenge={selected}
              onBack={() => setSelectedId(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ChallengeDetail({ challenge, onBack }: { challenge: Challenge30Day; onBack: () => void }) {
  const { dir, locale: loc } = useLocale();
  const locale = loc as Locale;
  const stats = useStats();
  const router = useRouter();
  const progress = stats.challengeProgress[challenge.id] || 0;
  const nextDay = progress + 1;
  const isActive = stats.activeChallenge === challenge.id;
  const isComplete = progress >= 30;

  const handleStart = () => {
    stats.startChallenge(challenge.id);
  };

  const handleAbandon = () => {
    if (confirm("هل تريد فعلاً التخلي عن التحدي؟")) {
      stats.abandonChallenge();
    }
  };

  const handleStartToday = (day: number) => {
    const dayTask = challenge.days.find((d) => d.day === day);
    if (!dayTask) return;

    // إنشاء مهمة كاملة من ChallengeDay
    const taskId = `${challenge.id}-day-${day}`;
    const newTask = {
      id: taskId,
      category: dayTask.category,
      duration: dayTask.duration,
      energy: dayTask.energy,
      title: dayTask.title,
      description: dayTask.description,
      steps: dayTask.steps,
      output: { en: "Task completed", ar: "مهمة مكتملة", "ar-eg": "مهمة خلصت", "ar-sa": "مهمة خلصت", "ar-levant": "مهمة خلصت", "ar-maghreb": "مهمة ساليت" },
      difficulty: 1 as const,
      tags: ["challenge", challenge.id],
      xp: 15,
    };

    // حفظ في sessionStorage
    const existing = JSON.parse(sessionStorage.getItem("customTasks") || "{}");
    existing[taskId] = newTask;
    sessionStorage.setItem("customTasks", JSON.stringify(existing));

    sessionStorage.setItem("currentTaskId", taskId);
    sessionStorage.setItem("challengeId", challenge.id);
    sessionStorage.setItem("challengeDay", String(day));
    router.push(`/task/${taskId}`);
  };

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <button
        onClick={onBack}
        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
      >
        {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        كل التحديات
      </button>

      {/* العنوان */}
      <div
        className="p-6 rounded-2xl border-2"
        style={{ borderColor: `${challenge.color}40`, background: `${challenge.color}10` }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `${challenge.color}20` }}
          >
            {challenge.emoji}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{challenge.name[locale]}</h2>
            <p className="text-xs text-muted-foreground">{challenge.description[locale]}</p>
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">التقدم</span>
            <span className="font-mono">
              {progress}/30 يوم ({Math.round((progress / 30) * 100)}%)
            </span>
          </div>
          <div className="h-2 bg-background/40 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(progress / 30) * 100}%` }}
              className="h-full rounded-full"
              style={{ background: challenge.color }}
            />
          </div>
        </div>

        {isComplete && (
          <div className="mt-4 p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-center">
            <Trophy className="w-6 h-6 mx-auto text-yellow-500" />
            <div className="text-sm font-medium mt-1">أكملت التحدي! 🎉</div>
            <div className="text-xs text-muted-foreground">+{challenge.completionXp} XP</div>
          </div>
        )}
      </div>

      {/* أزرار التحكم */}
      <div className="flex gap-2">
        {!isActive && !isComplete && (
          <button
            onClick={handleStart}
            className="flex-1 p-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" />
            ابدأ التحدي
          </button>
        )}
        {isActive && (
          <>
            <button
              onClick={() => handleStartToday(nextDay)}
              disabled={isComplete}
              className="flex-1 p-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              يوم {nextDay}
            </button>
            <button
              onClick={handleAbandon}
              className="p-3 rounded-2xl bg-card border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* الأيام المكتملة (preview) */}
      {progress > 0 && (
        <div className="p-4 rounded-2xl bg-card border border-border">
          <h3 className="text-sm font-medium mb-3">أيامك</h3>
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isDone = day <= progress;
              return (
                <div
                  key={day}
                  className={clsx(
                    "aspect-square rounded-md flex items-center justify-center text-[10px] font-mono",
                    isDone
                      ? "text-white"
                      : day === nextDay
                      ? "border border-dashed border-foreground/50 text-foreground/70"
                      : "bg-border/30 text-muted-foreground/50"
                  )}
                  style={isDone ? { background: challenge.color } : {}}
                >
                  {isDone ? <Check className="w-3 h-3" /> : day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
