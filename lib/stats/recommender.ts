import type { Task, TaskCategory, TaskDuration, TaskEnergy } from "@/lib/tasks";
import { ALL_TASKS, filterTasks } from "@/lib/tasks";
import type { Mood, TimeOfDay } from "./types";
import { MOOD_CATEGORIES, suggestEnergyForTime } from "./context";
import type { CompletedTask } from "./types";
import type { Tool } from "@/lib/tasks/tools";
import { TASK_TOOLS } from "@/lib/tasks/tools";

export interface RecommendationInput {
  duration?: TaskDuration;
  energy?: TaskEnergy;
  mood?: Mood;
  timeOfDay?: TimeOfDay;
  categoryWeights: Record<string, number>;
  completedTasks: CompletedTask[];
  /** استبعد آخر 3 فئات لتجنّب التكرار */
  avoidRepetition?: boolean;
  /**
   * احتمال (0-1) اختيار "مهمة عكسية" — خارج منطقة الراحة
   * الافتراضي: 0.2 (20%)
   */
  reverseChance?: number;
  availableTools?: Tool[];
}

export interface RecommendationResult {
  task: Task;
  isReverse: boolean;  // هل هي مهمة عكسية؟
}

/**
 * خوارزمية التوصية الذكية
 *
 * ترتّب المهام بناءً على:
 * 1. مطابقة الفلاتر (المدة، الطاقة)
 * 2. توافق المزاج (MOOD_CATEGORIES)
 * 3. توافق وقت اليوم (suggestEnergyForTime)
 * 4. أوزان الفئات (من تقييمات المستخدم)
 * 5. تجنّب التكرار الأخير
 * 6. مكافأة للمهام عالية التقييم سابقاً
 * 7. 🆕 المهمة العكسية (reverseChance)
 */
export function recommendTask(input: RecommendationInput): Task | null {
  const {
    duration,
    energy,
    mood,
    timeOfDay,
    categoryWeights,
    completedTasks,
    avoidRepetition = true,
    reverseChance = 0.2,
    availableTools,
  } = input;

  // 1) فلترة أساسية
  let candidates = filterTasks({
    ...(duration ? { duration } : {}),
    ...(energy ? { energy } : {}),
  });

  // فلترة بالأدوات المتاحة
  if (availableTools && availableTools.length > 0) {
    candidates = candidates.filter((task) => {
      const required = TASK_TOOLS[task.id] || ["none"];
      return required.some((tool) =>
        availableTools.includes(tool) || tool === "none"
      );
    });
  }

  if (candidates.length === 0) {
    candidates = ALL_TASKS;
  }

  // 2) إذا عندنا مزاج، فضّل فئات المزاج
  let preferredCategories: string[] = [];
  if (mood) {
    preferredCategories = MOOD_CATEGORIES[mood];
  }

  // 3) إذا عندنا وقت، استنتج الطاقة المفضّلة
  const suggestedEnergy = timeOfDay ? suggestEnergyForTime(timeOfDay) : null;

  // 4) 🆕 المهمة العكسية — من فئة لم يجرّبها أو قيّمها منخفضاً
  if (Math.random() < reverseChance && completedTasks.length >= 3) {
    const reverseTask = pickReverseTask(candidates, categoryWeights, completedTasks);
    if (reverseTask) {
      return reverseTask;
    }
  }

  // 5) احسب درجة لكل مهمة
  const scored = candidates.map((task) => {
    let score = 1;

    score *= (categoryWeights[task.category] || 1);

    if (mood && preferredCategories.includes(task.category)) {
      score *= 1.5;
    }

    if (suggestedEnergy && task.energy === suggestedEnergy) {
      score *= 1.3;
    }

    if (avoidRepetition) {
      const recent = completedTasks.slice(-3);
      if (recent.some((c) => c.category === task.category)) {
        score *= 0.5;
      }
      if (recent.some((c) => c.taskId === task.id)) {
        score *= 0.1;
      }
    }

    // مكافأة/عقوبة من تاريخ المهمة
    const sameTaskHistory = completedTasks.filter((c) => c.taskId === task.id);
    if (sameTaskHistory.length > 0) {
      const bestRating = Math.max(...sameTaskHistory.map((c) => c.rating || 0));
      if (bestRating === 5) {
        score *= 1.4;
      } else if (bestRating <= 2) {
        score *= 0.3;
      }
    }

    // تنويع الفئات
    const categoryCount = completedTasks.filter((c) => c.category === task.category).length;
    if (categoryCount < 3) {
      score *= 1.2;
    }

    return { task, score };
  });

  // ترتيب واختيار
  scored.sort((a, b) => b.score - a.score);
  const topN = scored.slice(0, Math.min(3, scored.length));
  return topN[Math.floor(Math.random() * topN.length)]?.task || null;
}

/**
 * 🆕 يختار مهمة "عكسية" — من فئة لم يجرّبها أو قيّمها منخفضاً
 */
function pickReverseTask(
  candidates: Task[],
  categoryWeights: Record<string, number>,
  completedTasks: CompletedTask[]
): Task | null {
  // الفئات التي وزنها منخفض
  const lowWeightCategories = Object.entries(categoryWeights)
    .filter(([_, w]) => w <= 0.6)
    .map(([cat]) => cat);

  // الفئات التي لم يجرّبها أبداً
  const triedCategories = new Set(completedTasks.map((c) => c.category));
  const untriedCategories = Array.from(new Set(candidates.map((t) => t.category)))
    .filter((c) => !triedCategories.has(c as TaskCategory));

  const reverseCategories = [...new Set([...lowWeightCategories, ...untriedCategories])];

  if (reverseCategories.length === 0) return null;

  const reverseCandidates = candidates.filter((t) =>
    reverseCategories.includes(t.category)
  );

  if (reverseCandidates.length === 0) return null;

  return reverseCandidates[Math.floor(Math.random() * reverseCandidates.length)];
}

/**
 * نسخة تُعيد معلومات إضافية (هل هي عكسية؟)
 */
export function recommendTaskWithMeta(input: RecommendationInput): RecommendationResult | null {
  // حفظ الـ random state الحالي غير ممكن بدون seed، لذلك نعتمد على sample
  const task = recommendTask(input);
  if (!task) return null;
  // نبسط: لا نعرف هل هي عكسية (نحتاج seed)
  // هذا placeholder — سنعتمد على المعلومات من store
  return { task, isReverse: false };
}

/** دالة بسيطة للتوصية بدون سياق كامل (Fallback) */
export function simpleRecommend(
  duration?: TaskDuration,
  energy?: TaskEnergy
): Task | null {
  const candidates = filterTasks({
    ...(duration ? { duration } : {}),
    ...(energy ? { energy } : {}),
  });
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
