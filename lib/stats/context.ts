import type { TimeOfDay, Mood } from "./types";
import type { TaskEnergy } from "@/lib/tasks";

/**
 * كشف فترة اليوم الحالية بناءً على الساعة
 * - morning: 5-11
 * - noon: 11-15
 * - evening: 15-19
 * - night: 19-5
 */
export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 15) return "noon";
  if (hour >= 15 && hour < 19) return "evening";
  return "night";
}

/** ترجمة وقت اليوم حسب اللغة */
export function getTimeOfDayLabel(time: TimeOfDay, locale: string = "ar"): string {
  const labels: Record<string, Record<TimeOfDay, string>> = {
    ar: {
      morning: "الصباح",
      noon: "الظهيرة",
      evening: "المساء",
      night: "الليل",
    },
    en: {
      morning: "Morning",
      noon: "Midday",
      evening: "Evening",
      night: "Night",
    },
  };
  return labels[locale]?.[time] || labels.ar[time];
}

/**
 * اقتراح طاقة بناءً على وقت اليوم
 * - صباح: طاقة عالية (فيزيائية)
 * - ظهر: طاقة متوسطة (ذهنية/إبداعية)
 * - مساء: إبداع
 * - ليل: هدوء وصفاء
 */
export function suggestEnergyForTime(time: TimeOfDay): TaskEnergy {
  switch (time) {
    case "morning":
      return "high";
    case "noon":
      return "medium";
    case "evening":
      return "medium";
    case "night":
      return "low";
  }
}

/**
 * خريطة المزاج → الفئات المفضّلة
 * - tired (تعبان): صفاء + تعلم خفيف
 * - energetic (طاقة عالية): حركية + بناء
 * - scattered (مشتت): ذهنية + إبداعية
 * - calm (هادئ): تعلم + إبداع عميق
 */
export const MOOD_CATEGORIES: Record<Mood, string[]> = {
  tired: ["mindfulness", "learning"],
  energetic: ["physical", "building"],
  scattered: ["mental", "creative"],
  calm: ["learning", "creative"],
};

/** ترجمة المزاج */
export function getMoodLabel(mood: Mood, locale: string = "ar"): string {
  const labels: Record<string, Record<Mood, string>> = {
    ar: {
      tired: "تعبان",
      energetic: "طاقتي عالية",
      scattered: "مشتت",
      calm: "هادئ",
    },
    en: {
      tired: "Tired",
      energetic: "Energetic",
      scattered: "Scattered",
      calm: "Calm",
    },
  };
  return labels[locale]?.[mood] || labels.ar[mood];
}

/** emoji لكل مزاج */
export const MOOD_EMOJI: Record<Mood, string> = {
  tired: "😴",
  energetic: "⚡",
  scattered: "🌀",
  calm: "🧘",
};
