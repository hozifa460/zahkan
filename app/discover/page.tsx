"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Calendar, Users, Baby, BookOpen, Cloud } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { LanguageSelector } from "@/components/LanguageSelector";
import { getCurrentSeason, getCurrentSeasonalTasks, SEASONS } from "@/lib/tasks/seasonal";
import { COUPLE_TASKS } from "@/lib/tasks/couple";
import { KIDS_TASKS } from "@/lib/tasks/kids";
import { fetchTodayEvents, type HistoricalEvent, eventToTask } from "@/lib/tasks/historical";
import { fetchWeather, getWeatherCondition, getWeatherLabel, getWeatherEmoji, getWeatherTip } from "@/lib/tasks/weather";
import { getTaskById } from "@/lib/tasks";
import { CATEGORIES } from "@/lib/tasks";
import clsx from "clsx";

type Tab = "seasonal" | "couple" | "kids" | "history" | "weather";

export default function DiscoverPage() {
  const router = useRouter();
  const { dir } = useLocale();
  const [tab, setTab] = useState<Tab>("seasonal");
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState<{
    condition: string;
    label: string;
    emoji: string;
    tip: string;
  } | null>(null);

  // المهام الموسمية حسب الشهر الحالي
  const currentSeason = useMemo(() => getCurrentSeason(), []);
  const seasonalTasks = useMemo(() => getCurrentSeasonalTasks(), [currentSeason]);

  // جلب أحداث اليوم عند فتح تبويب التاريخ
  useEffect(() => {
    if (tab === "history" && events.length === 0) {
      setLoadingEvents(true);
      fetchTodayEvents()
        .then(setEvents)
        .finally(() => setLoadingEvents(false));
    }
  }, [tab, events.length]);

  // جلب الطقس عند فتح تبويب الطقس
  useEffect(() => {
    if (tab === "weather" && !weatherInfo) {
      // الإحداثيات الافتراضية: القاهرة
      fetchWeather(30.0444, 31.2357).then((w) => {
        if (w) {
          const condition = getWeatherCondition(w);
          setWeatherInfo({
            condition,
            label: getWeatherLabel(condition),
            emoji: getWeatherEmoji(condition),
            tip: getWeatherTip(condition),
          });
        }
      });
    }
  }, [tab, weatherInfo]);

  const handleTaskClick = (taskId: string) => {
    sessionStorage.setItem("currentTaskId", taskId);
    router.push(`/task/${taskId}`);
  };

  const tabs: { id: Tab; label: string; icon: typeof Calendar }[] = [
    { id: "seasonal", label: "موسمي", icon: Calendar },
    { id: "weather", label: "الطقس", icon: Cloud },
    { id: "history", label: "من التاريخ", icon: BookOpen },
    { id: "couple", label: "زوجية", icon: Users },
    { id: "kids", label: "أطفال", icon: Baby },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <div className="fixed inset-0 -z-10 bg-background/30" />

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
          <h1 className="text-2xl font-light">استكشاف</h1>
          <p className="text-sm text-muted-foreground">مهام موسمية، تاريخية، للزوجين، وللأطفال</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
                  tab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* المهام الموسمية */}
          {tab === "seasonal" && (
            <motion.div key="seasonal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {SEASONS.filter((s) => s.id === currentSeason).map((season) => (
                <div
                  key={season.id}
                  className="p-4 rounded-2xl border-2"
                  style={{ borderColor: `${season.color}40`, background: `${season.color}10` }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">{season.emoji}</div>
                    <div>
                      <h2 className="text-lg font-medium">{season.name.ar}</h2>
                      <p className="text-xs text-muted-foreground">{season.description.ar}</p>
                    </div>
                  </div>
                </div>
              ))}

              {seasonalTasks.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  لا توجد مهام موسمية حالياً
                </div>
              ) : (
                seasonalTasks.map((task) => {
                  const category = CATEGORIES.find((c) => c.id === task.category);
                  return (
                    <motion.button
                      key={task.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleTaskClick(task.id)}
                      className="w-full p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all text-start"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-14 rounded-full shrink-0" style={{ background: category?.color }} />
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-0.5">
                            {category?.name.ar} · {task.duration}د
                          </div>
                          <div className="text-sm font-medium">{task.title.ar}</div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {task.description.ar}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </motion.div>
          )}

          {/* الطقس */}
          {tab === "weather" && (
            <motion.div key="weather" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {!weatherInfo ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  جاري جلب حالة الطقس...
                </div>
              ) : (
                <>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center">
                    <div className="text-6xl mb-2">{weatherInfo.emoji}</div>
                    <h2 className="text-xl font-medium">{weatherInfo.label}</h2>
                    <p className="text-sm text-muted-foreground mt-2">{weatherInfo.tip}</p>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    مهام مُقترحة بناءً على الطقس في القاهرة. يمكنك تغيير المدينة لاحقاً.
                  </p>
                </>
              )}
            </motion.div>
          )}

          {/* من التاريخ */}
          {tab === "history" && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {loadingEvents ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  جاري جلب أحداث اليوم...
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  لا توجد أحداث لهذا اليوم
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-card border border-border text-center">
                    <div className="text-sm text-muted-foreground">في مثل هذا اليوم</div>
                    <div className="text-2xl font-light mt-1">
                      {new Date().toLocaleDateString("ar-EG", { day: "numeric", month: "long" })}
                    </div>
                  </div>
                  {events.map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-2xl bg-card border border-border"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl font-light text-primary tabular-nums">
                          {event.year}
                        </div>
                        <div className="flex-1 text-sm">{event.text}</div>
                      </div>
                    </motion.div>
                  ))}
                  <p className="text-xs text-center text-muted-foreground">
                    المصدر: Wikipedia (مجاني ومفتوح)
                  </p>
                </>
              )}
            </motion.div>
          )}

          {/* مهام زوجية */}
          {tab === "couple" && (
            <motion.div key="couple" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-center">
                <div className="text-3xl mb-1">💕</div>
                <p className="text-sm text-muted-foreground">مهام تُنفّذ مع شخص تحبّه</p>
              </div>
              {COUPLE_TASKS.map((task) => {
                const category = CATEGORIES.find((c) => c.id === task.category);
                return (
                  <motion.button
                    key={task.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleTaskClick(task.id)}
                    className="w-full p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all text-start"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-14 rounded-full shrink-0" style={{ background: category?.color }} />
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground mb-0.5">
                          {category?.name.ar} · {task.duration}د
                        </div>
                        <div className="text-sm font-medium">{task.title.ar}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {task.description.ar}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* مهام أطفال */}
          {tab === "kids" && (
            <motion.div key="kids" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                <div className="text-3xl mb-1">🧒</div>
                <p className="text-sm text-muted-foreground">مهام بسيطة وآمنة للصغار</p>
              </div>
              {KIDS_TASKS.map((task) => {
                const category = CATEGORIES.find((c) => c.id === task.category);
                return (
                  <motion.button
                    key={task.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleTaskClick(task.id)}
                    className="w-full p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all text-start"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-14 rounded-full shrink-0" style={{ background: category?.color }} />
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground mb-0.5">
                          {category?.name.ar} · {task.duration}د
                        </div>
                        <div className="text-sm font-medium">{task.title.ar}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {task.description.ar}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
