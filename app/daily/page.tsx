"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Sparkles, Calendar } from "lucide-react";
import { DAILY_ROUTINES, type RoutineId } from "@/lib/tasks/dailyRoutines";
import { useStats } from "@/hooks/useStats";
import { useLocale } from "@/hooks/useLocale";

const ROUTINE_KEYS: Record<RoutineId, string> = {
  morning: "صباحي",
  evening: "مسائي",
  work: "عمل",
  study: "دراسة",
};

function DailyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useLocale();
  const stats = useStats();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showComplete, setShowComplete] = useState(false);

  const routineId = (params.get("routine") || "morning") as RoutineId;
  const routine = DAILY_ROUTINES.find((r) => r.id === routineId) || DAILY_ROUTINES[0];
  const currentTask = routine.tasks[currentIndex];
  const isLastTask = currentIndex === routine.tasks.length - 1;
  const allComplete = completedTasks.length === routine.tasks.length;

  const handleComplete = () => {
    if (currentTask) {
      setCompletedTasks((prev) => [...prev, currentTask.title]);
    }
    if (isLastTask) {
      // مكافأة 50 XP لإكمال الروتين
      const routineId2 = `routine-${routine.id}-${Date.now()}`;
      // stats.completeTask موجودة في useStats
      if (typeof (stats as any).completeTask === "function") {
        (stats as any).completeTask({
          id: routineId2,
          title: `روتين ${ROUTINE_KEYS[routine.id]}`,
          category: "habit-mind",
          duration: routine.tasks.reduce((s, t) => s + t.duration, 0),
        });
      }
      setShowComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setCompletedTasks((prev) => prev.slice(0, -1));
    } else {
      router.push("/");
    }
  };

  if (showComplete) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6"
        >
          <Sparkles className="w-12 h-12 text-primary-foreground" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("daily.completeAll")}
        </h1>
        <p className="text-muted-foreground mb-2">
          أكملت روتين "{ROUTINE_KEYS[routineId]}" بنجاح
        </p>
        <p className="text-sm text-primary mb-8">+50 XP مكافأة 🎁</p>
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:scale-105 transition-transform"
        >
          ارجع للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background via-background to-card/20" />

      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="رجوع"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {ROUTINE_KEYS[routineId]}
          </div>
          <div className="text-xs text-muted-foreground/60">
            مهمة {currentIndex + 1} من {routine.tasks.length}
          </div>
        </div>
        <div className="w-9" />
      </header>

      {/* Progress */}
      <div className="px-4 mb-6">
        <div className="flex gap-2">
          {routine.tasks.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                i < currentIndex
                  ? "bg-primary"
                  : i === currentIndex
                  ? "bg-primary/60"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full"
          >
            <div
              className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl mb-6"
              style={{ backgroundColor: `${routine.color}20` }}
            >
              {routine.icon}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {currentTask.title}
            </h1>
            <p className="text-muted-foreground mb-8">
              {currentTask.description}
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground/80 mb-8">
              <span>⏱ {currentTask.duration} دقيقة</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer / Complete button */}
      <footer className="p-4 flex items-center justify-center gap-3">
        <button
          onClick={handleComplete}
          className="group flex items-center gap-2 px-10 py-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full text-lg font-medium shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Check className="w-5 h-5" />
          <span>{isLastTask ? "إنهاء الروتين" : "خلّصت المهمة"}</span>
        </button>
      </footer>
    </div>
  );
}

export default function DailyPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-muted-foreground">جاري التحميل...</div>}>
      <DailyInner />
    </Suspense>
  );
}
