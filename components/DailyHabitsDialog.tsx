"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Sun, Moon, Briefcase, BookOpen, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { DAILY_ROUTINES, type RoutineId } from "@/lib/tasks/dailyRoutines";

interface DailyHabitsDialogProps {
  open: boolean;
  onClose: () => void;
}

const ROUTINE_ICONS: Record<RoutineId, any> = {
  morning: Sun,
  evening: Moon,
  work: Briefcase,
  study: BookOpen,
};

const ROUTINE_KEYS: Record<RoutineId, string> = {
  morning: "daily.morning",
  evening: "daily.evening",
  work: "daily.work",
  study: "daily.study",
};

export function DailyHabitsDialog({ open, onClose }: DailyHabitsDialogProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Click outside to close
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSelect = (id: RoutineId) => {
    onClose();
    router.push(`/daily?routine=${id}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdrop}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        >
          <motion.div
            ref={dialogRef}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  عادات اليوم
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-6 text-center">
              روتين يومي من 3 مهام تكوّن عادة
            </p>

            {/* Routines Grid */}
            <div className="grid grid-cols-2 gap-3">
              {DAILY_ROUTINES.map((routine) => {
                const Icon = ROUTINE_ICONS[routine.id];
                return (
                  <button
                    key={routine.id}
                    onClick={() => handleSelect(routine.id)}
                    className="group relative flex flex-col items-center gap-2 p-4 bg-background border border-border rounded-2xl hover:border-primary/50 hover:scale-105 transition-all"
                    style={{ borderColor: `${routine.color}40` }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${routine.color}20` }}
                    >
                      <span>{routine.icon}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {ROUTINE_KEYS[routine.id] === "daily.morning" && "صباحي"}
                      {ROUTINE_KEYS[routine.id] === "daily.evening" && "مسائي"}
                      {ROUTINE_KEYS[routine.id] === "daily.work" && "عمل"}
                      {ROUTINE_KEYS[routine.id] === "daily.study" && "دراسة"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {routine.tasks.length} مهام
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
