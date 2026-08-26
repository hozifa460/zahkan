"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { useLocale } from "@/hooks/useLocale";
import { LanguageSelector } from "@/components/LanguageSelector";
import { MoodSelector } from "@/components/MoodSelector";
import { useStats } from "@/hooks/useStats";
import { CATEGORIES, ALL_TASKS, type TaskCategory, type TaskDuration, type TaskEnergy } from "@/lib/tasks";
import type { Mood } from "@/lib/stats/types";
import { ToolSelector } from "@/components/ToolSelector";
import type { Tool } from "@/lib/tasks/tools";
import clsx from "clsx";

type EnergyFilter = "all" | "low" | "medium" | "high";

interface EnergyOption {
  value: EnergyFilter;
  label: string;
  desc: string;
  icon: string;
  color: string;
}

const ENERGY_FILTERS: EnergyOption[] = [
  { value: "all", label: "الكل", desc: "كل المستويات", icon: "✨", color: "#8b5cf6" },
  { value: "low", label: "منخفضة", desc: "سهل ومريح", icon: "🧘", color: "#10b981" },
  { value: "medium", label: "متوسطة", desc: "بعض الجهد", icon: "⚡", color: "#f59e0b" },
  { value: "high", label: "عالية", desc: "تحدّي وتركيز", icon: "🔥", color: "#ef4444" },
];

