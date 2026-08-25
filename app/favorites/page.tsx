"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Star, Heart, Repeat } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useStats } from "@/hooks/useStats";
import { useTask } from "@/hooks/useTasks";
import { CATEGORIES, getTaskById } from "@/lib/tasks";
import clsx from "clsx";

function FavoriteTaskCard({ taskId, rating, onClick }: { taskId: string; rating: number; onClick: () => void }) {
  const task = useTask(taskId);
  const { locale } = useLocale();
  if (!task) return null;
  const category = CATEGORIES.find((c) => c.id === task.category);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all text-start"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-2 h-14 rounded-full shrink-0 mt-0.5"
          style={{ background: category?.color }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground">{category?.name[locale]}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{task.duration}د</span>
            <div className="flex items-center gap-0.5 ms-auto">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={clsx(
                    "w-3 h-3",
                    s <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/20"
                  )}
                />
              ))}
            </div>
          </div>
          <div className="text-base font-medium text-foreground" dir={locale === "en" ? "ltr" : "rtl"}>
            {task.title[locale]}
          </div>
          <div className="text-xs text-muted-foreground mt-1 line-clamp-1" dir={locale === "en" ? "ltr" : "rtl"}>
            {task.description[locale]}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function RepeatedTaskCard({ taskId, count }: { taskId: string; count: number }) {
  const task = getTaskById(taskId);
  const { locale } = useLocale();
  const router = useRouter();
  if (!task) return null;
  const category = CATEGORIES.find((c) => c.id === task.category);

  return (
    <motion.button
      onClick={() => {
        sessionStorage.setItem("currentTaskId", taskId);
        router.push(`/task/${taskId}`);
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 hover:border-primary/60 transition-all text-start"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: category?.color }}
        >
          ×{count}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-primary mb-0.5">
            <Repeat className="w-3 h-3" />
            <span>أعدتها {count} مرات</span>
          </div>
          <div className="text-sm font-medium text-foreground" dir={locale === "en" ? "ltr" : "rtl"}>
            {task.title[locale]}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function FavoritesPage() {
  const router = useRouter();
  const { t, dir } = useLocale();
  const stats = useStats();
  const { favorites, repeatedTasks } = stats;

  const handleTaskClick = (taskId: string) => {
    sessionStorage.setItem("currentTaskId", taskId);
    router.push(`/task/${taskId}`);
  };

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
            <Heart className="w-5 h-5 text-red-400" />
            مهامي المفضلة
          </h1>
          <p className="text-sm text-muted-foreground">المهام التي قيّمتها بـ 4-5 نجوم</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <div className="text-5xl">⭐</div>
            <h3 className="text-lg font-medium">لا توجد مفضّلات بعد</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              أكمل مهمة وقيّمها بـ 4 أو 5 نجوم وستظهر هنا
            </p>
            <button
              onClick={() => router.push("/time")}
              className="mt-4 px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm"
            >
              ابدأ مهمة
            </button>
          </div>
        ) : (
          <>
            {/* المفضّلة */}
            <div className="space-y-2">
              <h2 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                المفضّلة ({favorites.length})
              </h2>
              <div className="space-y-2">
                {favorites.map((fav) => (
                  <FavoriteTaskCard
                    key={`${fav.taskId}-${fav.completedAt}`}
                    taskId={fav.taskId}
                    rating={fav.rating || 0}
                    onClick={() => handleTaskClick(fav.taskId)}
                  />
                ))}
              </div>
            </div>

            {/* المتكررة */}
            {repeatedTasks.length > 0 && (
              <div className="space-y-2 pt-4">
                <h2 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Repeat className="w-4 h-4 text-primary" />
                  المتكررة ({repeatedTasks.length})
                </h2>
                <p className="text-xs text-muted-foreground -mt-1">
                  مهام عدت إليها أكثر من مرتين
                </p>
                <div className="space-y-2">
                  {repeatedTasks.map(({ taskId, count }) => (
                    <RepeatedTaskCard key={taskId} taskId={taskId} count={count} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
