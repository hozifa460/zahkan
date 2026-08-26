import type { TaskCategory } from "./types";

/**
 * روتين يومي = 3 مهام متتالية تكوّن عادة.
 * عند إكمالها كلها → إنجاز + XP مكافأة.
 */

export type RoutineId = "morning" | "evening" | "work" | "study";

export interface DailyRoutine {
  id: RoutineId;
  icon: string;
  color: string;
  tasks: Array<{
    title: string;
    category: TaskCategory;
    duration: 2 | 5 | 10 | 30; // دقائق
    description: string;
  }>;
}

export const DAILY_ROUTINES: DailyRoutine[] = [
  {
    id: "morning",
    icon: "🌅",
    color: "#f59e0b", // كهرماني
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
    color: "#6366f1", // نيلي
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
  {
    id: "work",
    icon: "💼",
    color: "#10b981", // أخضر
    tasks: [
      {
        title: "رتّب مكتبك/مساحتك",
        category: "habit-productivity",
        duration: 5,
        description: "ترتيب سريع: أوراق، أدوات، شاشة",
      },
      {
        title: "حدّد 3 مهام لليوم",
        category: "habit-mind",
        duration: 5,
        description: "اكتب أهم 3 مهام يجب إنجازها اليوم",
      },
      {
        title: "ابدأ أصعب مهمة فوراً",
        category: "habit-productivity",
        duration: 10,
        description: "ابدأ المهمة الأصعب قبل ما يفوتك الوقت",
      },
    ],
  },
  {
    id: "study",
    icon: "📚",
    color: "#ec4899", // وردي
    tasks: [
      {
        title: "راجع ملاحظات الأمس",
        category: "habit-mind",
        duration: 5,
        description: "افتح دفتر الأمس وراجع بسرعة",
      },
      {
        title: "اقرأ صفحة من كتابك",
        category: "habit-mind",
        duration: 10,
        description: "اقرأ بتركيز — صفحة واحدة بتدبّر",
      },
      {
        title: "لخّص ما فهمت بسطرين",
        category: "habit-productivity",
        duration: 5,
        description: "اكتب خلاصة ما تعلمته بكلماتك",
      },
    ],
  },
];
