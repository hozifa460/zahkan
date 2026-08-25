// أنواع نظام الإحصائيات والتعلّم

import type { TaskCategory, TaskDuration, TaskEnergy } from "@/lib/tasks";
import type { Tool } from "@/lib/tasks/tools";

/** حالة مزاجية يختارها المستخدم قبل المهمة */
export type Mood = "tired" | "energetic" | "scattered" | "calm";

/** فترة من اليوم */
export type TimeOfDay = "morning" | "noon" | "evening" | "night";

/** سجل مهمة مُنجزة */
export interface CompletedTask {
  taskId: string;
  category: TaskCategory;
  duration: TaskDuration;
  energy: TaskEnergy;
  rating?: 1 | 2 | 3 | 4 | 5;  // تقييم 1-5 نجوم
  mood?: Mood;
  timeOfDay: TimeOfDay;
  completedAt: number;        // timestamp
  xpEarned: number;            // الـ XP الذي حصل عليه (مع المكافآت)
}

/** مستوى المستخدم */
export interface Level {
  id: number;
  name: string;        // "مبتدئ" / "نشط" / "محترف" / "أسطوري"
  nameEn: string;
  minXp: number;
  maxXp: number;
  color: string;
  emoji: string;
}

/** إنجاز (Achievement) */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;          // اسم أيقونة
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;     // 0-100
  target?: number;
}

/** الحالة الكاملة للمستخدم */
export interface UserStats {
  // المهام
  completedTasks: CompletedTask[];

  // XP والمستوى
  totalXp: number;

  // السلسلة
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;   // YYYY-MM-DD

  // الإنجازات
  unlockedAchievements: string[];  // IDs

  // الإعدادات
  preferredCategories: Record<TaskCategory, number>;  // أوزان
  soundEnabled: boolean;
  availableTools: Tool[];

  // التحديات
  activeChallenge: string | null;
  challengeProgress: Record<string, number>;

  // الاختبار
  lastQuizType: string | null;
  lastQuizDate: string;
}
