"use client";

import { Repeat } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * زر صغير "اعكس عادة سيئة" — فوق العنوان الكبير في المنتصف.
 * بسيط وهادئ (بدون توهج/ألوان)، يظهر فوراً بدون اختفاء.
 */
export function ReverseHabitButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/reverse")}
      type="button"
      className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <Repeat className="w-3.5 h-3.5" />
      <span>اعكس عادة سيئة</span>
    </button>
  );
}
