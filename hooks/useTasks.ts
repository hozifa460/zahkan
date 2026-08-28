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
  return useMemo(() => {
    if (!id) return undefined;
    const direct = getTaskById(id);
    if (direct) return direct;

    // فحص المهام المخصصة والديناميكية (مثل مهام التحديات المخزنة في الجلسة)
    if (typeof window !== "undefined") {
      try {
        const custom = JSON.parse(sessionStorage.getItem("customTasks") || "{}");
        if (custom && custom[id]) return custom[id] as Task;
      } catch {}
    }
    return undefined;
  }, [id]);
}
