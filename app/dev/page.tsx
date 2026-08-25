"use client";

import { useState } from "react";
import { ALL_TASKS, getStats, validateTasks } from "@/lib/tasks";
import { useLocale } from "@/hooks/useLocale";
import { CATEGORIES } from "@/lib/tasks/categories";

export default function DevPage() {
  const { t } = useLocale();
  const [tab, setTab] = useState<"stats" | "tasks" | "validation">("stats");

  const stats = getStats();
  const issues = validateTasks();

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">🛠️ صفحة المطور</h1>
      <p className="text-muted-foreground mb-6">للتحقق من قاعدة المهام</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {(["stats", "tasks", "validation"] as const).map((tt) => (
          <button
            key={tt}
            onClick={() => setTab(tt)}
            className={`px-4 py-2 text-sm transition-colors ${
              tab === tt
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tt === "stats" && "📊 إحصائيات"}
            {tt === "tasks" && "📋 المهام"}
            {tt === "validation" && `⚠️ مشاكل (${issues.length})`}
          </button>
        ))}
      </div>

      {tab === "stats" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-card rounded-lg">
              <div className="text-3xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground">إجمالي المهام</div>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {stats.total * 6}
              </div>
              <div className="text-xs text-muted-foreground">نصوص مترجمة</div>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {ALL_TASKS.reduce((sum, task) => sum + task.steps.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">إجمالي الخطوات</div>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {ALL_TASKS.reduce((sum, task) => sum + task.xp, 0)}
              </div>
              <div className="text-xs text-muted-foreground">إجمالي XP</div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">حسب الفئة</h2>
            <div className="space-y-2">
              {stats.byCategory.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-2 bg-card/50 rounded"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: c.color }}
                  />
                  <span className="flex-1 text-sm">
                    {c.name[t("app.name") === "زهقان" ? "ar" : "en"]}
                  </span>
                  <span className="text-sm font-mono">{c.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">حسب المدة</h2>
            <div className="grid grid-cols-4 gap-2">
              {stats.byDuration.map((d) => (
                <div key={d.duration} className="p-3 bg-card/50 rounded text-center">
                  <div className="text-2xl font-bold">{d.duration}</div>
                  <div className="text-xs text-muted-foreground">
                    {d.duration === 60 ? "ساعة" : "د"}
                  </div>
                  <div className="text-sm mt-1 font-mono">{d.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "tasks" && (
        <div className="space-y-2">
          {ALL_TASKS.map((task) => {
            const cat = CATEGORIES.find((c) => c.id === task.category);
            return (
              <div
                key={task.id}
                className="p-3 bg-card/50 rounded flex items-center gap-3"
              >
                <div
                  className="w-2 h-10 rounded-full"
                  style={{ background: cat?.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {task.title.ar}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {task.title.en}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex gap-2">
                  <span>{task.duration}d</span>
                  <span>·</span>
                  <span>{task.steps.length} steps</span>
                  <span>·</span>
                  <span className="text-primary">+{task.xp}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "validation" && (
        <div>
          {issues.length === 0 ? (
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
              <div className="text-4xl mb-2">✅</div>
              <div className="font-semibold">كل المهام سليمة!</div>
              <div className="text-sm text-muted-foreground mt-1">
                كل النصوص موجودة في كل اللغات
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {issues.slice(0, 100).map((issue, i) => (
                <div
                  key={i}
                  className="p-2 bg-red-500/10 border border-red-500/20 rounded text-sm"
                >
                  <span className="font-mono text-red-400">{issue.taskId}</span>
                  <span className="text-muted-foreground"> · </span>
                  <span>{issue.locale}</span>
                  <span className="text-muted-foreground"> · </span>
                  <span>{issue.field}</span>
                  <span className="text-muted-foreground"> · </span>
                  <span className="text-red-300">{issue.issue}</span>
                </div>
              ))}
              {issues.length > 100 && (
                <div className="text-sm text-muted-foreground text-center pt-2">
                  +{issues.length - 100} مشكلة أخرى
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <a
        href="/"
        className="inline-block mt-8 text-sm text-primary hover:underline"
      >
        ← العودة للرئيسية
      </a>
    </div>
  );
}
