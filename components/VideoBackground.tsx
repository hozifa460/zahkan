"use client";

import { useEffect, useRef } from "react";

/**
 * خلفية فيديو ثابتة تبقى خلف كل الصفحات
 * توضع في layout.tsx خارج المحتوى
 * لأن layout لا يُعاد تحميله عند التنقل، الفيديو يستمر بدون انقطاع
 */
export function VideoBackground({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // تشغيل تلقائي صامت وحلقي
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.play().catch(() => {
      // بعض المتصفحات تمنع التشغيل التلقائي؛ نتركه كخلفية ثابتة
    });
  }, [src]);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-background">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        src={src}
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* طبقة تعتيم لقراءة النص */}
      <div className="absolute inset-0 bg-background/70" />
    </div>
  );
}
