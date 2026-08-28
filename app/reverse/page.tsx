"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Repeat, Check, ArrowLeft, Sparkles } from "lucide-react";
import { REVERSE_HABITS, alternativeToTask, type BadHabitId } from "@/lib/tasks/reverseHabits";
import { useStats } from "@/hooks/useStats";

function ReverseInner() {
  const router = useRouter();
  const params = useSearchParams();
  const stats = useStats();
  const [selectedHabit, setSelectedHabit] = useState<BadHabitId | null>(null);
  const [selectedAlt, setSelectedAlt] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const h = params.get("habit") as BadHabitId | null;
    if (h && REVERSE_HABITS.find((r) => r.id === h)) {
      setSelectedHabit(h);
    }
  }, [params]);

  const handleSelectHabit = (id: BadHabitId) => {
    setSelectedHabit(id);
    setSelectedAlt(null);
  };

  const handleSelectAlt = (idx: number) => {
    setSelectedAlt(idx);
  };

  const handleStart = () => {
    if (!selectedHabit || selectedAlt === null) return;
    const task = alternativeToTask(selectedHabit, selectedAlt);
    if (!task) return;
    router.push(`/task/reverse-${selectedHabit}-${selectedAlt}?title=${encodeURIComponent(task.title)}&duration=${task.duration}&description=${encodeURIComponent(task.description)}`);
  };

  // شاشة النجاح
  if (done) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 flex items-center justify-center mb-6"
        >
          <Sparkles className="w-12 h-12 text-white" />
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-gradient-to-br from-amber-500 to-pink-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-2">عكس عادتك! 🌟</h1>
        <p className="text-muted-foreground mb-2">اخترت التغيير — هذه أقوى خطوة</p>
        <p className="text-sm text-primary mb-8">+30 XP ✨</p>
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
          onClick={() => selectedHabit ? setSelectedHabit(null) : router.push("/")}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="رجوع"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
            <Repeat className="w-3 h-3" />
            اعكس عادة سيئة
          </div>
          <div className="text-xs text-muted-foreground/60">
            {selectedHabit ? "اختر البديل الإيجابي" : "اختر عادتك السيئة"}
          </div>
        </div>
        <div className="w-9" />
      </header>

      <main className="flex-1 px-4 py-2">
        <AnimatePresence mode="wait">
          {!selectedHabit ? (
            // ========== قائمة العادات السيئة (محسّنة) ==========
            <motion.div
              key="habits"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-2.5"
            >
              {REVERSE_HABITS.map((habit, idx) => (
                <motion.button
                  key={habit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSelectHabit(habit.id)}
                  className="group w-full flex items-center gap-3 p-3.5 bg-card border border-border rounded-2xl text-right hover:border-amber-500/50 hover:scale-[1.02] transition-all"
                >
                  {/* أيقونة أكبر مع توهج */}
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-pink-500/20 border border-amber-500/30 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span>{habit.icon}</span>
                  </div>

                  <div className="flex-1 text-right min-w-0">
                    <p className="text-sm font-medium text-foreground">{habit.badHabit}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {habit.alternatives.length} بدائل إيجابية
                      </span>
                      <span className="text-xs text-amber-500/80">•</span>
                      <span className="text-xs text-amber-500/80">خطوة صغيرة</span>
                    </div>
                  </div>

                  {/* سهم */}
                  <div className="text-muted-foreground group-hover:text-amber-500 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            // ========== قائمة البدائل (محسّنة) ==========
            <motion.div
              key="alts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {/* بطاقة معلومات العادة المختارة */}
              <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl flex-shrink-0">
                  {REVERSE_HABITS.find((h) => h.id === selectedHabit)?.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-amber-500/80">عكس هذه العادة:</p>
                  <p className="text-sm text-foreground">
                    {REVERSE_HABITS.find((h) => h.id === selectedHabit)?.badHabit}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mb-2">
                اختر بديل — كلهم {REVERSE_HABITS.find((h) => h.id === selectedHabit)?.alternatives[0].duration}-{REVERSE_HABITS.find((h) => h.id === selectedHabit)?.alternatives[2].duration} دقائق
              </p>

              {REVERSE_HABITS.find((h) => h.id === selectedHabit)?.alternatives.map((alt, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSelectAlt(idx)}
                  className={`w-full flex items-center gap-3 p-4 bg-card border-2 rounded-2xl text-right transition-all hover:scale-[1.02] ${
                    selectedAlt === idx
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5"
                      : "border-border hover:border-emerald-500/40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold flex-shrink-0 ${
                      selectedAlt === idx
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {selectedAlt === idx ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <p className="text-sm font-medium text-foreground">{alt.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alt.description}</p>
                    <p className="text-xs text-emerald-500/80 mt-1">⏱ {alt.duration} دقيقة</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* زر التنفيذ */}
      {selectedAlt !== null && (
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4"
        >
          <button
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-full text-lg font-medium shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Check className="w-5 h-5" />
            <span>ابدأ البديل</span>
          </button>
        </motion.footer>
      )}
    </div>
  );
}

export default function ReversePage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-muted-foreground">جاري التحميل...</div>}>
      <ReverseInner />
    </Suspense>
  );
}
