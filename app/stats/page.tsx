"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Trash2, Trophy, Target, Clock, Flame, History } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { LanguageSelector } from "@/components/LanguageSelector";
import { StreakBadge } from "@/components/StreakBadge";
import { LevelBadge } from "@/components/LevelBadge";
import { Heatmap } from "@/components/Heatmap";
import { WeeklyComparison } from "@/components/WeeklyComparison";
import { useStats } from "@/hooks/useStats";
import { CATEGORIES } from "@/lib/tasks";
import { getMostProductiveHours, getMostProductiveDays, getDayName, formatDuration } from "@/lib/stats/analytics";
import clsx from "clsx";

export default function StatsPage() {
  const router = useRouter();
  const { dir } = useLocale();
  const stats = useStats();

  const handleClear = () => {
    if (confirm("هل أنت متأكد من حذف كل البيانات؟ لا يمكن التراجع.")) {
      stats.clearAll();
    }
  };

  const maxCategoryCount = Math.max(1, ...Object.values(stats.categoryCounts));

  // حساب الوقت المُستثمر
  const totalMinutes = stats.completedTasks.reduce((sum, t) => sum + t.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  // آخر 7 أيام
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString().split("T")[0],
      count: stats.completedTasks.filter(
        (t) => new Date(t.completedAt).toISOString().split("T")[0] === d.toISOString().split("T")[0]
      ).length,
    };
  });
  const max7Day = Math.max(1, ...last7Days.map((d) => d.count));

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
        {/* العنوان */}
        <div>
          <h1 className="text-2xl font-light">إحصائياتي</h1>
          <p className="text-sm text-muted-foreground">رحلتك في تحويل الملل إلى بناء</p>
        </div>

        {/* المستوى + السلسلة */}
        <div className="flex flex-wrap items-center gap-3">
          <LevelBadge level={stats.level} totalXp={stats.totalXp} progress={stats.levelProgress} size="lg" />
          {stats.currentStreak > 0 && <StreakBadge streak={stats.currentStreak} size="lg" />}
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox
            icon={<Target className="w-4 h-4" />}
            label="مهام مكتملة"
            value={stats.completedTasks.length.toString()}
            color="#10b981"
          />
          <StatBox
            icon={<Flame className="w-4 h-4" />}
            label="أطول سلسلة"
            value={stats.longestStreak.toString()}
            color="#f97316"
          />
          <StatBox
            icon={<Clock className="w-4 h-4" />}
            label="وقت مُستثمر"
            value={hours > 0 ? `${hours}س ${mins}د` : `${mins}د`}
            color="#3b82f6"
          />
          <StatBox
            icon={<Trophy className="w-4 h-4" />}
            label="XP"
            value={stats.totalXp.toString()}
            color="#eab308"
          />
        </div>

        {/* آخر 7 أيام */}
        <div className="p-4 rounded-2xl bg-card border border-border">
          <h2 className="text-sm font-medium mb-3">آخر 7 أيام</h2>
          <div className="flex items-end gap-2 h-24">
            {last7Days.map((d, i) => {
              const height = (d.count / max7Day) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className={clsx(
                      "w-full rounded-t-md",
                      d.count > 0 ? "bg-primary" : "bg-border"
                    )}
                    style={{ minHeight: d.count > 0 ? "4px" : "2px" }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(d.date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🆕 المقارنة الأسبوعية */}
        {stats.completedTasks.length >= 3 && <WeeklyComparison />}

        {/* 🆕 الخريطة الحرارية */}
        {stats.completedTasks.length >= 5 && <Heatmap />}

        {/* 🆕 أذكى الأوقات */}
        {stats.completedTasks.length >= 5 && (
          <div className="p-4 rounded-2xl bg-card border border-border">
            <h2 className="text-sm font-medium mb-3">أذكى أوقاتك</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-2">أكثر الساعات</div>
                <div className="space-y-1.5">
                  {getMostProductiveHours(stats.completedTasks).slice(0, 3).map((h) => (
                    <div key={h.hour} className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-center font-mono text-primary">
                        {h.hour.toString().padStart(2, "0")}:00
                      </span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(h.count / stats.completedTasks.length) * 100 * 3}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{h.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-2">أكثر الأيام</div>
                <div className="space-y-1.5">
                  {getMostProductiveDays(stats.completedTasks).slice(0, 3).map((d) => (
                    <div key={d.day} className="flex items-center gap-2 text-sm">
                      <span className="w-12 text-muted-foreground text-xs">
                        {getDayName(d.day)}
                      </span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(d.count / stats.completedTasks.length) * 100 * 3}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* الفئات */}
        <div className="p-4 rounded-2xl bg-card border border-border">
          <h2 className="text-sm font-medium mb-3">المهام حسب الفئة</h2>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => {
              const count = stats.categoryCounts[cat.id] || 0;
              const pct = (count / maxCategoryCount) * 100;
              return (
                <div key={cat.id} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-muted-foreground shrink-0">
                    {cat.name.ar}
                  </div>
                  <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ background: cat.color }}
                    />
                  </div>
                  <div className="w-8 text-xs font-mono text-muted-foreground text-end">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* الإنجازات */}
        <div className="p-4 rounded-2xl bg-card border border-border">
          <h2 className="text-sm font-medium mb-3">الإنجازات ({stats.unlockedAchievements.length}/{stats.achievements.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {stats.achievements.map((ach) => (
              <div
                key={ach.id}
                className={clsx(
                  "p-3 rounded-xl border text-center transition-all",
                  ach.unlocked
                    ? "bg-primary/10 border-primary/30"
                    : "bg-card border-border opacity-50"
                )}
              >
                <div className="text-2xl mb-1">{ach.unlocked ? ach.icon : "🔒"}</div>
                <div className="text-xs font-medium">{ach.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {ach.description}
                </div>
                {ach.target && (
                  <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${ach.progress || 0}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* روابط إضافية */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push("/history")}
            className="p-3 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex items-center gap-3"
          >
            <History className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">سجل المهام</span>
          </button>
          <button
            onClick={() => router.push("/favorites")}
            className="p-3 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex items-center gap-3"
          >
            <span className="text-red-400">♥</span>
            <span className="text-sm">المفضّلة</span>
          </button>
        </div>

        {/* مسح البيانات */}
        <button
          onClick={handleClear}
          className="w-full p-3 rounded-2xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          مسح كل البيانات
        </button>
      </main>
    </div>
  );
}

function StatBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="p-3 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-1.5 mb-1" style={{ color }}>
        {icon}
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-xl font-light">{value}</div>
    </div>
  );
}
