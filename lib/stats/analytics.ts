/**
 * دوال التحليل المتقدم للإحصائيات
 *
 * - السجل الزمني
 * - الخريطة الحرارية
 * - المقارنات الأسبوعية
 * - أنماط السلوك
 */

import type { CompletedTask, Mood, TimeOfDay } from "./types";

/** يوم في الأسبوع (0=الأحد، 6=السبت) */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DailyStats {
  date: string;             // YYYY-MM-DD
  count: number;
  totalMinutes: number;
  categories: Record<string, number>;
  moods: Record<Mood, number>;
  averageRating: number;
  hours: Record<number, number>;  // hour (0-23) -> count
}

export interface WeeklyComparison {
  thisWeek: {
    count: number;
    minutes: number;
    xp: number;
    topCategory: string | null;
  };
  lastWeek: {
    count: number;
    minutes: number;
    xp: number;
    topCategory: string | null;
  };
  diff: {
    count: number;        // فرق عدد المهام
    minutes: number;      // فرق الدقائق
    xp: number;
  };
  percentChange: number;  // % تغيير في عدد المهام
}

/** تجميع المهام حسب اليوم */
export function groupByDay(tasks: CompletedTask[], daysBack = 30): DailyStats[] {
  const result: DailyStats[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const dayTasks = tasks.filter((t) => {
      const tDate = new Date(t.completedAt);
      return (
        tDate.getFullYear() === d.getFullYear() &&
        tDate.getMonth() === d.getMonth() &&
        tDate.getDate() === d.getDate()
      );
    });

    const hours: Record<number, number> = {};
    dayTasks.forEach((t) => {
      const h = new Date(t.completedAt).getHours();
      hours[h] = (hours[h] || 0) + 1;
    });

    const categories: Record<string, number> = {};
    const moods: Record<Mood, number> = { tired: 0, energetic: 0, scattered: 0, calm: 0 };
    let totalRating = 0;
    let ratedCount = 0;

    dayTasks.forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + 1;
      if (t.mood) moods[t.mood]++;
      if (t.rating) {
        totalRating += t.rating;
        ratedCount++;
      }
    });

    result.push({
      date: dateStr,
      count: dayTasks.length,
      totalMinutes: dayTasks.reduce((sum, t) => sum + t.duration, 0),
      categories,
      moods,
      averageRating: ratedCount > 0 ? totalRating / ratedCount : 0,
      hours,
    });
  }

  return result;
}

/** خريطة حرارية: 7 أيام × 24 ساعة */
export interface HeatmapCell {
  day: DayOfWeek;
  hour: number;
  count: number;
  intensity: number;  // 0-1
}

export function buildHeatmap(tasks: CompletedTask[]): HeatmapCell[] {
  // مصفوفة [يوم][ساعة] -> عدد
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));

  tasks.forEach((t) => {
    const d = new Date(t.completedAt);
    const day = d.getDay() as DayOfWeek;
    const hour = d.getHours();
    grid[day][hour]++;
  });

  // حساب الحد الأقصى لتطبيع الشدة
  let max = 1;
  grid.forEach((row) => {
    row.forEach((c) => {
      if (c > max) max = c;
    });
  });

  const cells: HeatmapCell[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      cells.push({
        day: day as DayOfWeek,
        hour,
        count: grid[day][hour],
        intensity: grid[day][hour] / max,
      });
    }
  }

  return cells;
}

/** مقارنة هذا الأسبوع مع الماضي */
export function compareWeeks(tasks: CompletedTask[]): WeeklyComparison {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const thisWeekTasks = tasks.filter((t) => t.completedAt >= weekAgo.getTime());
  const lastWeekTasks = tasks.filter(
    (t) => t.completedAt >= twoWeeksAgo.getTime() && t.completedAt < weekAgo.getTime()
  );

  function summarize(arr: CompletedTask[]) {
    const categories: Record<string, number> = {};
    arr.forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + 1;
    });
    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    return {
      count: arr.length,
      minutes: arr.reduce((sum, t) => sum + t.duration, 0),
      xp: arr.reduce((sum, t) => sum + t.xpEarned, 0),
      topCategory,
    };
  }

  const tw = summarize(thisWeekTasks);
  const lw = summarize(lastWeekTasks);

  const diff = {
    count: tw.count - lw.count,
    minutes: tw.minutes - lw.minutes,
    xp: tw.xp - lw.xp,
  };

  const percentChange = lw.count > 0
    ? Math.round(((tw.count - lw.count) / lw.count) * 100)
    : tw.count > 0 ? 100 : 0;

  return {
    thisWeek: tw,
    lastWeek: lw,
    diff,
    percentChange,
  };
}

/** الساعات الأكثر إنتاجية */
export function getMostProductiveHours(tasks: CompletedTask[]): Array<{ hour: number; count: number }> {
  const counts: Record<number, number> = {};
  tasks.forEach((t) => {
    const h = new Date(t.completedAt).getHours();
    counts[h] = (counts[h] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([h, c]) => ({ hour: Number(h), count: c }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

/** الأيام الأكثر إنتاجية */
export function getMostProductiveDays(tasks: CompletedTask[]): Array<{ day: DayOfWeek; count: number }> {
  const counts: Record<number, number> = {};
  tasks.forEach((t) => {
    const d = new Date(t.completedAt).getDay();
    counts[d] = (counts[d] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([d, c]) => ({ day: Number(d) as DayOfWeek, count: c }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

const DAY_NAMES_AR = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const DAY_NAMES_SHORT_AR = ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];

export function getDayName(day: DayOfWeek, short = false): string {
  return short ? DAY_NAMES_SHORT_AR[day] : DAY_NAMES_AR[day];
}

/** فلاتر السجل */
export type HistoryFilter = "all" | "today" | "week" | "month";

export function filterHistory(tasks: CompletedTask[], filter: HistoryFilter): CompletedTask[] {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const startOfMonth = new Date(now);
  startOfMonth.setDate(startOfMonth.getDate() - 30);

  switch (filter) {
    case "today":
      return tasks.filter((t) => t.completedAt >= startOfDay.getTime());
    case "week":
      return tasks.filter((t) => t.completedAt >= startOfWeek.getTime());
    case "month":
      return tasks.filter((t) => t.completedAt >= startOfMonth.getTime());
    case "all":
    default:
      return tasks;
  }
}

/** تنسيق المدة */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}د`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}س ${mins}د` : `${hours}س`;
}
