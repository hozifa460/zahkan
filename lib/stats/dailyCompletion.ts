/**
 * يتابع هل المستخدم خلص روتين اليوم.
 * localStorage key: zawhan-daily-completion
 * القيمة: { morning: "YYYY-MM-DD" | null, evening: "YYYY-MM-DD" | null }
 *
 * منطق الفترة:
 * - الفترة الصباحية (5ص-5م): الروتين الصباحي
 * - الفترة المسائية (5م-5ص): الروتين المسائي
 *
 * "الفترة" = يوم تاريخي واحد (صباحي في يوم، مسائي في نفس اليوم أو اليوم التالي)
 * لكن للتبسيط: نخزن التاريخ الذي تم فيه الإكمال، ونتحقق هل هو نفس الفترة الحالية.
 */

import type { RoutineId } from "@/lib/tasks/dailyRoutines";

const STORAGE_KEY = "zawhan-daily-completion";

interface CompletionState {
  morning: string | null; // YYYY-MM-DD
  evening: string | null; // YYYY-MM-DD
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function read(): CompletionState {
  if (typeof window === "undefined") return { morning: null, evening: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { morning: null, evening: null };
    const parsed = JSON.parse(raw);
    return {
      morning: parsed?.morning ?? null,
      evening: parsed?.evening ?? null,
    };
  } catch {
    return { morning: null, evening: null };
  }
}

function write(state: CompletionState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

/** هل خلّص هذا الروتين في الفترة الحالية؟ */
export function isCompleted(routineId: RoutineId): boolean {
  const state = read();
  return state[routineId] === todayKey();
}

/** وضع علامة "خلّص" على الروتين الحالي */
export function markCompleted(routineId: RoutineId) {
  const state = read();
  state[routineId] = todayKey();
  write(state);
}

/** مسح كل السجلات (للتطوير/الإعدادات) */
export function clearAll() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
