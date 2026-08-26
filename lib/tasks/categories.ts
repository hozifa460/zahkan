import type { CategoryInfo } from "./types";
import { t } from "./types";

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "mental",
    name: t("Mental", "ذهنية", "ذهنية", "ذهنية", "ذهنية", "ذهنية"),
    icon: "Brain",
    color: "#8b5cf6", // بنفسجي
    description: t(
      "Think, solve, learn",
      "تفكير، حل، تعلّم",
      "تفكير، حل، تعلّم",
      "تفكير، حل، تعلّم",
      "تفكير، حل، تعلّم",
      "تفكير، حل، تعلّم"
    ),
  },
  {
    id: "physical",
    name: t("Physical", "حركية", "حركية", "حركية", "حركية", "حركية"),
    icon: "Dumbbell",
    color: "#f97316", // برتقالي
    description: t(
      "Move your body",
      "حرّك جسدك",
      "حرّك جسمك",
      "حرّك جسمك",
      "حرّك جسمك",
      "حرّك جسمك"
    ),
  },
  {
    id: "creative",
    name: t("Creative", "إبداعية", "إبداعية", "إبداعية", "إبداعية", "إبداعية"),
    icon: "Palette",
    color: "#ec4899", // وردي
    description: t(
      "Make something",
      "اصنع شيئاً",
      "اعمل حاجة",
      "اسوِ شي",
      "اعمل شي",
      "دير شي"
    ),
  },
  {
    id: "learning",
    name: t("Learning", "تعلّم", "تعلّم", "تعلّم", "تعلّم", "تعلّم"),
    icon: "BookOpen",
    color: "#3b82f6", // أزرق
    description: t(
      "Real knowledge",
      "معلومة حقيقية",
      "معلومة حقيقية",
      "معلومة حقيقية",
      "معلومة حقيقية",
      "معلومة حقيقية"
    ),
  },
  {
    id: "building",
    name: t("Building", "بناء", "بناء", "بناء", "بناء", "بناء"),
    icon: "Code2",
    color: "#06b6d4", // سماوي
    description: t(
      "Code and create",
      "كود وصُنع",
      "كود وصُنع",
      "كود وصُنع",
      "كود وصُنع",
      "كود وصُنع"
    ),
  },
  {
    id: "mindfulness",
    name: t("Mindfulness", "صفاء", "صفاء", "صفاء", "صفاء", "صفاء"),
    icon: "Wind",
    color: "#6366f1", // نيلي
    description: t(
      "Calm and focus",
      "هدوء وتركيز",
      "هدوء وتركيز",
      "هدوء وتركيز",
      "هدوء وتركيز",
      "هدوء وتركيز"
    ),
  },
  {
    id: "discovery",
    name: t("Discovery", "اكتشاف", "اكتشاف", "اكتشاف", "اكتشاف", "اكتشاف"),
    icon: "Search",
    color: "#eab308", // أصفر
    description: t(
      "Notice the world",
      "لاحظ العالم",
      "لاحظ العالم",
      "لاحظ العالم",
      "لاحظ العالم",
      "لاحظ العالم"
    ),
  },
  // ========== فئات العادات الإيجابية ==========
  {
    id: "habit-body",
    name: t("Body Health", "صحة الجسد", "صحة الجسم", "صحة الجسد", "صحة الجسد", "صحة الجسم"),
    icon: "Heart",
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
    name: t("Mind Health", "صحة الذهن", "صحة المخ", "صحة الذهن", "صحة الذهن", "صحة الذهن"),
    icon: "Sparkles",
    color: "#8b5cf6",
    description: t(
      "Meditate, breathe, be present.",
      "تأمل، تنفّس، كن حاضراً.",
      "تأمل، تنفّس، كن حاضر.",
      "تأمل، تنفّس، كن حاضراً.",
      "تأمل، تنفّس، كن حاضراً.",
      "تأمل، تنفّس، كون حاضر."
    ),
  },
  {
    id: "habit-sleep",
    name: t("Sleep & Rest", "النوم والراحة", "النوم والراحة", "النوم والراحة", "النوم والراحة", "النوم والراحة"),
    icon: "Moon",
    color: "#3b82f6",
    description: t(
      "Better sleep, deeper rest.",
      "نوم أفضل، راحة أعمق.",
      "نوم أحسن، راحة أعمق.",
      "نوم أفضل، راحة أعمق.",
      "نوم أفضل، راحة أعمق.",
      "نوم أحسن، راحة أعمق."
    ),
  },
  {
    id: "habit-silah",
    name: t("Family Bonds", "صلة الرحم", "صلة الرحم", "صلة الرحم", "صلة الرحم", "صلة الرحم"),
    icon: "Users",
    color: "#ec4899",
    description: t(
      "Parents, family, friends, neighbors.",
      "والدين، عائلة، أصدقاء، جيران.",
      "والدين، عيلة، أصحاب، جيران.",
      "والدين، عائلة، أصدقاء، جيران.",
      "والدين، عائلة، أصدقاء، جيران.",
      "الوالدين، العائلة، الصحاب، الجيران."
    ),
  },
  {
    id: "habit-productivity",
    name: t("Productivity", "الإنتاجية", "الإنتاجية", "الإنتاجية", "الإنتاجية", "الإنتاجية"),
    icon: "Target",
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
    name: t("Faith & Good Deeds", "إيمان وأعمال صالحة", "إيمان وأعمال صالحة", "إيمان وأعمال صالحة", "إيمان وأعمال صالحة", "إيمان وأعمال صالحة"),
    icon: "BookHeart",
    color: "#14b8a6",
    description: t(
      "Dhikr, Quran, charity, intention.",
      "ذكر، قرآن، صدقة، نية.",
      "ذكر، قرآن، صدقة، نية.",
      "ذكر، قرآن، صدقة، نية.",
      "ذكر، قرآن، صدقة، نية.",
      "ذكر، قرآن، صدقة، نية."
    ),
  },
];

export function getCategory(id: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
