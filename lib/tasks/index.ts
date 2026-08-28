import type { Task, TaskCategory, TaskDuration, TaskEnergy } from "./types";
import { mentalTasks } from "./mental";
import { physicalTasks } from "./physical";
import { creativeTasks } from "./creative";
import { learningTasks } from "./learning";
import { buildingTasks } from "./building";
import { mindfulnessTasks } from "./mindfulness";
import { discoveryTasks } from "./discovery";
import { HABIT_TASKS } from "./habits";
import { COUPLE_TASKS } from "./couple";
import { KIDS_TASKS } from "./kids";
import { SEASONAL_TASKS } from "./seasonal";
import { CATEGORIES } from "./categories";
import type { Locale } from "@/lib/i18n/types";
import { LOCALES } from "@/lib/i18n/types";

export * from "./types";
export { CATEGORIES, getCategory } from "./categories";

// تجميع كل المهام بما فيها الموسمية والزوجية والأطفال
const allSeasonalList: Task[] = Object.values(SEASONAL_TASKS).flat();

/** كل المهام مجمّعة */
export const ALL_TASKS: Task[] = [
  ...mentalTasks,
  ...physicalTasks,
  ...creativeTasks,
  ...learningTasks,
  ...buildingTasks,
  ...mindfulnessTasks,
  ...discoveryTasks,
  ...HABIT_TASKS,
  ...COUPLE_TASKS,
  ...KIDS_TASKS,
  ...allSeasonalList,
];

/** خريطة للوصول السريع */
const TASKS_BY_ID = new Map<string, Task>(ALL_TASKS.map((t) => [t.id, t]));

/** جلب مهمة بمعرّفها */
export function getTaskById(id: string): Task | undefined {
  return TASKS_BY_ID.get(id);
}

/** فلترة المهام */
export interface TaskFilter {
  category?: TaskCategory;
  duration?: TaskDuration;
  energy?: TaskEnergy;
}

export function filterTasks(filter: TaskFilter): Task[] {
  return ALL_TASKS.filter((task) => {
    if (filter.category && task.category !== filter.category) return false;
    if (filter.duration && task.duration !== filter.duration) return false;
    if (filter.energy && task.energy !== filter.energy) return false;
    return true;
  });
}

/**
 * مُحقّق سلامة: التأكد أن كل مهمة تحتوي على كل اللغات
 * يُرجع قائمة بالمهام المعطوبة مع تفاصيل المشكلة
 */
export interface ValidationIssue {
  taskId: string;
  locale: Locale;
  field: string;
  issue: string;
}

export function validateTasks(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const task of ALL_TASKS) {
    for (const locale of LOCALES) {
      // فحص العنوان
      if (!task.title[locale] || task.title[locale].trim() === "") {
        issues.push({
          taskId: task.id,
          locale,
          field: "title",
          issue: "Title is empty",
        });
      }

      // فحص الوصف
      if (!task.description[locale] || task.description[locale].trim() === "") {
        issues.push({
          taskId: task.id,
          locale,
          field: "description",
          issue: "Description is empty",
        });
      }

      // فحص steps
      if (!task.steps || task.steps.length === 0) {
        issues.push({
          taskId: task.id,
          locale,
          field: "steps",
          issue: "No steps defined",
        });
      } else {
        for (let i = 0; i < task.steps.length; i++) {
          const step = task.steps[i];
          if (!step[locale] || step[locale].trim() === "") {
            issues.push({
              taskId: task.id,
              locale,
              field: `steps[${i}]`,
              issue: "Step is empty",
            });
          }
        }
      }

      // فحص output
      if (!task.output[locale] || task.output[locale].trim() === "") {
        issues.push({
          taskId: task.id,
          locale,
          field: "output",
          issue: "Output is empty",
        });
      }
    }
  }

  return issues;
}

/** إحصائيات */
export function getStats() {
  return {
    total: ALL_TASKS.length,
    byCategory: CATEGORIES.map((c) => ({
      ...c,
      count: filterTasks({ category: c.id }).length,
    })),
    byDuration: [2, 10, 30, 60].map((d) => ({
      duration: d,
      count: filterTasks({ duration: d as TaskDuration }).length,
    })),
  };
}
