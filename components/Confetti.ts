"use client";

import confetti from "canvas-confetti";

/** confetti احتفال كبير (لإنجاز مهمة) */
export function celebrate() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.9,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

/** confetti صغير (لتقييم 5 نجوم) */
export function miniCelebrate() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    zIndex: 9999,
    colors: ["#fbbf24", "#f59e0b", "#fcd34d"],
  });
}

/** confetti جانبي (لإنجاز جديد) */
export function sideCelebrate() {
  const end = Date.now() + 600;
  const colors = ["#8b5cf6", "#ec4899", "#06b6d4"];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors,
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
