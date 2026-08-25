"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { compareWeeks, formatDuration } from "@/lib/stats/analytics";
import { CATEGORIES } from "@/lib/tasks";
import { useStats } from "@/hooks/useStats";
import clsx from "clsx";

export function WeeklyComparison() {
  const stats = useStats();
  const comparison = useMemo(
    () => compareWeeks(stats.completedTasks),
    [stats.completedTasks]
  );

  const { thisWeek, lastWeek, diff, percentChange } = comparison;

  const TrendIcon =
    diff.count > 0 ? TrendingUp : diff.count < 0 ? TrendingDown : Minus;

  const trendColor =
    diff.count > 0 ? "text-green-400" : diff.count < 0 ? "text-red-400" : "text-muted-foreground";

  const thisTopCategory = thisWeek.topCategory
    ? CATEGORIES.find((c) => c.id === thisWeek.topCategory)
    : null;
  const lastTopCategory = lastWeek.topCategory
    ? CATEGORIES.find((c) => c.id === lastWeek.topCategory)
    : null;

  return (
    <div className="p-4 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium">هذا الأسبوع vs الماضي</h2>
        <Calendar className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* نسبة التغيير */}
      <div className="flex items-center justify-center gap-2 mb-4 py-3">
        <TrendIcon className={clsx("w-6 h-6", trendColor)} />
        <span className={clsx("text-3xl font-light", trendColor)}>
          {percentChange > 0 ? "+" : ""}
          {percentChange}%
        </span>
        <span className="text-sm text-muted-foreground">مهام</span>
      </div>

      {/* مقارنة جنب-لجنب */}
      <div className="grid grid-cols-2 gap-3">
        {/* هذا الأسبوع */}
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
          <div className="text-xs text-primary mb-2 font-medium">هذا الأسبوع</div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">مهام</span>
              <span className="font-mono font-medium">{thisWeek.count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">وقت</span>
              <span className="font-mono font-medium">
                {formatDuration(thisWeek.minutes)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">XP</span>
              <span className="font-mono font-medium text-primary">
                {thisWeek.xp}
              </span>
            </div>
            {thisTopCategory && (
              <div className="flex justify-between text-xs pt-1 border-t border-border">
                <span className="text-muted-foreground">الأكثر</span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: thisTopCategory.color }}
                  />
                  <span>{thisTopCategory.name.ar}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* الأسبوع الماضي */}
        <div className="p-3 rounded-xl bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-2 font-medium">الماضي</div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">مهام</span>
              <span className="font-mono font-medium">{lastWeek.count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">وقت</span>
              <span className="font-mono font-medium">
                {formatDuration(lastWeek.minutes)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">XP</span>
              <span className="font-mono font-medium">{lastWeek.xp}</span>
            </div>
            {lastTopCategory && (
              <div className="flex justify-between text-xs pt-1 border-t border-border">
                <span className="text-muted-foreground">الأكثر</span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: lastTopCategory.color }}
                  />
                  <span>{lastTopCategory.name.ar}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* رسالة تحفيزية */}
      {diff.count !== 0 && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx(
            "text-xs text-center mt-3 pt-3 border-t border-border",
            trendColor
          )}
        >
          {diff.count > 0
            ? `🎉 أحسنت! أكملت ${diff.count} ${diff.count === 1 ? "مهمة أكثر" : "مهام أكثر"} من الأسبوع الماضي`
            : `أكملت ${Math.abs(diff.count)} ${Math.abs(diff.count) === 1 ? "مهمة أقل" : "مهام أقل"}. تقدر تعوّض!`}
        </motion.p>
      )}
    </div>
  );
}
