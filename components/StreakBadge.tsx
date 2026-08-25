"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import clsx from "clsx";

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function StreakBadge({ streak, size = "md", showLabel = true }: StreakBadgeProps) {
  if (streak === 0) return null;

  const sizes = {
    sm: { badge: "px-2 py-0.5 text-xs", icon: "w-3 h-3", gap: "gap-1" },
    md: { badge: "px-3 py-1 text-sm", icon: "w-4 h-4", gap: "gap-1.5" },
    lg: { badge: "px-4 py-2 text-base", icon: "w-5 h-5", gap: "gap-2" },
  }[size];

  // اللون يتغيّر حسب طول السلسلة
  const color =
    streak >= 30 ? "text-purple-400 bg-purple-500/20" :
    streak >= 7 ? "text-orange-400 bg-orange-500/20" :
    streak >= 3 ? "text-yellow-400 bg-yellow-500/20" :
    "text-orange-300 bg-orange-400/10";

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={clsx(
        "inline-flex items-center rounded-full font-medium",
        sizes.badge,
        sizes.gap,
        color
      )}
    >
      <Flame className={clsx(sizes.icon, streak >= 7 && "animate-pulse")} />
      <span className="font-bold">{streak}</span>
      {showLabel && <span className="opacity-80">يوم</span>}
    </motion.div>
  );
}
