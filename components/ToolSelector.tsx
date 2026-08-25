"use client";

import { motion } from "framer-motion";
import { TOOLS, type Tool } from "@/lib/tasks/tools";
import clsx from "clsx";

interface ToolSelectorProps {
  selected: Tool[];
  onChange: (tools: Tool[]) => void;
}

export function ToolSelector({ selected, onChange }: ToolSelectorProps) {
  const toggle = (tool: Tool) => {
    if (tool === "none") {
      // "none" يعني إزالة كل الأدوات
      onChange([]);
      return;
    }
    if (selected.includes(tool)) {
      onChange(selected.filter((t) => t !== tool));
    } else {
      onChange([...selected, tool]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">ما الأدوات المتاحة لديك؟</p>
        <p className="text-xs text-muted-foreground/60">
          {selected.length} مفعّل
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {TOOLS.map((tool) => {
          const isActive = tool.id === "none"
            ? selected.length === 0
            : selected.includes(tool.id);
          return (
            <motion.button
              key={tool.id}
              type="button"
              onClick={() => toggle(tool.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={clsx(
                "p-3 rounded-xl border-2 transition-all text-center",
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/50 opacity-60"
              )}
            >
              <div className="text-xl mb-1">{tool.emoji}</div>
              <div className="text-xs font-medium">{tool.name}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
