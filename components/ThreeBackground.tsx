"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * خلفية B: "بذور تنمو لشجيرات"
 *
 * الرمزية: بناء العادات يحتاج وقت + جهد
 *
 * - 80 بذرة في "تربة" (الجزء السفلي)
 * - البذور تنمو ببطء (growth 0→1)
 * - عند لمس البذرة: تنمو فوراً لشجيرة
 * - لها جذع + أوراق + أحياناً زهرة
 * - بعد النمو الكامل: تتفتح وتطلق "بذور" جديدة
 * - الفأرة/اللمس: تنمو البذور القريبة
 */

const SEED_COUNT = 80;
const GROWTH_SPEED = 0.04; // نمو بطيء (عادة تحتاج وقت)
const MAX_DIST = 1.5; // مسافة تأثير اللمس

// ----------------- Shaders -----------------

const vertexShader = `
  attribute float aSize;
  attribute float aGrowth;
  attribute vec3 aColor;
  varying float vGrowth;
  varying vec3 vColor;
  void main() {
    vGrowth = aGrowth;
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (1.0 + aGrowth * 0.5) * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vGrowth;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    // البذرة: بني صغير. الشجيرة: ذهبي/أخضر مضيء
    vec3 col = mix(vec3(0.4, 0.25, 0.1), vColor, vGrowth);
    gl_FragColor = vec4(col, alpha * (0.4 + vGrowth * 0.6));
  }
`;

// ----------------- مكوّن -----------------

