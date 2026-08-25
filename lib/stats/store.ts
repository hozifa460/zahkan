"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CompletedTask, UserStats, Mood } from "./types";
import { TaskCategory } from "@/lib/tasks";
import type { Tool } from "@/lib/tasks/tools";
import {
  calculateStreak,
  countByCategory,
  calculateCategoryWeights,
  checkAchievements,
} from "./achievements";
import { getTimeOfDay } from "./context";

const STORAGE_KEY = "zawhan-stats";
const MAX_HISTORY = 100;  // نحتفظ بآخر 100 مهمة فقط

interface StatsState extends UserStats {
  // أكمل مهمة
  completeTask: (data: {
    taskId: string;
    category: TaskCategory;
    duration: 2 | 10 | 30 | 60;
    energy: "low" | "medium" | "high";
    rating?: 1 | 2 | 3 | 4 | 5;
    mood?: Mood;
    baseXp: number;
  }) => {
    xpEarned: number;
    newAchievements: string[];
    isNewRecord: boolean;
  };

  // قيّم مهمة موجودة
  rateTask: (taskId: string, rating: 1 | 2 | 3 | 4 | 5) => void;

  // امسح كل البيانات
  clearAll: () => void;

  // إعدادات
  toggleSound: () => void;

  // الأدوات المتاحة
  availableTools: Tool[];
  toggleTool: (tool: Tool) => void;

  // التحدي النشط
  activeChallenge: string | null;        // id التحدي
  challengeProgress: Record<string, number>;  // تحدي -> آخر يوم مكتمل
  startChallenge: (id: string) => void;
  completeChallengeDay: (id: string, day: number) => void;
  abandonChallenge: () => void;

  // نتيجة آخر اختبار
  lastQuizType: string | null;
  lastQuizDate: string;
  setQuizResult: (type: string) => void;
}

const initialState: UserStats = {
  completedTasks: [],
  totalXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: "",
  unlockedAchievements: [],
  preferredCategories: {
    mental: 1, physical: 1, creative: 1, learning: 1,
    building: 1, mindfulness: 1, discovery: 1,
  } as Record<TaskCategory, number>,
  soundEnabled: true,
  availableTools: ["body", "pen", "paper", "camera", "computer"] as Tool[],  // افتراضياً: كل الأدوات
  activeChallenge: null,
  challengeProgress: {},
  lastQuizType: null,
  lastQuizDate: "",
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      completeTask: (data) => {
        const now = Date.now();
        const today = new Date().toISOString().split("T")[0];

        // حساب XP (مع مكافأة السلسلة)
        let xpEarned = data.baseXp;
        if (get().currentStreak >= 7) xpEarned = Math.floor(xpEarned * 1.5);
        else if (get().currentStreak >= 3) xpEarned = Math.floor(xpEarned * 1.25);

        // مكافأة 5 نجوم فورية
        if (data.rating === 5) xpEarned += 5;

        // بناء سجل المهمة
        const newTask: CompletedTask = {
          taskId: data.taskId,
          category: data.category,
          duration: data.duration,
          energy: data.energy,
          rating: data.rating,
          mood: data.mood,
          timeOfDay: getTimeOfDay(new Date(now)),
          completedAt: now,
          xpEarned,
        };

        // تجميع المهام
        const prev = get().completedTasks;
        const completedTasks = [newTask, ...prev].slice(0, MAX_HISTORY);

        // حساب السلسلة
        const streak = calculateStreak(completedTasks);

        // حساب الأوزان الجديدة
        const newWeights = calculateCategoryWeights(completedTasks);

        // فحص الإنجازات الجديدة
        const stats = {
          completedTasks,
          currentStreak: streak.current,
          longestStreak: streak.longest,
          totalXp: get().totalXp + xpEarned,
        };
        const allAchievements = checkAchievements(stats);
        const newAchievements = allAchievements
          .filter((a) => a.unlocked && !get().unlockedAchievements.includes(a.id))
          .map((a) => a.id);

        // هل هو رقم قياسي؟
        const isNewRecord = streak.current > streak.longest - 1 && streak.current > 1;

        set({
          completedTasks,
          totalXp: stats.totalXp,
          currentStreak: streak.current,
          longestStreak: streak.longest,
          lastActiveDate: today,
          preferredCategories: newWeights,
          unlockedAchievements: [
            ...get().unlockedAchievements,
            ...newAchievements,
          ],
        });

        return { xpEarned, newAchievements, isNewRecord };
      },

      rateTask: (taskId, rating) => {
        const updated = get().completedTasks.map((t) =>
          t.taskId === taskId ? { ...t, rating } : t
        );
        const newWeights = calculateCategoryWeights(updated);
        set({
          completedTasks: updated,
          preferredCategories: newWeights,
        });
      },

      clearAll: () => {
        set({ ...initialState });
      },

      toggleSound: () => {
        set({ soundEnabled: !get().soundEnabled });
      },

      toggleTool: (tool) => {
        const current = get().availableTools;
        const has = current.includes(tool);
        set({
          availableTools: has
            ? current.filter((t) => t !== tool)
            : [...current, tool],
        });
      },

      startChallenge: (id) => {
        set({ activeChallenge: id, challengeProgress: { ...get().challengeProgress, [id]: 0 } });
      },

      completeChallengeDay: (id, day) => {
        const current = get().challengeProgress[id] || 0;
        if (day === current + 1) {
          set({
            challengeProgress: { ...get().challengeProgress, [id]: day },
          });
        }
      },

      abandonChallenge: () => {
        set({ activeChallenge: null });
      },

      setQuizResult: (type) => {
        set({
          lastQuizType: type,
          lastQuizDate: new Date().toISOString().split("T")[0],
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
