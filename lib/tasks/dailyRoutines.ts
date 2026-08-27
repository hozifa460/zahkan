import type { TaskCategory } from "./types";

/**
 * روتين يومي = 3 مهام متتالية تكوّن عادة.
 * فقط صباحي + مسائي.
 */

export type RoutineId = "morning" | "evening";

export interface DailyRoutine {
  id: RoutineId;
  icon: string;
  color: string;
  greeting: string;
  tasks: Array<{
    title: string;
    category: TaskCategory;
    duration: 2 | 5 | 10 | 30;
    description: string;
  }>;
}

/**
 * يحدد الروتين حسب ساعة المتصفح.
 * - 5:00 — 16:59 → صباحي
 * - 17:00 — 4:59 → مسائي
 */
export function getCurrentRoutineId(): RoutineId {
  if (typeof window === "undefined") return "morning";
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 17) return "morning";
  return "evening";
}

export const DAILY_ROUTINES: DailyRoutine[] = [
  {
    id: "morning",
    icon: "🌅",
    color: "#f59e0b",
    greeting: "صباح الخير",
    tasks: [
      {
        title: "اقرأ صفحة من القرآن",
        category: "habit-deen",
        duration: 10,
        description: "افتح المصحف واقرأ صفحة واحدة بتدبّر",
      },
      {
        title: "اشرب كوب ماء",
        category: "habit-body",
        duration: 2,
        description: "ابدأ يومك بالترطيب — كوب ماء كامل",
      },
      {
        title: "حدّد نية اليوم",
        category: "habit-mind",
        duration: 2,
        description: "اكتب في دفترك: ما الذي تريد إنجازه اليوم؟",
      },
    ],
  },
  {
    id: "evening",
    icon: "🌙",
    color: "#6366f1",
    greeting: "مساء الخير",
    tasks: [
      {
        title: "اقرأ أذكار المساء",
        category: "habit-deen",
        duration: 5,
        description: "اقرأ أذكار المساء من السنة",
      },
      {
        title: "جهّز ملابس/حقائب الغد",
        category: "habit-productivity",
        duration: 5,
        description: "حضّر كل شيء للغد قبل النوم بـ 30د",
      },
      {
        title: "نم أبكر 30 دقيقة",
        category: "habit-sleep",
        duration: 2,
        description: "أطفئ الشاشات واضبط المنبّه",
      },
    ],
  },
];