export default function EnergyPage() {
  const router = useRouter();
  const { t, dir } = useLocale();
  const stats = useStats();
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);
  const [energyFilter, setEnergyFilter] = useState<EnergyFilter>("all");
  const [mood, setMood] = useState<Mood | null>(null);
  const [showTools, setShowTools] = useState(false);

  // عدد المهام في كل فئة
  const taskCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_TASKS.forEach((task) => {
      counts[task.category] = (counts[task.category] || 0) + 1;
    });
    return counts;
  }, []);

  // الحصول على المهام المتاحة بناءً على الفلاتر
  const availableTasks = useMemo(() => {
    let tasks = ALL_TASKS;
    if (selectedCategory) {
      tasks = tasks.filter((t) => t.category === selectedCategory);
    }
    if (energyFilter !== "all") {
      tasks = tasks.filter((t) => t.energy === energyFilter);
    }
    return tasks;
  }, [selectedCategory, energyFilter]);

  // مهمة عشوائية بناءً على الفلاتر
  const pickTask = () => {
    const durationStr = sessionStorage.getItem("selectedDuration");
    if (!durationStr) {
      router.push("/time");
      return;
    }
    const duration = Number(durationStr) as TaskDuration;

    // ابحث عن مهمة في الفلاتر المحددة
    let candidates = ALL_TASKS.filter((t) => t.duration === duration);

    if (selectedCategory) {
      // نُفضّل الفئة المختارة (60%)، والباقي (40%)
      const sameCategory = candidates.filter((t) => t.category === selectedCategory);
      const others = candidates.filter((t) => t.category !== selectedCategory);

      if (sameCategory.length > 0 && Math.random() < 0.7) {
        candidates = sameCategory;
      } else {
        candidates = others.length > 0 ? others : sameCategory;
      }
    }

    if (energyFilter !== "all") {
      const sameEnergy = candidates.filter((t) => t.energy === energyFilter);
      if (sameEnergy.length > 0) {
        candidates = sameEnergy;
      }
    }

    // تصفية حسب الأدوات المتاحة
    if (stats.availableTools.length > 0 && !stats.availableTools.includes("none")) {
      const toolMatched = candidates.filter((t) => {
        if (!t.tags.includes("habit")) return true; // المهام العادية دائماً متاحة
        // للمهام من فئات habit، نتحقق من الأدوات
        const habitTags = t.tags.filter((tag) => ["quran", "dhikr", "salam", "forgiveness", "sadaqah", "athkar", "morning", "evening", "intention", "silah", "family", "parents", "friends", "neighbor", "wisdom"].includes(tag));
        if (habitTags.length === 0) return true; // ليست مهمة تتطلب أداة
        // هذه المهام تتطلب "body" (جسد) أو "phone" - دائماً متاحة
        return true;
      });
      if (toolMatched.length > 0) candidates = toolMatched;
    }

    if (candidates.length === 0) {
      alert("لا توجد مهام بهذه المواصفات. جرّب فلاتر مختلفة.");
      return;
    }

    const chosen = candidates[Math.floor(Math.random() * candidates.length)];

    if (mood) {
      sessionStorage.setItem("selectedMood", mood);
    }
    sessionStorage.setItem("currentTaskId", chosen.id);
    router.push(`/task/${chosen.id}`);
  };

  // Toggle tool handler
  const handleToolToggle = (tool: Tool) => {
    if (tool === "none") {
      // مسح كل الأدوات
      stats.availableTools.forEach((t) => {
        if (t !== "none") stats.toggleTool(t);
      });
      return;
    }
    stats.toggleTool(tool);
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background via-background to-card/20" />

      <header className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
        <button
          onClick={() => router.push("/time")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>رجوع</span>
        </button>
        <LanguageSelector />
      </header>

      <main className="flex flex-1 flex-col items-center pt-20 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl space-y-6"
        >
          {/* العنوان */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-light">عايز تركز على إيه؟</h1>
            <p className="text-sm text-muted-foreground">
              اختار الفئة ومستوى الطاقة، والباقي علينا
            </p>
          </div>

          {/* الفئات */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">الفئة</p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs text-primary hover:underline"
                >
                  مسح التحديد
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = taskCountByCategory[cat.id] || 0;
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                    className={clsx(
                      "relative p-3 rounded-2xl border transition-all text-start",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <div
                      className="absolute top-2 left-2 w-2 h-2 rounded-full"
                      style={{ background: cat.color }}
                    />
                    <div className="text-xs text-muted-foreground mb-1">
                      {count} {count === 1 ? "مهمة" : "مهام"}
                    </div>
                    <div className="text-sm font-medium">{cat.name.ar}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* مستوى الطاقة */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">مستوى الطاقة</p>
            <div className="grid grid-cols-4 gap-2">
              {ENERGY_FILTERS.map((opt) => {
                const isSelected = energyFilter === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setEnergyFilter(opt.value)}
                    className={clsx(
                      "p-3 rounded-2xl border transition-all flex flex-col items-center gap-1",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-xs font-medium">{opt.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* اختيار المزاج */}
          <div className="space-y-2">
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

          {/* الأدوات المتاحة */}
          <div className="space-y-2">
            <button
              onClick={() => setShowTools(!showTools)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Filter className="w-3 h-3" />
              <span>الأدوات المتاحة لديك ({stats.availableTools.length})</span>
              <span className="text-primary">{showTools ? "▲" : "▼"}</span>
            </button>
            <AnimatePresence>
              {showTools && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <ToolSelector
                    selected={stats.availableTools}
                    onChange={(tools) => {
                      // نُزامن الحالة: نُضيف الجديد ونُزيل المُلغي
                      const currentSet = new Set(stats.availableTools);
                      const newSet = new Set(tools);

                      // أضف ما هو جديد
                      tools.forEach((tool) => {
                        if (tool !== "none" && !currentSet.has(tool)) {
                          stats.toggleTool(tool);
                        }
                      });
                      // أزل ما تم إلغاؤه
                      stats.availableTools.forEach((tool) => {
                        if (tool !== "none" && !newSet.has(tool)) {
                          stats.toggleTool(tool);
                        }
                      });
                    }}
                  />
                  <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
                    اضغط لإضافة أو إزالة أداة
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ملخص المهام المتاحة */}
          <div className="text-center text-xs text-muted-foreground">
            {availableTasks.length > 0
              ? `${availableTasks.length} مهمة متاحة بهذه المواصفات`
              : "لا توجد مهام. جرّب فلاتر مختلفة."}
          </div>

          {/* زر البدء الكبير */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={pickTask}
            disabled={availableTasks.length === 0}
            className="w-full p-5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-medium text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5" />
            ابدأ المهمة
            {dir === "rtl" ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </motion.button>

          {/* شعار */}
          <p className="text-[10px] text-center text-muted-foreground/40">
            كل ما تختاره يُحسّن التوصيات القادمة
          </p>
        </motion.div>
      </main>
    </div>
  );
}
