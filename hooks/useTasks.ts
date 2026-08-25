"use client";

import { useMemo } from "react";
import { filterTasks, getTaskById } from "@/lib/tasks";
import type { TaskFilter } from "@/lib/tasks";
import type { Task } from "@/lib/tasks";

/** Hook لجلب المهام مع فلاتر */
export function useTasks(filter: TaskFilter = {}): Task[] {
  return useMemo(() => filterTasks(filter), [filter]);
}

/** Hook لجلب مهمة واحدة */
export function useTask(id: string | null): Task | undefined {
  return useMemo(() => (id ? getTaskById(id) : undefined), [id]);
}
