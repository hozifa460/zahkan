/**
 * نظام فلاتر الأدوات للمهام
 *
 * كل مهمة تحتاج أدوات معيّنة. المستخدم يختار ما لديه،
 * والتطبيق يُصفّي المهام وفقاً لذلك.
 */

import type { Task } from "./types";

export type Tool = "pen" | "paper" | "camera" | "computer" | "body" | "none";

export interface ToolInfo {
  id: Tool;
  name: string;          // عربي افتراضي
  nameEn: string;
  emoji: string;
  description: string;
}

export const TOOLS: ToolInfo[] = [
  {
    id: "none",
    name: "بدون أدوات",
    nameEn: "No tools",
    emoji: "✨",
    description: "أي شيء تحتاجه فقط عقلك",
  },
  {
    id: "body",
    name: "جسدي فقط",
    nameEn: "Body only",
    emoji: "🏃",
    description: "رياضة، حركة، تنفس",
  },
  {
    id: "pen",
    name: "قلم",
    nameEn: "Pen",
    emoji: "✏️",
    description: "كتابة، رسم، تخطيط",
  },
  {
    id: "paper",
    name: "ورق",
    nameEn: "Paper",
    emoji: "📄",
    description: "دفتر، كتاب، طباعة",
  },
  {
    id: "camera",
    name: "كاميرا",
    nameEn: "Camera",
    emoji: "📷",
    description: "تصوير، فيديو",
  },
  {
    id: "computer",
    name: "حاسوب",
    nameEn: "Computer",
    emoji: "💻",
    description: "برمجة، كتابة رقمية",
  },
];

/** الأدوات التي تحتاجها مهمة معيّنة */
export const TASK_TOOLS: Record<string, Tool[]> = {
  // ذهنية
  "free-improvements": ["pen", "paper"],
  "math-puzzle": ["pen", "paper"],
  "deep-questions": ["pen", "paper"],
  "brain-game": ["computer", "paper"],
  "free-writing": ["pen", "paper"],
  "self-talk": ["none"],
  "old-problem": ["pen", "paper"],
  "mind-map": ["pen", "paper"],

  // حركية
  "jumping-jacks-30": ["body"],
  "hiit-7": ["body"],
  "brisk-walk": ["body"],
  "stretching": ["body"],
  "push-squat": ["body"],
  "plank-challenge": ["body"],
  "free-dance": ["body"],
  "balance-30min": ["body"],

  // إبداعية
  "draw-circle": ["pen", "paper"],
  "poem-line": ["pen", "paper"],
  "voice-30s": ["camera"],  // موبايل أيضاً
  "memory-draw": ["pen", "paper"],
  "photograph-different": ["camera"],
  "short-story": ["pen", "paper", "computer"],
  "art-project": ["pen", "paper"],

  // تعلّم
  "read-page": ["paper"],
  "edu-video": ["computer"],
  "learn-3-words": ["pen", "paper"],
  "full-lesson": ["computer"],
  "read-article": ["computer", "paper"],
  "five-facts": ["computer"],
  "full-course": ["computer"],

  // بناء
  "update-readme": ["computer"],
  "code-20": ["computer"],
  "one-html": ["computer"],
  "python-script": ["computer"],
  "small-app": ["computer"],
  "fix-issue": ["computer"],
  "api-doc": ["computer"],

  // صفاء
  "breathe-478": ["none"],
  "focus-meditation": ["none"],
  "body-scan": ["none"],
  "quick-yoga": ["body"],
  "gratitude-3": ["pen", "paper"],
  "walking-meditation": ["body"],
  "digital-silence": ["none"],

  // اكتشاف
  "5-unnoticed": ["none"],
  "new-place": ["body"],
  "meet-neighbor": ["body"],
  "hear-story": ["none"],
  "try-new": ["none"],
  "discover-city": ["body"],
};

/**
 * يُصفّي المهام التي يمكن إنجازها بالأدوات المتاحة
 */
export function filterTasksByTools(tasks: Task[], availableTools: Tool[]): Task[] {
  if (availableTools.length === 0) return tasks;

  return tasks.filter((task) => {
    const required = TASK_TOOLS[task.id] || ["none"];
    // المهمة ممكنة إذا كانت أي أداة من أدواتها متاحة
    return required.some((tool) => availableTools.includes(tool));
  });
}

export function getTaskRequiredTools(taskId: string): Tool[] {
  return TASK_TOOLS[taskId] || ["none"];
}
