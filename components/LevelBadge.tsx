"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import clsx from "clsx";

interface LevelBadgeProps {
  level: {
    name: string;
    nameEn: string;
    color: string;
    emoji: string;
  };
  totalXp: number;
  progress: number;        // 0-100
  size?: "sm" | "md" | "lg";
}

export function LevelBadge({ level, totalXp, progress, size = "md" }: LevelBadgeProps) {
  const sizes = {
    sm: { container: "px-2 py-1 text-xs", icon: "text-base", progress: "h-1" },
    md: { container: "px-3 py-1.5 text-sm", icon: "text-lg", progress: "h-1.5" },
    lg: { container: "px-4 py-2 text-base", icon: "text-2xl", progress: "h-2" },
  }[size];

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border",
        sizes.container
      )}
      style={{
        borderColor: `${level.color}40`,
        background: `${level.color}10`,
      }}
    >
      <span className={sizes.icon}>{level.emoji}</span>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-medium" style={{ color: level.color }}>
            {level.name}
          </span>
          <span className="text-muted-foreground text-xs">·</span>
          <span className="text-muted-foreground font-mono text-xs">
            {totalXp} XP
          </span>
        </div>
        {size !== "sm" && progress < 100 && (
          <div className={clsx("w-full bg-border rounded-full overflow-hidden", sizes.progress)}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: level.color }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
