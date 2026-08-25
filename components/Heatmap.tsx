"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { buildHeatmap } from "@/lib/stats/analytics";
import { getDayName } from "@/lib/stats/analytics";
import { useStats } from "@/hooks/useStats";
import clsx from "clsx";

export function Heatmap() {
  const stats = useStats();
  const cells = useMemo(() => buildHeatmap(stats.completedTasks), [stats.completedTasks]);

  // نرتب الخلايا: كل عمود = ساعة، كل صف = يوم
  const days = [0, 1, 2, 3, 4, 5, 6] as const;

  // الساعات المهمة فقط (6-24 = نشطة)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // حساب اللون حسب الكثافة
  const getColor = (intensity: number, count: number) => {
    if (count === 0) return "bg-muted/30";
    if (intensity > 0.7) return "bg-primary";
    if (intensity > 0.4) return "bg-primary/70";
    if (intensity > 0.2) return "bg-primary/40";
    return "bg-primary/20";
  };

  return (
    <div className="p-4 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium">خريطة الإنتاجية</h2>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>أقل</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded-sm bg-muted/30" />
            <div className="w-3 h-3 rounded-sm bg-primary/20" />
            <div className="w-3 h-3 rounded-sm bg-primary/40" />
            <div className="w-3 h-3 rounded-sm bg-primary/70" />
            <div className="w-3 h-3 rounded-sm bg-primary" />
          </div>
          <span>أكثر</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* ترويسة الساعات */}
          <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-0.5 mb-1">
            <div />
            {hours.filter((h) => h % 2 === 0).map((h) => (
              <div key={h} className="text-[9px] text-muted-foreground text-center col-span-2">
                {h}
              </div>
            ))}
          </div>

          {/* الصفوف */}
          {days.map((day) => (
            <div key={day} className="grid grid-cols-[40px_repeat(24,1fr)] gap-0.5 mb-0.5">
              <div className="text-xs text-muted-foreground text-end pr-2 leading-5">
                {getDayName(day, true)}
              </div>
              {hours.map((hour) => {
                const cell = cells.find((c) => c.day === day && c.hour === hour)!;
                return (
                  <motion.div
                    key={hour}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (day * 24 + hour) * 0.005, duration: 0.2 }}
                    className={clsx(
                      "h-4 rounded-sm",
                      getColor(cell.intensity, cell.count)
                    )}
                    title={`${getDayName(day)} ${hour}:00 — ${cell.count} مهمة`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        كل مربع = ساعة من اليوم. الألوان الداكنة = ساعاتك الأكثر إنتاجية.
      </p>
    </div>
  );
}
