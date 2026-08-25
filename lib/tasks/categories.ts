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
];

export function getCategory(id: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
