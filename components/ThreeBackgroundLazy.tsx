"use client";

import dynamic from "next/dynamic";

/**
 * Wrapper كسول لـ ThreeBackground
 * - لا يدخل في initial bundle (525KB)
 * - فقط يُحمّل على المتصفح بعد رسم الصفحة الأولى
 * - يحل مشكلة "This page couldn't load" في الشبكات الضعيفة
 */
const ThreeBackground = dynamic(
  () => import("./ThreeBackground").then((m) => m.ThreeBackground),
  {
    ssr: false,
    loading: () => null, // لا شيء أثناء التحميل
  }
);

export { ThreeBackground };
