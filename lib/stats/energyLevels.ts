/**
 * 5 مستويات طاقة (بدلاً من 3)
 *
 * يسمح بتوصيات أدق بناءً على طاقة المستخدم الفعلية
 */

export type EnergyLevel = "very_low" | "low" | "medium" | "high" | "very_high";

export interface EnergyLevelInfo {
  id: EnergyLevel;
  name: {
    ar: string;
    en: string;
  };
  emoji: string;
  color: string;
  description: {
    ar: string;
    en: string;
  };
  /** معامل XP للطاقة (الأعلى = أكثر صعوبة = أكثر XP) */
  xpMultiplier: number;
}

export const ENERGY_LEVELS: EnergyLevelInfo[] = [
  {
    id: "very_low",
    name: { ar: "منهك", en: "Drained" },
    emoji: "😫",
    color: "#6b7280",
    description: {
      ar: "طاقة شبه معدومة. تحتاج راحة حقيقية.",
      en: "Almost no energy. Real rest needed.",
    },
    xpMultiplier: 0.5,
  },
  {
    id: "low",
    name: { ar: "مُتعب", en: "Tired" },
    emoji: "😴",
    color: "#94a3b8",
    description: {
      ar: "طاقة منخفضة. مهام خفيفة فقط.",
      en: "Low energy. Only light tasks.",
    },
    xpMultiplier: 0.8,
  },
  {
    id: "medium",
    name: { ar: "متوازن", en: "Balanced" },
    emoji: "🙂",
    color: "#10b981",
    description: {
      ar: "طاقة متوازنة. تستطيع فعل أي شيء.",
      en: "Balanced energy. Can do anything.",
    },
    xpMultiplier: 1.0,
  },
  {
    id: "high",
    name: { ar: "نشيط", en: "Energetic" },
    emoji: "💪",
    color: "#f97316",
    description: {
      ar: "طاقة عالية. حان وقت البناء.",
      en: "High energy. Time to build.",
    },
    xpMultiplier: 1.2,
  },
  {
    id: "very_high",
    name: { ar: "فيـ.قـ.د", en: "Peak" },
    emoji: "⚡",
    color: "#ef4444",
    description: {
      ar: "ذروة الطاقة! استغلها في شيء صعب.",
      en: "Peak energy! Use it for something hard.",
    },
    xpMultiplier: 1.5,
  },
];

/** الحصول على المستوى من المعرّف */
export function getEnergyLevelById(id: EnergyLevel): EnergyLevelInfo {
  return ENERGY_LEVELS.find((e) => e.id === id) || ENERGY_LEVELS[2];
}

/** اقتراح المستوى بناءً على وقت اليوم */
export function suggestEnergyByTime(hour: number): EnergyLevel {
  if (hour >= 1 && hour < 6) return "very_low";      // madrugada
  if (hour >= 6 && hour < 10) return "high";         // صباح
  if (hour >= 10 && hour < 14) return "very_high";   // ذروة الظهيرة
  if (hour >= 14 && hour < 17) return "medium";      // بعد الظهر
  if (hour >= 17 && hour < 21) return "high";        // مساء
  return "low";                                        // ليل
}
