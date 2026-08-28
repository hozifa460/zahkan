"use client";

import { Repeat } from "lucide-react";

/**
 * زر صغير "اعكس عادة سيئة" — فوق العنوان الكبير في المنتصف.
 * <a> عادي (يضمن التنقّل حتى لو router تأخر)، بسيط وهادئ.
 */
export function ReverseHabitButton() {
  return (
    <a
      href="/reverse"
      className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
    >
      <Repeat className="w-3.5 h-3.5" />
      <span>اعكس عادة سيئة</span>
    </a>
  );
}
