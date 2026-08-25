"use client";

import { motion } from "framer-motion";
import { MOOD_EMOJI, getMoodLabel } from "@/lib/stats/context";
import type { Mood } from "@/lib/stats/types";
import clsx from "clsx";

interface MoodSelectorProps {
  value?: Mood;
  onChange: (mood: Mood) => void;
  locale?: "ar" | "en";
}

const MOODS: Mood[] = ["tired", "energetic", "scattered", "calm"];

const MOOD_COLORS: Record<Mood, string> = {
  tired: "#94a3b8",
  energetic: "#f59e0b",
  scattered: "#8b5cf6",
  calm: "#06b6d4",
};

export function MoodSelector({ value, onChange, locale = "ar" }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {MOODS.map((mood) => {
        const isActive = value === mood;
        return (
          <motion.button
            key={mood}
            type="button"
            onClick={() => onChange(mood)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={clsx(
              "p-4 rounded-2xl border-2 transition-all text-center",
              isActive
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            <div className="text-3xl mb-1">{MOOD_EMOJI[mood]}</div>
            <div className="text-sm font-medium">
              {getMoodLabel(mood, locale)}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
