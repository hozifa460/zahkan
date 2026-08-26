"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, Check, Sparkles, Clock, AlertCircle } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Timer } from "@/components/Timer";
import { useTask } from "@/hooks/useTasks";
import { CATEGORIES } from "@/lib/tasks";
import clsx from "clsx";

export default function TaskPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t, locale, dir } = useLocale();
  const task = useTask(params.id);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  // إن لم تكن هناك مهمة، عُد للرئيسية
  useEffect(() => {
    if (!task) {
      const timer = setTimeout(() => router.push("/"), 2000);
      return () => clearTimeout(timer);
    }
  }, [task, router]);

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🤔</div>
          <p className="text-muted-foreground">المهمة غير موجودة...</p>
        </div>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === task.category);
  const taskTitle = task.title[locale];
  const taskDesc = task.description[locale];
  const taskSteps = task.steps.map((s) => s[locale]);
  const taskOutput = task.output[locale];

  // يبدأ المؤقت تلقائياً عند تحميل الصفحة
  useEffect(() => {
    setTimerStarted(true);
  }, []);

  const handleComplete = () => {
    if (!timerCompleted) return; // لا تسمح بالإنهاء قبل الوقت
    // احفظ في sessionStorage أن المهمة انتهت (للصفحة التالية)
    sessionStorage.setItem("completedTaskId", task.id);
    sessionStorage.setItem("taskXp", String(task.xp));
    router.push("/done");
  };

  const handleTimerComplete = () => {
    setTimerCompleted(true);
  };

  const handleStop = () => {
    if (confirm("هل تريد فعلاً التوقّف؟")) {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background via-background to-card/20" />

      {/* Header */}
      <header className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
        <button
          onClick={() => router.push("/energy")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t("common.back")}</span>
        </button>
        <LanguageSelector />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 gap-6">
        {/* فئة المهمة */}
        {category && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: category.color }}
            />
            <span>{category.name[locale]}</span>
            <span>·</span>
            <span>{task.duration} {dir === "rtl" ? "دقيقة" : "min"}</span>
            <span>·</span>
            <span className="text-primary">+{task.xp} {t("next.xp")}</span>
          </motion.div>
        )}

        {/* العنوان */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-light text-center text-foreground max-w-xl"
          dir={dir}
        >
          {taskTitle}
        </motion.h1>

        {/* الوصف */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground text-center max-w-md"
          dir={dir}
        >
          {taskDesc}
        </motion.p>

        {/* المؤقت */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="my-2"
        >
          <Timer
            durationMinutes={task.duration}
            onComplete={handleTimerComplete}
            onStop={handleStop}
            color={category?.color || "#10b981"}
            autoStart={timerStarted}
            canComplete={false}
          />
        </motion.div>

        {/* شريط الحالة: يظهر متى ينتهي الوقت */}
        {timerCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm font-medium"
          >
            <Check className="w-4 h-4" />
            <span>انتهى الوقت! يمكنك الإنجاز الآن</span>
          </motion.div>
        )}

        {/* الخطوات */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md"
        >
          <button
            onClick={() => setShowAllSteps(!showAllSteps)}
            className="text-xs text-muted-foreground hover:text-foreground mb-2"
          >
            {t("task.steps")} ({taskSteps.length}) {showAllSteps ? "▲" : "▼"}
          </button>

          <div className="space-y-2">
            {(showAllSteps ? taskSteps : taskSteps.slice(0, 2)).map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: dir === "rtl" ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-start gap-3 p-3 bg-card/50 rounded-xl"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5"
                  style={{
                    background: `${category?.color}20`,
                    color: category?.color,
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-sm flex-1" dir={dir}>
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* الناتج */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Sparkles className="w-3 h-3" />
          <span dir={dir}>{t("task.output")}: {taskOutput}</span>
        </motion.div>

        {/* زر الإنجاز - مُعطّل حتى ينتهي الوقت */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          {timerCompleted ? (
            <button
              onClick={handleComplete}
              className={clsx(
                "flex items-center gap-2 px-8 py-3 rounded-full",
                "bg-gradient-to-br from-green-500 to-green-600 text-white",
                "hover:shadow-lg hover:scale-105 active:scale-95 transition-all",
                "text-base font-medium"
              )}
            >
              <Check className="w-5 h-5" />
              {t("task.done")}
            </button>
          ) : (
            <button
              disabled
              className={clsx(
                "flex items-center gap-2 px-8 py-3 rounded-full",
                "bg-muted text-muted-foreground/50 cursor-not-allowed",
                "text-base font-medium"
              )}
            >
              <Clock className="w-5 h-5" />
              <span dir={dir}>انتظر انتهاء الوقت للإنجاز</span>
            </button>
          )}
        </motion.div>
      </main>
    </div>
  );
}
