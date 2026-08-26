"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, History, Clock, Star } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useStats } from "@/hooks/useStats";
import { CATEGORIES, getTaskById } from "@/lib/tasks";
import { filterHistory, type HistoryFilter, formatDuration } from "@/lib/stats/analytics";
import type { Locale } from "@/lib/i18n/types";
import clsx from "clsx";

export default function HistoryPage() {
  const router = useRouter();
  const { t, locale: loc, dir } = useLocale();
  const stats = useStats();
  const [filter, setFilter] = useState<HistoryFilter>("week");
  const locale = loc as Locale;

  const filtered = useMemo(
    () => filterHistory(stats.completedTasks, filter),
    [stats.completedTasks, filter]
  );

  const filters: { id: HistoryFilter; label: string }[] = [
    { id: "today", label: "اليوم" },
    { id: "week", label: "الأسبوع" },
    { id: "month", label: "الشهر" },
    { id: "all", label: "الكل" },
  ];

  const handleTaskClick = (taskId: string) => {
    sessionStorage.setItem("currentTaskId", taskId);
    router.push(`/task/${taskId}`);
  };

  // تجميع حسب اليوم
  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach((task) => {
      const date = new Date(task.completedAt);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(task);
    });
    return Object.entries(groups)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, tasks]) => ({ date, tasks }));
  }, [filtered]);

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

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl font-light flex items-center gap-2">
            <History className="w-5 h-5" />
            سجل المهام
          </h1>
          <p className="text-sm text-muted-foreground">
            تاريخ كامل بكل ما أنجزته
          </p>
        </div>

        {/* فلاتر */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={clsx(
                "px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground border border-border hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ملخص */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-card border border-border">
            <div className="text-xs text-muted-foreground">عدد المهام</div>
            <div className="text-2xl font-light">{filtered.length}</div>
          </div>
          <div className="p-3 rounded-2xl bg-card border border-border">
            <div className="text-xs text-muted-foreground">وقت مُستثمر</div>
            <div className="text-2xl font-light">
              {formatDuration(filtered.reduce((sum, t) => sum + t.duration, 0))}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-card border border-border">
            <div className="text-xs text-muted-foreground">XP مكتسب</div>
            <div className="text-2xl font-light text-primary">
              {filtered.reduce((sum, t) => sum + t.xpEarned, 0)}
            </div>
          </div>
        </div>

        {/* السجل */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <div className="text-5xl">📭</div>
            <h3 className="text-lg font-medium">السجل فارغ</h3>
            <p className="text-sm text-muted-foreground">
              ابدأ مهمة وستظهر هنا
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(({ date, tasks }) => {
              const dateObj = new Date(date);
              const today = new Date();
              const isToday =
                dateObj.getFullYear() === today.getFullYear() &&
                dateObj.getMonth() === today.getMonth() &&
                dateObj.getDate() === today.getDate();
              const isYesterday =
                !isToday &&
                dateObj.getFullYear() === today.getFullYear() &&
                dateObj.getMonth() === today.getMonth() &&
                dateObj.getDate() === today.getDate() - 1;

              const dateLabel = isToday
                ? "اليوم"
                : isYesterday
                ? "أمس"
                : dateObj.toLocaleDateString("ar-EG", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  });

              return (
                <div key={date} className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground sticky top-16 bg-background/80 backdrop-blur py-2">
                    {dateLabel} · {tasks.length} {tasks.length === 1 ? "مهمة" : "مهام"}
                  </h3>
                  <div className="space-y-2">
                    {tasks.map((task) => {
                      const taskData = getTaskById(task.taskId);
                      const category = CATEGORIES.find((c) => c.id === task.category);
                      const time = new Date(task.completedAt).toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <motion.button
                          key={`${task.taskId}-${task.completedAt}`}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => handleTaskClick(task.taskId)}
                          className="w-full p-3 rounded-xl bg-card border border-border hover:border-primary/40 transition-all text-start"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-1.5 h-12 rounded-full shrink-0"
                              style={{ background: category?.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
                                <span className="flex items-center gap-0.5">
                                  <Clock className="w-3 h-3" />
                                  {time}
                                </span>
                                <span>·</span>
                                <span>{task.duration}د</span>
                                <span>·</span>
                                <span style={{ color: category?.color }}>
                                  {category?.name.ar}
                                </span>
                              </div>
                              <div className="text-sm font-medium" dir={dir === "rtl" ? "rtl" : "ltr"}>
                                {taskData?.title[locale]}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className={clsx(
                                        "w-3 h-3",
                                        task.rating && s <= task.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground/20"
                                      )}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-primary">+{task.xpEarned} XP</span>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
