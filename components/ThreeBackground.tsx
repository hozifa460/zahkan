"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * خلفية A: "نجوم → أشكال هندسية"
 *
 * الرمزية: تحويل الملل (فوضى) لبناء (تنظيم)
 *
 * - 600 جزيء
 * - حالتان: فوضى ↔ شكل هندسي (دائرة / نجمة / مثلث / مربع)
 * - يتحول كل 7 ثوانٍ
 * - تفاعل مع الماوس (تنافر)
 * - ألوان: ذهبي (#f59e0b) + بنفسجي (#8b5cf6)
 * - Shader مخصص لجزيئات ناعمة مع توهج
 */

type ShapeType = "chaos" | "circle" | "star" | "triangle" | "square" | "hexagon";

interface ShapeInfo {
  type: ShapeType;
  positions: Float32Array; // مواقع الهدف
  name: string;
}

const COUNT = 600;
const SHAPE_DURATION = 3500; // مللي ثانية لكل شكل
const TRANSITION = 1500; // مدة الانتقال

// --------------------- حساب مواقع الأشكال ---------------------

function buildCircle(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const r = 3 + (Math.random() - 0.5) * 0.2; // دائرة مع تباين بسيط
    arr[i * 3] = Math.cos(a) * r;
    arr[i * 3 + 1] = Math.sin(a) * r;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }
  return arr;
}

function buildStar(count: number): Float32Array {
  // نجمة خماسية
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const points = 5;
    const outerR = 3.2;
    const innerR = 1.3;
    const r =
      ((i / count) % (1 / points)) < 1 / (points * 2)
        ? outerR
        : innerR;
    const angle =
      t - Math.PI / 2;
    arr[i * 3] = Math.cos(angle) * r * (1 + (Math.random() - 0.5) * 0.05);
    arr[i * 3 + 1] = Math.sin(angle) * r * (1 + (Math.random() - 0.5) * 0.05);
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  return arr;
}

function buildTriangle(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // توزيع على حواف مثلث متساوي الأضلاع
    const t = Math.random();
    const edge = Math.floor(Math.random() * 3);
    const r = 3.3 * (1 + (Math.random() - 0.5) * 0.05);
    const angle =
      edge === 0
        ? 0
        : edge === 1
        ? (2 * Math.PI) / 3
        : (4 * Math.PI) / 3;
    const noise = (Math.random() - 0.5) * 0.1;
    arr[i * 3] = Math.cos(angle) * r + Math.cos(angle + Math.PI / 2) * noise;
    arr[i * 3 + 1] = Math.sin(angle) * r + Math.sin(angle + Math.PI / 2) * noise;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }
  return arr;
}

function buildSquare(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const side = Math.floor(Math.random() * 4);
    const t = (Math.random() - 0.5) * 6;
    const r = 2.4 * (1 + (Math.random() - 0.5) * 0.05);
    if (side === 0) {
      arr[i * 3] = t;
      arr[i * 3 + 1] = r;
    } else if (side === 1) {
      arr[i * 3] = t;
      arr[i * 3 + 1] = -r;
    } else if (side === 2) {
      arr[i * 3] = r;
      arr[i * 3 + 1] = t;
    } else {
      arr[i * 3] = -r;
      arr[i * 3 + 1] = t;
    }
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }
  return arr;
}

function buildHexagon(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const r = 3.2 * (1 + (Math.random() - 0.5) * 0.05);
    arr[i * 3] = Math.cos(t) * r;
    arr[i * 3 + 1] = Math.sin(t) * r;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }
  return arr;
}

function buildChaos(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 4 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

// --------------------- مكوّن الخلفية ---------------------

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // المشهد
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.04);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 9;

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

    // الجزيئات
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    const gold = new THREE.Color(0xf59e0b);
    const violet = new THREE.Color(0x8b5cf6);
    const light = new THREE.Color(0xfde68a);

    // مواقع ابتدائية: فوضى
    const chaos = buildChaos(COUNT);
    positions.set(chaos);

    for (let i = 0; i < COUNT; i++) {
      const c = gold
        .clone()
        .lerp(violet, Math.random() * 0.7)
        .lerp(light, Math.random() * 0.2);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = Math.random() * 0.06 + 0.025;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Shader
    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (320.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
    const fragmentShader = `
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor, alpha * 0.95);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --------------------- إدارة الأشكال ---------------------
    const SHAPES: ShapeInfo[] = [
      { type: "circle", positions: buildCircle(COUNT), name: "circle" },
      { type: "star", positions: buildStar(COUNT), name: "star" },
      { type: "triangle", positions: buildTriangle(COUNT), name: "triangle" },
      { type: "square", positions: buildSquare(COUNT), name: "square" },
      { type: "hexagon", positions: buildHexagon(COUNT), name: "hexagon" },
      { type: "chaos", positions: buildChaos(COUNT), name: "chaos" },
    ];

    let currentShapeIdx = -1;
    let nextShapeIdx = 0;
    let transitionStart = performance.now() + 1500; // بعد 1.5 ثانية من الفوضى الأولى
    let isTransitioning = false;
    let transitionFrom = chaos;

    function setNextShape() {
      currentShapeIdx = nextShapeIdx;
      const next = (currentShapeIdx + 1) % SHAPES.length;
      nextShapeIdx = next;
      transitionFrom = new Float32Array(positions); // snapshot
      isTransitioning = true;
      transitionStart = performance.now();
    }

    // الماوس
    const mouse = { x: 0, y: 0, active: false };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.active = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
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
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(dpr);
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // حلقة الرسم
    const clock = new THREE.Clock();
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const t = clock.getElapsedTime();

      // تحديث الشكل
      if (now - transitionStart > SHAPE_DURATION) {
        setNextShape();
      }

      const target = SHAPES[currentShapeIdx === -1 ? 0 : currentShapeIdx];
      const transition = Math.min(
        (now - transitionStart) / TRANSITION,
        1
      );
      const eased = 1 - Math.pow(1 - transition, 3); // ease-out cubic

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const fromX = transitionFrom[i3];
        const fromY = transitionFrom[i3 + 1];
        const fromZ = transitionFrom[i3 + 2];
        const toX = target.positions[i3];
        const toY = target.positions[i3 + 1];
        const toZ = target.positions[i3 + 2];

        // تنفّس بسيط حول الموقع
        const breath = Math.sin(t * 0.5 + i * 0.05) * 0.02;

        arr[i3] = fromX + (toX - fromX) * eased;
        arr[i3 + 1] = fromY + (toY - fromY) * eased + breath;
        arr[i3 + 2] = fromZ + (toZ - fromZ) * eased;
      }
      posAttr.needsUpdate = true;

      // دوران تلقائي بطيء
      points.rotation.y = t * 0.05;

      // تفاعل الماوس: تنافر (الجزيئات تبتعد عن المؤشر)
      if (mouse.active) {
        // هدف: مؤشر العالم
        const targetRotY = mouse.x * 0.4;
        const targetRotX = mouse.y * 0.3;
        points.rotation.y += (targetRotY - points.rotation.y) * 0.05;
        points.rotation.x += (targetRotX - points.rotation.x) * 0.05;
      }

      // تنفّس عام
      const scale = 1 + Math.sin(t * 0.5) * 0.04;
      points.scale.setScalar(scale);

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
