"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Dumbbell, Palette, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import { LanguageSelector } from "@/components/LanguageSelector";
import { MoodSelector } from "@/components/MoodSelector";
import { useStats } from "@/hooks/useStats";
import { getTaskById } from "@/lib/tasks";
import type { TaskDuration, TaskEnergy } from "@/lib/tasks";
import type { Mood } from "@/lib/stats/types";
import { ToolSelector } from "@/components/ToolSelector";
import clsx from "clsx";

interface EnergyOption {
  value: TaskEnergy;
  labelKey: "energy.mental" | "energy.physical" | "energy.creative";
  descKey: "energy.mental.desc" | "energy.physical.desc" | "energy.creative.desc";
  icon: typeof Brain;
  color: string;
  bgColor: string;
}

const ENERGIES: EnergyOption[] = [
  { value: "low", labelKey: "energy.mental", descKey: "energy.mental.desc", icon: Brain, color: "#8b5cf6", bgColor: "from-violet-500/10 to-violet-500/5" },
  { value: "medium", labelKey: "energy.physical", descKey: "energy.physical.desc", icon: Dumbbell, color: "#f97316", bgColor: "from-orange-500/10 to-orange-500/5" },
  { value: "high", labelKey: "energy.creative", descKey: "energy.creative.desc", icon: Palette, color: "#ec4899", bgColor: "from-pink-500/10 to-pink-500/5" },
];

export default function EnergyPage() {
  const router = useRouter();
  const { t, dir } = useLocale();
  const stats = useStats();
  const [mood, setMood] = useState<Mood | null>(null);

  const pickTask = (energy: TaskEnergy) => {
    const durationStr = sessionStorage.getItem("selectedDuration");
    if (!durationStr) {
      router.push("/time");
      return;
    }
    const duration = Number(durationStr) as TaskDuration;

    // استخدم التوصية الذكية (مع المزاج)
    const chosen = stats.recommend({
      duration,
      energy,
      mood: mood || undefined,
    });

    if (!chosen) {
      alert("لا توجد مهام بهذه المواصفات. جرّب مدة أخرى.");
      router.push("/time");
      return;
    }

    // احفظ المزاج للمرحلة التالية
    if (mood) {
      sessionStorage.setItem("selectedMood", mood);
    }

    sessionStorage.setItem("currentTaskId", chosen.id);
    router.push(`/task/${chosen.id}`);
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background via-background to-card/20" />

      <header className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
        <button onClick={() => router.push("/time")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors" aria-label={t("common.back")}>
          {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t("common.back")}</span>
        </button>
        <LanguageSelector />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md flex flex-col items-center gap-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-light text-foreground">
              {t("energy.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("energy.subtitle")}
            </p>
          </div>

          {/* اختيار المزاج (اختياري) */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">حالك إيه؟ (اختياري)</p>
              {mood && (
                <button
                  onClick={() => setMood(null)}
                  className="text-xs text-primary hover:underline"
                >
                  تخطي
                </button>
              )}
            </div>
            <MoodSelector value={mood || undefined} onChange={setMood} />
          </div>

          {/* اختيار الأدوات */}
          <ToolSelector
            selected={stats.availableTools}
            onChange={(tools) => tools.forEach((t) => {
              if (t === "none") return;
              if (!stats.availableTools.includes(t)) {
                stats.toggleTool(t);
              }
            })}
          />

          {/* بطاقات الطاقة */}
          <div className="w-full flex flex-col gap-3">
            {ENERGIES.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <motion.button
                  key={opt.value}
                  initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.02, x: dir === "rtl" ? -4 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => pickTask(opt.value)}
                  className={clsx(
                    "group relative overflow-hidden p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-200 flex items-center gap-4 text-start"
                  )}
                >
                  <div className={clsx("absolute inset-0 bg-gradient-to-r opacity-50", opt.bgColor)} />
                  <div className="relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${opt.color}20` }}>
                    <Icon className="w-6 h-6" style={{ color: opt.color }} />
                  </div>
                  <div className="relative flex-1 min-w-0">
                    <div className="text-lg font-medium text-foreground">{t(opt.labelKey)}</div>
                    <div className="text-xs text-muted-foreground">{t(opt.descKey)}</div>
                  </div>
                  {dir === "rtl" ? (
                    <ArrowLeft className="relative w-5 h-5 text-muted-foreground group-hover:-translate-x-1 group-hover:text-foreground transition-all" />
                  ) : (
                    <ArrowRight className="relative w-5 h-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-foreground transition-all" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
