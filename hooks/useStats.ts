"use client";

import { useStatsStore } from "@/lib/stats/store";
import { useMemo } from "react";
import { getLevelByXp, getLevelProgress, getNextLevel } from "@/lib/stats/levels";
import { checkAchievements, countByCategory, moodStats } from "@/lib/stats/achievements";
import { recommendTask } from "@/lib/stats/recommender";
import type { Task, TaskDuration, TaskEnergy } from "@/lib/tasks";
import type { Mood } from "@/lib/stats/types";

/** Hook شامل لكل الإحصائيات والعمليات */
export function useStats() {
  const store = useStatsStore();

  const level = useMemo(() => getLevelByXp(store.totalXp), [store.totalXp]);
  const nextLevel = useMemo(() => getNextLevel(level), [level]);
  const levelProgress = useMemo(
    () => getLevelProgress(store.totalXp),
    [store.totalXp]
  );
  const categoryCounts = useMemo(
    () => countByCategory(store.completedTasks),
    [store.completedTasks]
  );
  const moods = useMemo(() => moodStats(store.completedTasks), [store.completedTasks]);
  const achievements = useMemo(
    () =>
      checkAchievements({
        completedTasks: store.completedTasks,
        currentStreak: store.currentStreak,
        longestStreak: store.longestStreak,
        totalXp: store.totalXp,
      }),
    [store.completedTasks, store.currentStreak, store.longestStreak, store.totalXp]
  );

  // 🆕 المهام المُقيّمة بأعلى (4-5 نجوم)
  const favorites = useMemo(() => {
    const favs = store.completedTasks
      .filter((t) => t.rating && t.rating >= 4)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    // نزيل التكرارات (نفس المهمة قد تكون مقيّمة عدة مرات)
    const seen = new Set<string>();
    return favs.filter((t) => {
      if (seen.has(t.taskId)) return false;
      seen.add(t.taskId);
      return true;
    });
  }, [store.completedTasks]);

  // 🆕 المهام التي تكررت (مُقيّمة عدة مرات)
  const repeatedTasks = useMemo(() => {
    const counts: Record<string, number> = {};
    store.completedTasks.forEach((t) => {
      counts[t.taskId] = (counts[t.taskId] || 0) + 1;
    });
    return Object.entries(counts)
      .filter(([_, count]) => count >= 2)
      .map(([taskId, count]) => ({ taskId, count }))
      .sort((a, b) => b.count - a.count);
  }, [store.completedTasks]);

  const recommend = (params: {
    duration?: TaskDuration;
    energy?: TaskEnergy;
    mood?: Mood;
  }): Task | null => {
    return recommendTask({
      ...params,
      categoryWeights: store.preferredCategories,
      completedTasks: store.completedTasks,
      availableTools: store.availableTools,
    });
  };

  return {
    // البيانات
    completedTasks: store.completedTasks,
    totalXp: store.totalXp,
    currentStreak: store.currentStreak,
    longestStreak: store.longestStreak,
    lastActiveDate: store.lastActiveDate,

    // المستوى
    level,
    nextLevel,
    levelProgress,

    // الأوزان والإنجازات
    categoryWeights: store.preferredCategories,
    categoryCounts,
    moods,
    achievements,
    unlockedAchievements: store.unlockedAchievements,

    // 🆕 المفضلة والمتكررة
    favorites,
    repeatedTasks,

    // إعدادات
    soundEnabled: store.soundEnabled,
    availableTools: store.availableTools,
    toggleTool: store.toggleTool,

    // التحديات
    activeChallenge: store.activeChallenge,
    challengeProgress: store.challengeProgress,
    startChallenge: store.startChallenge,
    completeChallengeDay: store.completeChallengeDay,
    abandonChallenge: store.abandonChallenge,

    // الاختبار
    lastQuizType: store.lastQuizType,
    lastQuizDate: store.lastQuizDate,
    setQuizResult: store.setQuizResult,

    // العمليات
    completeTask: store.completeTask,
    rateTask: store.rateTask,
    clearAll: store.clearAll,
    toggleSound: store.toggleSound,

    // التوصية
    recommend,
  };
}
