import type { Level } from "./types";

/**
 * المستويات الأربعة للمستخدم
 * - مبتدئ: 0-50 XP
 * - نشط: 50-200 XP
 * - محترف: 200-500 XP
 * - أسطوري: 500+ XP
 */
export const LEVELS: Level[] = [
  {
    id: 1,
    name: "مبتدئ",
    nameEn: "Beginner",
    minXp: 0,
    maxXp: 50,
    color: "#94a3b8",  // رمادي
    emoji: "🌱",
  },
  {
    id: 2,
    name: "نشط",
    nameEn: "Active",
    minXp: 50,
    maxXp: 200,
    color: "#10b981",  // أخضر
    emoji: "⚡",
  },
  {
    id: 3,
    name: "محترف",
    nameEn: "Pro",
    minXp: 200,
    maxXp: 500,
    color: "#8b5cf6",  // بنفسجي
    emoji: "🎯",
  },
  {
    id: 4,
    name: "أسطوري",
    nameEn: "Legendary",
    minXp: 500,
    maxXp: Infinity,
    color: "#f59e0b",  // ذهبي
    emoji: "👑",
  },
];

/** جلب المستوى الحالي بناءً على XP */
export function getLevelByXp(xp: number): Level {
  for (const level of LEVELS) {
    if (xp >= level.minXp && xp < level.maxXp) {
      return level;
    }
  }
  return LEVELS[LEVELS.length - 1];
}

/** جلب المستوى التالي */
export function getNextLevel(currentLevel: Level): Level | null {
  const idx = LEVELS.findIndex((l) => l.id === currentLevel.id);
  if (idx === -1 || idx === LEVELS.length - 1) return null;
  return LEVELS[idx + 1];
}

/** نسبة التقدم في المستوى الحالي (0-100) */
export function getLevelProgress(xp: number): number {
  const level = getLevelByXp(xp);
  if (level.maxXp === Infinity) return 100;
  const range = level.maxXp - level.minXp;
  const progress = xp - level.minXp;
  return Math.min(100, Math.max(0, (progress / range) * 100));
}
