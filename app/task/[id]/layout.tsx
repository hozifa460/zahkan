/** يُولّد كل المسارات الممكنة لـ /task/[id] للـ static export */
import { ALL_TASKS } from "@/lib/tasks";

export function generateStaticParams() {
  return ALL_TASKS.map((task) => ({ id: task.id }));
}

// layout فارغ — نُمرّر الأطفال كما هي
export default function TaskLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
