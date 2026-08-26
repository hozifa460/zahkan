/**
 * فئات إضافية للمهام
 *
 * هذه الفئات تُستخدم لتنظيم المهام الإضافية مثل العادات الإيجابية
 * تظهر في شاشة الطاقة لاختيار ما يُناسب المستخدم
 */

import type { TaskCategory, LocalizedText } from "./types";
import { t } from "./types";

export interface CategoryConfig {
  id: string;
  name: LocalizedText;
  emoji: string;
  color: string;
  description: LocalizedText;
}

/**
 * الفئات الإضافية (تظهر بجانب الفئات الأساسية في شاشة الطاقة)
 * كلها مجانية، مكتوبة يدوياً، مناسبة لجميع الأعمار
 */
export const HABIT_CATEGORIES: CategoryConfig[] = [
  {
    id: "habit-body",
    name: t(
      "Body Health",
      "صحة الجسد",
      "صحة الجسم",
      "صحة الجسد",
      "صحة الجسد",
      "صحة الجسم"
    ),
    emoji: "💪",
    color: "#10b981",
    description: t(
      "Hydration, movement, rest.",
      "ترطيب، حركة، راحة.",
      "ترطيب، حركة، راحة.",
      "ترطيب، حركة، راحة.",
      "ترطيب، حركة، راحة.",
      "ترطيب، حركة، راحة."
    ),
  },
  {
    id: "habit-mind",
    name: t(
      "Mind Health",
      "صحة الذهن",
      "صحة المخ",
      "صحة الذهن",
      "صحة الذهن",
      "صحة الذهن"
    ),
    emoji: "🧘",
    color: "#8b5cf6",
    description: t(
      "Meditation, gratitude, calm.",
      "تأمل، امتنان، هدوء.",
      "تأمل، امتنان، هدوء.",
      "تأمل، امتنان، هدوء.",
      "تأمل، امتنان، هدوء.",
      "تأمل، امتنان، هدوء."
    ),
  },
  {
    id: "habit-sleep",
    name: t(
      "Sleep & Rest",
      "النوم والراحة",
      "النوم والراحة",
      "النوم والراحة",
      "النوم والراحة",
      "النوم والراحة"
    ),
    emoji: "😴",
    color: "#3b82f6",
    description: t(
      "Better sleep, evening routine.",
      "نوم أفضل، روتين مسائي.",
      "نوم أحسن، روتين مسائي.",
      "نوم أفضل، روتين مسائي.",
      "نوم أفضل، روتين مسائي.",
      "نوم أحسن، روتين مسائي."
    ),
  },
  {
    id: "habit-silah",
    name: t(
      "Family Bonds",
      "صلة الرحم",
      "صلة الرحم",
      "صلة الرحم",
      "صلة الرحم",
      "صلة الرحم"
    ),
    emoji: "❤️",
    color: "#ec4899",
    description: t(
      "Parents, siblings, friends.",
      "والدين، إخوان، أصدقاء.",
      "والدين، إخوات، أصحاب.",
      "والدين، إخوان، أصدقاء.",
      "والدين، إخوان، أصدقاء.",
      "الوالدين، الخوت، الصحاب."
    ),
  },
  {
    id: "habit-productivity",
    name: t(
      "Productivity",
      "الإنتاجية",
      "الإنتاجية",
      "الإنتاجية",
      "الإنتاجية",
      "الإنتاجية"
    ),
    emoji: "🎯",
    color: "#f59e0b",
    description: t(
      "Plan, focus, complete.",
      "تخطيط، تركيز، إنجاز.",
      "تخطيط، تركيز، إنجاز.",
      "تخطيط، تركيز، إنجاز.",
      "تخطيط، تركيز، إنجاز.",
      "تخطيط، تركيز، إنجاز."
    ),
  },
  {
    id: "habit-deen",
    name: t(
      "Faith & Good Deeds",
      "إيمان وأعمال صالحة",
      "إيمان وأعمال صالحة",
      "إيمان وأعمال صالحة",
      "إيمان وأعمال صالحة",
      "إيمان وأعمال صالحة"
    ),
    emoji: "🕌",
    color: "#14b8a6",
    description: t(
      "Prayer, dhikr, kindness.",
      "صلاة، ذكر، إحسان.",
      "صلاة، ذكر، إحسان.",
      "صلاة، ذكر، إحسان.",
      "صلاة، ذكر، إحسان.",
      "صلاة، ذكر، إحسان."
    ),
  },
];

/** دالة مساعدة للحصول على فئة بمعرّفها */
export function getHabitCategoryById(id: string): CategoryConfig | undefined {
  return HABIT_CATEGORIES.find((c) => c.id === id);
}
