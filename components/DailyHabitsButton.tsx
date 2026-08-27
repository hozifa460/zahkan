"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentRoutineId, DAILY_ROUTINES, type RoutineId } from "@/lib/tasks/dailyRoutines";
import { isCompleted } from "@/lib/stats/dailyCompletion";

/**
 * زر ذكي — تلقائي حسب الوقت:
 * - فجر→عصر: "روتين الصباح"
 * - عصر→فجر: "روتين المساء"
 * - يختفي بعد الإكمال حتى الفترة التالية
 */
export function DailyHabitsButton() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [routineId, setRoutineId] = useState<RoutineId | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRoutineId(getCurrentRoutineId());
    setDone(isCompleted(getCurrentRoutineId()));

    // تحدّث كل دقيقة لو المستخدم يبقى على الصفحة
    const interval = setInterval(() => {
      const newId = getCurrentRoutineId();
      setRoutineId(newId);
      setDone(isCompleted(newId));
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted || !routineId) return null;

  const routine = DAILY_ROUTINES.find((r) => r.id === routineId);
  if (!routine) return null;

  const handleClick = () => {
    router.push(`/daily?routine=${routineId}`);
  };

  // لو خلّص الفترة → الزر يختفي
  if (done) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onClick={handleClick}
      type="button"
      className="group flex items-center gap-3 px-5 py-3 bg-card border rounded-full text-sm transition-all hover:scale-105"
      style={{
        borderColor: `${routine.color}60`,
        boxShadow: `0 0 20px ${routine.color}20`,
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-base"
        style={{ backgroundColor: `${routine.color}30` }}
      >
        <span>{routine.icon}</span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs text-muted-foreground">روتين</span>
        <span className="text-sm font-medium text-foreground">
          {routine.id === "morning" ? "الصباح" : "المساء"}
        </span>
      </div>
      <span className="text-xs text-muted-foreground/60">3 مهام</span>
    </motion.button>
  );
}
