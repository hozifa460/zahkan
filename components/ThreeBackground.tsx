"use client";

import { useEffect, useRef } from "react";

/**
 * خلفية جزيئات تفاعلية (Canvas 2D نقي)
 *
 * - يعمل على أي متصفح وجهاز (حتى الأجهزة القديمة)
 * - أخف 10x من Three.js
 * - يتفاعل مع الماوس/اللمس
 * - رمزية: جزيئات ذهبية/بنفسجية = تحويل الملل لبناء
 */
export function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // تحجيم Canvas ليتناسب مع DPR والشاشة
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;
    const setSize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.scale(dpr, dpr);
    };
    setSize();

    // الجزيئات
    const COUNT = 140;
    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      baseR: number;
      color: string;
      phase: number;
    };
    const colors = ["#f59e0b", "#fbbf24", "#8b5cf6", "#a78bfa", "#fde68a"];
    const particles: P[] = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.8 + 0.6,
        baseR: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
      });
      particles[i].baseR = particles[i].r;
    }

    // خطوط ربط بين الجزيئات القريبة
    const MAX_LINK_DIST = 110;

    const mouse = { x: W / 2, y: H / 2, active: false };

    const onResize = () => setSize();
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };
    const onMouseLeave = () => (mouse.active = false);
    const onTouchEnd = () => (mouse.active = false);

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchend", onTouchEnd);

    let raf = 0;
    let start = performance.now();

    const tick = (now: number) => {
      const t = (now - start) / 1000;

      // مسح بتعتيم خفيف (إعطاء أثر "ذيول")
      ctx.fillStyle = "rgba(10, 10, 10, 0.18)";
      ctx.fillRect(0, 0, W, H);

      // رسم الخطوط بين الجزيئات القريبة
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        // ارتداد من الحواف
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        // تنفّس بطيء
        p.r = p.baseR * (0.8 + Math.sin(t * 0.8 + p.phase) * 0.3);
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_LINK_DIST) {
            const alpha = (1 - d / MAX_LINK_DIST) * 0.18;
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // رسم الجزيئات + تفاعل الماوس
      for (const p of particles) {
        // جذب/صدّ من الماوس
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 12000) {
            const d = Math.sqrt(d2);
            const force = (1 - d / 110) * 0.4;
            p.x += (dx / d) * force;
            p.y += (dy / d) * force;
            p.r = p.baseR * 2.2;
          }
        }

        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // توهج إضافي عند الماوس
      if (mouse.active) {
        const grad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          180
        );
        grad.addColorStop(0, "rgba(245, 158, 11, 0.18)");
        grad.addColorStop(1, "rgba(245, 158, 11, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />
      {/* توهج ذهبي خفيف في الأسفل */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom, rgba(245,158,11,0.20), transparent 70%)",
        }}
      />
    </div>
  );
}
