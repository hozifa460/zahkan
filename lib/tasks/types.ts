// أنواع المهام لـ "زهقان"

import type { Locale } from "@/lib/i18n/types";

/** نص مُتعدّد اللهجات — يجب أن يحتوي على كل اللهجات */
export type LocalizedText = Record<Locale, string>;

export type TaskCategory =
  | "mental"        // ذهنية
  | "physical"      // حركية
  | "creative"      // إبداعية
  | "learning"      // تعلّم
  | "building"      // بناء
  | "mindfulness"   // صفاء
  | "discovery";    // اكتشاف

export type TaskDuration = 2 | 10 | 30 | 60;
export type TaskEnergy = "low" | "medium" | "high";

export interface Task {
  id: string;
  category: TaskCategory;
  duration: TaskDuration;
  energy: TaskEnergy;
  title: LocalizedText;         // عنوان قصير (3-6 كلمات)
  description: LocalizedText;  // شرح من جملة واحدة
  steps: LocalizedText[];       // 3-5 خطوات
  output: LocalizedText;        // ما سيُنتجه المستخدم
  difficulty: 1 | 2 | 3;        // الصعوبة
  tags: string[];               // وسوم للفلترة
  xp: number;                   // نقاط الإنجاز
}

export interface CategoryInfo {
  id: TaskCategory;
  name: LocalizedText;
  icon: string;          // اسم أيقونة Lucide
  color: string;         // لون CSS
  description: LocalizedText;
}

/** مولّد مساعد لإنشاء LocalizedText بأقل تكرار */
export function t(
  en: string,
  ar: string,
  arEg: string,
  arSa: string,
  arLevant: string,
  arMaghreb: string
): LocalizedText {
  return {
    en,
    ar,
    "ar-eg": arEg,
    "ar-sa": arSa,
    "ar-levant": arLevant,
    "ar-maghreb": arMaghreb,
  };
}

/** نسخة من t تقبل مصفوفة خطوات */
export function tSteps(
  en: string[],
  ar: string[],
  arEg: string[],
  arSa: string[],
  arLevant: string[],
  arMaghreb: string[]
): LocalizedText[] {
  return en.map((_, i) => ({
    en: en[i],
    ar: ar[i],
    "ar-eg": arEg[i],
    "ar-sa": arSa[i],
    "ar-levant": arLevant[i],
    "ar-maghreb": arMaghreb[i],
  }));
}