interface SeedData {
  x: number;
  y: number;
  z: number;
  growth: number;
  baseSize: number;
  color: THREE.Color;
  targetSize: number;
}

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.06);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 10;
    camera.position.y = 1; // نرفع الكاميرا قليلاً لنرى التربة

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0a, 0);
    container.appendChild(renderer.domElement);

    // ---------- البذور ----------
    const positions = new Float32Array(SEED_COUNT * 3);
    const sizes = new Float32Array(SEED_COUNT);
    const growths = new Float32Array(SEED_COUNT);
    const colors = new Float32Array(SEED_COUNT * 3);

    // ألوان: أخضر-ذهبي-بنفسجي
    const palette = [
      new THREE.Color(0xf59e0b), // ذهبي
      new THREE.Color(0x10b981), // أخضر زمردي
      new THREE.Color(0x84cc16), // أخضر ليموني
      new THREE.Color(0x8b5cf6), // بنفسجي
      new THREE.Color(0x22c55e), // أخضر
    ];

    const seeds: SeedData[] = [];
    const W = 12; // عرض منطقة البذور
    for (let i = 0; i < SEED_COUNT; i++) {
      const x = (Math.random() - 0.5) * W;
      const y = -2 + Math.random() * 0.4; // في الأسفل (التربة)
      const z = (Math.random() - 0.5) * 1.5 - 0.5; // عمق

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const baseSize = 0.04 + Math.random() * 0.03;
      sizes[i] = baseSize;
      growths[i] = 0;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      seeds.push({
        x,
        y,
        z,
        growth: 0,
        baseSize,
        color,
        targetSize: baseSize,
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aGrowth", new THREE.BufferAttribute(growths, 1));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ---------- "أوراق" إضافية تنمو من البذور ----------
    // عند نمو بذرة، نُضيف نقاط صغيرة حولها كأوراق
    const MAX_LEAVES = 400;
    const leafPositions = new Float32Array(MAX_LEAVES * 3);
    const leafSizes = new Float32Array(MAX_LEAVES);
    const leafGrowths = new Float32Array(MAX_LEAVES);
    const leafColors = new Float32Array(MAX_LEAVES * 3);
    const leafAges = new Float32Array(MAX_LEAVES); // 0..1 ثم يختفي
    const leafSeeds: number[] = []; // لأي بذرة تتبع

    for (let i = 0; i < MAX_LEAVES; i++) {
      leafPositions[i * 3 + 1] = -100; // مخفية
      leafAges[i] = -1;
    }

    const leafGeometry = new THREE.BufferGeometry();
    leafGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(leafPositions, 3)
    );
    leafGeometry.setAttribute("aSize", new THREE.BufferAttribute(leafSizes, 1));
    leafGeometry.setAttribute(
      "aGrowth",
      new THREE.BufferAttribute(leafGrowths, 1)
    );
    leafGeometry.setAttribute(
      "aColor",
      new THREE.BufferAttribute(leafColors, 3)
    );

    const leafMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const leaves = new THREE.Points(leafGeometry, leafMaterial);
    scene.add(leaves);

    let nextLeafIdx = 0;
    function spawnLeaf(seedIdx: number) {
      const idx = nextLeafIdx;
      nextLeafIdx = (nextLeafIdx + 1) % MAX_LEAVES;

      const seed = seeds[seedIdx];
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.1 + Math.random() * 0.4 * seed.growth;
      const height = 0.1 + Math.random() * 0.5 * seed.growth;

      leafPositions[idx * 3] = seed.x + Math.cos(angle) * dist;
      leafPositions[idx * 3 + 1] = seed.y + height;
      leafPositions[idx * 3 + 2] = seed.z + (Math.random() - 0.5) * 0.2;

      leafSizes[idx] = 0.04 + Math.random() * 0.04;
      leafGrowths[idx] = seed.growth;
      leafColors[idx * 3] = seed.color.r;
      leafColors[idx * 3 + 1] = seed.color.g;
      leafColors[idx * 3 + 2] = seed.color.b;
      leafAges[idx] = 1.0; // تبدأ جديدة
      leafSeeds[idx] = seedIdx;
    }

    // ---------- التفاعل ----------
    const mouse = { x: 0, y: 0, world: new THREE.Vector3(), active: false };

    const onMouseMove = (e: MouseEvent) => {
      // تحويل موضع الماوس لإحداثيات عالم
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.x = x;
      mouse.y = y;
      // مكان في العالم (مستوى z=0)
      const ndc = new THREE.Vector3(x, y, 0.5);
      ndc.unproject(camera);
      mouse.world.copy(ndc);
      mouse.active = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) onMouseMove(e.touches[0] as any);
    };
    const onLeave = () => (mouse.active = false);
    const onTouchEnd = () => (mouse.active = false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchend", onTouchEnd);

    // تحجيم
    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(dpr);
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ---------- الحلقة ----------
    const clock = new THREE.Clock();
    let raf = 0;
    let lastSpawn = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // تحديث نمو البذور
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const sizeAttr = geometry.attributes.aSize as THREE.BufferAttribute;
      const growthAttr = geometry.attributes.aGrowth as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const sizeArr = sizeAttr.array as Float32Array;
      const growthArr = growthAttr.array as Float32Array;

      for (let i = 0; i < SEED_COUNT; i++) {
        const seed = seeds[i];

        // البذور القريبة من الماوس تنمو أسرع
        let growthSpeed = GROWTH_SPEED;
        if (mouse.active) {
          const dx = seed.x - mouse.world.x;
          const dy = seed.y - mouse.world.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const influence = 1 - d / MAX_DIST;
            growthSpeed += influence * 0.15;
          }
        }

        // بعض البذور تنمو تلقائياً ببطء شديد (عادات تلقائية)
        if (Math.random() < 0.001) {
          seed.growth = Math.min(1, seed.growth + 0.2);
        }

        seed.growth = Math.min(1, seed.growth + growthSpeed * 0.016);
        growthArr[i] = seed.growth;
        // الحجم يكبر مع النمو
        sizeArr[i] = seed.baseSize * (1 + seed.growth * 1.2);
        // البذرة ترتفع قليلاً عند النمو
        posArr[i * 3 + 1] = seed.y + seed.growth * 0.05;

        // إطلاق أوراق أحياناً
        if (seed.growth > 0.3 && Math.random() < 0.02) {
          spawnLeaf(i);
        }
        if (seed.growth > 0.7 && Math.random() < 0.04) {
          spawnLeaf(i);
        }
      }

      posAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;
      growthAttr.needsUpdate = true;

      // تحديث الأوراق (تتلاشى مع الوقت)
      const leafPosAttr = leafGeometry.attributes.position as THREE.BufferAttribute;
      const leafSizeAttr = leafGeometry.attributes.aSize as THREE.BufferAttribute;
      const leafGrowthAttr = leafGeometry.attributes.aGrowth as THREE.BufferAttribute;
      const leafColorAttr = leafGeometry.attributes.aColor as THREE.BufferAttribute;
      const leafPosArr = leafPosAttr.array as Float32Array;
      const leafSizeArr = leafSizeAttr.array as Float32Array;
      const leafGrowthArr = leafGrowthAttr.array as Float32Array;
      const leafColorArr = leafColorAttr.array as Float32Array;

      for (let i = 0; i < MAX_LEAVES; i++) {
        if (leafAges[i] > 0) {
          leafAges[i] -= 0.005;
          // تموّج خفيف
          const sway = Math.sin(t * 2 + i) * 0.02;
          leafPosArr[i * 3] += sway * 0.02;
          leafPosArr[i * 3 + 1] += 0.002; // تطفو لأعلى
          // الحجم يتقلص مع الشيخوخة
          leafSizeArr[i] = leafSizeArr[i] * 0.998;
          if (leafAges[i] <= 0) {
            leafPosArr[i * 3 + 1] = -100; // تختفي
            leafAges[i] = -1;
          }
        }
      }

      leafPosAttr.needsUpdate = true;
      leafSizeAttr.needsUpdate = true;
      leafGrowthAttr.needsUpdate = true;
      leafColorAttr.needsUpdate = true;

      // ميلان المشهد نحو الماوس
      if (mouse.active) {
        const targetRotY = mouse.x * 0.2;
        const targetRotX = -mouse.y * 0.1;
        points.rotation.y += (targetRotY - points.rotation.y) * 0.04;
        points.rotation.x += (targetRotX - points.rotation.x) * 0.04;
        leaves.rotation.y = points.rotation.y;
        leaves.rotation.x = points.rotation.x;
      }

      // موجة نمو كل 8 ثوانٍ
      if (t - lastSpawn > 8) {
        lastSpawn = t;
        // اختيار 5 بذور عشوائية لتنمو فجأة
        for (let i = 0; i < 5; i++) {
          const idx = Math.floor(Math.random() * SEED_COUNT);
          seeds[idx].growth = Math.min(1, seeds[idx].growth + 0.3);
        }
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      leafGeometry.dispose();
      leafMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
