"use client";

import Link from "next/link";
import { Repeat } from "lucide-react";

/**
 * زر صغير "اعكس عادة سيئة" — فوق العنوان الكبير في المنتصف.
 */
export function ReverseHabitButton() {
  return (
    <Link
      href="/reverse"
      className="relative z-20 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 group cursor-pointer"
    >
      <Repeat className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-180 transition-transform duration-300" />
      <span>اعكس عادة سيئة</span>
    </Link>
  );
}
