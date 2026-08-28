"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Repeat } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * زر صغير "اعكس عادة سيئة" — في الأعلى في المنتصف (داخل الهيدر).
 * بسيط وهادئ (بدون توهج/ألوان مبالغ فيها).
 */
export function ReverseHabitButton() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      onClick={() => router.push("/reverse")}
      type="button"
      className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <Repeat className="w-3.5 h-3.5" />
      <span>اعكس عادة سيئة</span>
    </motion.button>
  );
}
