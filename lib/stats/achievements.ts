import type { CompletedTask, Achievement, Mood } from "./types";
import { getLevelByXp } from "./levels";
import { CATEGORIES } from "@/lib/tasks";

/** تنسيق التاريخ كـ YYYY-MM-DD */
export function formatDate(date: Date | number): string {
  const d = typeof date === "number" ? new Date(date) : date;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** حساب السلسلة الحالية بناءً على المهام المُنجزة */
export function calculateStreak(completed: CompletedTask[]): {
  current: number;
  longest: number;
  lastActive: string;
} {
  if (completed.length === 0) {
    return { current: 0, longest: 0, lastActive: "" };
  }

  // اجمع التواريخ الفريدة (يوم-يوم)
  const datesSet = new Set(completed.map((c) => formatDate(c.completedAt)));
  const dates = Array.from(datesSet).sort();

  // أطول سلسلة
  let longest = 1;
  let currentRun = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentRun++;
      longest = Math.max(longest, currentRun);
    } else {
      currentRun = 1;
    }
  }

  // السلسلة الحالية
  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const lastDate = dates[dates.length - 1];

  let current = 0;
  if (lastDate === today || lastDate === yesterday) {
    // ابدأ من آخر تاريخ وارجع
    current = 1;
    for (let i = dates.length - 2; i >= 0; i--) {
      const curr = new Date(dates[i + 1]);
      const prev = new Date(dates[i]);
      const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        current++;
      } else {
        break;
      }
    }
  }

  return {
    current,
    longest: Math.max(longest, current),
    lastActive: lastDate,
  };
}

/** عدّ المهام حسب الفئة */
export function countByCategory(completed: CompletedTask[]): Record<string, number> {
  const counts: Record<string, number> = {};
  CATEGORIES.forEach((c) => (counts[c.id] = 0));
  completed.forEach((t) => {
    counts[t.category] = (counts[t.category] || 0) + 1;
  });
  return counts;
}

/** إحصائيات المزاج */
export function moodStats(completed: CompletedTask[]): Record<Mood, number> {
  const stats: Record<Mood, number> = {
    tired: 0,
    energetic: 0,
    scattered: 0,
    calm: 0,
  };
  completed.forEach((t) => {
    if (t.mood) stats[t.mood]++;
  });
  return stats;
}

/** حساب أوزان الفئات (للتوصية) */
export function calculateCategoryWeights(completed: CompletedTask[]): Record<string, number> {
  const weights: Record<string, number> = {};
  CATEGORIES.forEach((c) => (weights[c.id] = 1.0));  // وزن ابتدائي 1.0

  completed.slice(-30).forEach((t) => {  // آخر 30 مهمة فقط
    const weightDelta = t.rating
      ? (t.rating - 3) * 0.2  // تقييم 5 = +0.4، تقييم 1 = -0.4
      : 0;
    weights[t.category] = Math.max(0.1, (weights[t.category] || 1) + weightDelta);
  });

  return weights;
}

/** قائمة الإنجازات */
export function checkAchievements(stats: {
  completedTasks: CompletedTask[];
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
}): Achievement[] {
  const total = stats.completedTasks.length;
  const byCat = countByCategory(stats.completedTasks);
  const allCategoriesTried = CATEGORIES.every((c) => (byCat[c.id] || 0) > 0);
  const highRated = stats.completedTasks.filter((t) => t.rating === 5).length;

  return [
    {
      id: "first-task",
      name: "البداية",
      description: "أكمل أول مهمة",
      icon: "🌱",
      unlocked: total >= 1,
      progress: Math.min(100, (total / 1) * 100),
      target: 1,
    },
    {
      id: "ten-tasks",
      name: "عشرة",
      description: "أكمل 10 مهام",
      icon: "🔟",
      unlocked: total >= 10,
      progress: Math.min(100, (total / 10) * 100),
      target: 10,
    },
    {
      id: "fifty-tasks",
      name: "نصف قرن",
      description: "أكمل 50 مهمة",
      icon: "🎯",
      unlocked: total >= 50,
      progress: Math.min(100, (total / 50) * 100),
      target: 50,
    },
    {
      id: "hundred-tasks",
      name: "مئة",
      description: "أكمل 100 مهمة",
      icon: "💯",
      unlocked: total >= 100,
      progress: Math.min(100, (total / 100) * 100),
      target: 100,
    },
    {
      id: "streak-3",
      name: "3 أيام متتالية",
      description: "حافظ على السلسلة لثلاثة أيام",
      icon: "🔥",
      unlocked: stats.longestStreak >= 3,
      progress: Math.min(100, (stats.longestStreak / 3) * 100),
      target: 3,
    },
    {
      id: "streak-7",
      name: "أسبوع كامل",
      description: "حافظ على السلسلة لأسبوع",
      icon: "🌟",
      unlocked: stats.longestStreak >= 7,
      progress: Math.min(100, (stats.longestStreak / 7) * 100),
      target: 7,
    },
    {
      id: "streak-30",
      name: "شهر",
      description: "30 يوم متتالية",
      icon: "👑",
      unlocked: stats.longestStreak >= 30,
      progress: Math.min(100, (stats.longestStreak / 30) * 100),
      target: 30,
    },
    {
      id: "all-categories",
      name: "مُتنوّع",
      description: "جرّب كل الفئات السبع",
      icon: "🌈",
      unlocked: allCategoriesTried,
      progress: Math.min(100, (Object.values(byCat).filter((c) => c > 0).length / 7) * 100),
      target: 7,
    },
    {
      id: "loved-5",
      name: "محبوب",
      description: "5 مهام حصلت على تقييم 5 نجوم",
      icon: "⭐",
      unlocked: highRated >= 5,
      progress: Math.min(100, (highRated / 5) * 100),
      target: 5,
    },
    {
      id: "level-pro",
      name: "محترف",
      description: "اوصل لمستوى محترف (200 XP)",
      icon: "🎖️",
      unlocked: stats.totalXp >= 200,
      progress: Math.min(100, (stats.totalXp / 200) * 100),
      target: 200,
    },
  ];
}
