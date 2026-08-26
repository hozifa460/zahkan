/**
 * مزامنة البيانات بين localStorage و Supabase
 *
 * - عند تسجيل دخول: يجلب البيانات من السحابة ويمحو المحلي
 * - عند تسجيل خروج: يرفع البيانات المحلية إلى السحابة
 */

import { supabase } from "@/lib/supabase";
import { useStatsStore } from "@/lib/stats/store";
import type { CompletedTask, Mood } from "@/lib/stats/types";
import type { Tool } from "@/lib/tasks/tools";

/** جلب بيانات المستخدم من السحابة */
export async function loadUserDataFromCloud(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("user_data")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Load error:", error);
    return false;
  }

  const store = useStatsStore.getState();

  if (!data) {
    // أول مرة — نُنشئ سجل جديد
    await supabase.from("user_data").insert({
      user_id: user.id,
      completed_tasks: store.completedTasks,
      total_xp: store.totalXp,
      current_streak: store.currentStreak,
      longest_streak: store.longestStreak,
      last_active_date: store.lastActiveDate,
      unlocked_achievements: store.unlockedAchievements,
      preferred_categories: store.preferredCategories,
      sound_enabled: store.soundEnabled,
      available_tools: store.availableTools,
      active_challenge: store.activeChallenge,
      challenge_progress: store.challengeProgress,
      last_quiz_type: store.lastQuizType,
      last_quiz_date: store.lastQuizDate,
    });
    return true;
  }

  // بيانات موجودة — نستبدل المحلي بها
  useStatsStore.setState({
    completedTasks: data.completed_tasks || [],
    totalXp: data.total_xp || 0,
    currentStreak: data.current_streak || 0,
    longestStreak: data.longest_streak || 0,
    lastActiveDate: data.last_active_date || "",
    unlockedAchievements: data.unlocked_achievements || [],
    preferredCategories: data.preferred_categories || {},
    soundEnabled: data.sound_enabled ?? true,
    availableTools: data.available_tools || [],
    activeChallenge: data.active_challenge || null,
    challengeProgress: data.challenge_progress || {},
    lastQuizType: data.last_quiz_type || null,
    lastQuizDate: data.last_quiz_date || "",
  });

  return true;
}

/** حفظ البيانات في السحابة */
export async function saveUserDataToCloud(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const s = useStatsStore.getState();

  const { error } = await supabase
    .from("user_data")
    .upsert({
      user_id: user.id,
      completed_tasks: s.completedTasks,
      total_xp: s.totalXp,
      current_streak: s.currentStreak,
      longest_streak: s.longestStreak,
      last_active_date: s.lastActiveDate,
      unlocked_achievements: s.unlockedAchievements,
      preferred_categories: s.preferredCategories,
      sound_enabled: s.soundEnabled,
      available_tools: s.availableTools,
      active_challenge: s.activeChallenge,
      challenge_progress: s.challengeProgress,
      last_quiz_type: s.lastQuizType,
      last_quiz_date: s.lastQuizDate,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id",
    });

  if (error) {
    console.error("Save error:", error);
    return false;
  }
  return true;
}

/** عند تسجيل خروج: نرفع المحلي إلى السحابة ونمسح المحلي */
export async function syncToCloudOnSignOut() {
  await saveUserDataToCloud();
}
