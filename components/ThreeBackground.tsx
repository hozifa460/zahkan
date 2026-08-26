"use client";

import { useEffect, useRef } from "react";

/**
 * خلفية C: "ساعة رملية زجاجية فضية" — Canvas 2D
 *
 * نسخة خفيفة جداً (لا Three.js، لا مكتبات 3D):
 * - زجاج شفاف مرسوم بـ Canvas paths
 * - رمل فضي لامع مع shimmer
 * - خلفية سوداء أنيقة
 * - فيزياء بسيطة (جاذبية)
 * - انقلاب كل 30 ثانية
 * - خيط رفيع للرمل بين الحجرتين
 *
 * الحجم: ~8KB (مقابل 520KB لـ Three.js)
 * يعمل على أي متصفح وجهاز
 */

const SAND_COUNT = 250;
const FLIP_INTERVAL = 30;

interface Grain {
  x: number;
  y: number;
  vx: number;
  vy: number;
  settled: boolean;
  size: number;
  alpha: number;
}

export function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // حجم Canvas مع مراعاة DPR
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = window.innerWidth;
    let H = window.innerHeight;

    const setSize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    // ----------------- الرمل -----------------
    const grains: Grain[] = [];
    for (let i = 0; i < SAND_COUNT; i++) {
      const isTop = i < SAND_COUNT / 2;
      grains.push({
        x: (Math.random() - 0.5) * 100,
        y: isTop ? 60 + Math.random() * 220 : -60 - Math.random() * 220,
        vx: 0,
        vy: 0,
        settled: !isTop,
        size: 1.4 + Math.random() * 1.6,
        alpha: 0.7 + Math.random() * 0.3,
      });
    }

    // ----------------- الانقلاب -----------------
    let lastFlip = 0;
    let flipPhase = 0; // 0 = عادي, 1 = قلب
    let flipProgress = 0;
    const FLIP_DURATION = 2.5;
    const SWAP_AT = 0.5;
    let hourglassAngle = 0;

    // ----------------- التفاعل -----------------
    const mouse = { x: W / 2, y: H / 2, active: false };
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
    const onLeave = () => (mouse.active = false);
    const onTouchEnd = () => (mouse.active = false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchend", onTouchEnd);

    // تحجيم
    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      setSize();
    };
    window.addEventListener("resize", onResize);

    // ----------------- الحلقة -----------------
    let raf = 0;
    let start = performance.now();
    let lastFrame = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - lastFrame < 33) return; // 30fps
      lastFrame = now;
      const t = (now - start) / 1000;

      // خلفية سوداء
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, W, H);

      // ---- انقلاب ----
      if (t - lastFlip > FLIP_INTERVAL) {
        flipPhase = 1;
        flipProgress = 0;
        lastFlip = t;
      }
      if (flipPhase === 1) {
        flipProgress += 0.016 / FLIP_DURATION;
        hourglassAngle = flipProgress * Math.PI;
        if (flipProgress >= SWAP_AT && flipProgress < SWAP_AT + 0.05) {
          for (const g of grains) {
            g.y = -g.y;
            g.x = -g.x * 0.3;
            g.vy = g.y > 0 ? -2 : 2;
            g.settled = false;
          }
        }
        if (flipProgress >= 1) {
          flipPhase = 0;
          flipProgress = 0;
          hourglassAngle = 0;
        }
      }

      // ---- فيزياء الرمل ----
      for (const g of grains) {
        if (!g.settled) {
          g.vy -= 0.55;
          g.vy *= 0.99;
          g.vx *= 0.97;
          g.vx += (Math.random() - 0.5) * 0.15;
          g.x += g.vx;
          g.y += g.vy;
          // حدود الساعة
          const coneY = g.y;
          const halfW = (Math.abs(coneY) / 240) * 100;
          if (Math.abs(g.x) > halfW) {
            g.x = Math.sign(g.x) * halfW;
            g.vx *= -0.3;
          }
          if (g.y < -220) {
            g.settled = true;
            g.vx = 0;
            g.vy = 0;
          }
          if (g.y > 220 && flipPhase === 0) {
            g.settled = true;
            g.vx = 0;
            g.vy = 0;
          }
        }
      }

      // ---- حساب موقع الساعة ----
      const cx = W / 2;
      const cy = H / 2;

      // ميلان مع الماوس
      let tiltX = 0;
      let tiltY = 0;
      if (mouse.active) {
        tiltY = (mouse.x - cx) / W * 0.15;
        tiltX = -(mouse.y - cy) / H * 0.1;
      }
      const finalAngle = hourglassAngle + tiltY;

      // ---- رسم الساعة (مع الدوران) ----
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(finalAngle);
      // 3D-ish tilt (skew)
      ctx.transform(1, 0, tiltX, 1, 0, 0);

      // ----- إطار الزجاج (توهج خفيف) -----
      ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
      ctx.shadowBlur = 20;

      // المثلث العلوي (مقلوب — ضيق في الأسفل، عريض في الأعلى)
      ctx.beginPath();
      ctx.moveTo(0, 0); // قمة العنق
      ctx.lineTo(-100, -240); // أعلى يسار
      ctx.lineTo(100, -240); // أعلى يمين
      ctx.closePath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // المثلث السفلي
      ctx.beginPath();
      ctx.moveTo(0, 0); // قمة العنق
      ctx.lineTo(-100, 240); // أسفل يسار
      ctx.lineTo(100, 240); // أسفل يمين
      ctx.closePath();
      ctx.stroke();

      // ----- زجاج شفاف (تعبئة خفيفة) -----
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.fill();

      // ----- لوحات علوية وسفلية (تجميل) -----
      ctx.fillStyle = "rgba(60, 60, 70, 0.7)";
      ctx.fillRect(-105, -245, 210, 6);
      ctx.fillRect(-105, 239, 210, 6);

      // ----- حبيبات الرمل -----
      for (const g of grains) {
        // لون فضي لامع (يتغير مع الوقت لـ shimmer)
        const shimmer = Math.sin(t * 4 + g.x * 0.05 + g.y * 0.05) * 0.5 + 0.5;
        const lightness = 180 + shimmer * 60; // 180-240
        ctx.fillStyle = `rgba(${lightness}, ${lightness}, ${lightness + 8}, ${g.alpha})`;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ----- خيط الرمل بين الحجرتين (تيار) -----
      for (let i = 0; i < 8; i++) {
        const yy = -4 + i * 1.2;
        if (yy > 4) break;
        const shimmer = Math.sin(t * 12 + i) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(220, 220, 230, ${0.6 + shimmer * 0.4})`;
        ctx.beginPath();
        ctx.arc((Math.random() - 0.5) * 1.5, yy, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // ----- انعكاس خفيف على الأرض -----
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(cx, cy + 250, 80, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
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
    </div>
  );
}
