"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * خلفية Three.js تفاعلية (Vanilla — لا React Three Fiber)
 *
 * لماذا Vanilla وليس react-three-fiber؟
 *  - @react-three/fiber يفشل صامتاً في بعض بيئات Static Export
 *  - Vanilla Three.js مضمون 100% على أي بيئة
 *  - نفس النتيجة المرئية: جزيئات + تفاعل + دوران
 *
 * - 1500 جزيء مضيء (ذهبي/بنفسجي)
 * - يتفاعل مع الماوس/اللمس
 * - دوران بطيء + تنفّس
 * - يبقى خلف كل الصفحات (في layout)
 */
export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---------- تهيئة المشهد ----------
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.04);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0a, 0); // شفاف
    container.appendChild(renderer.domElement);

    // ---------- الجزيئات ----------
    const COUNT = 1500;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    const gold = new THREE.Color(0xf59e0b);
    const violet = new THREE.Color(0x8b5cf6);
    const light = new THREE.Color(0xfde68a);

    for (let i = 0; i < COUNT; i++) {
      // توزيع في كرة
      const r = 3 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // لون عشوائي بين الذهبي والبنفسجي
      const c = gold
        .clone()
        .lerp(violet, Math.random() * 0.7)
        .lerp(light, Math.random() * 0.2);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 0.05 + 0.02;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Shader مخصّص: جزيء دائري مضيء
    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      void main() {
        // جزيء دائري ناعم
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor, alpha * 0.9);
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

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ---------- الماوس / اللمس ----------
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

    // ---------- التفاعل مع التمرير ----------
    const onScroll = () => {
      const sy = window.scrollY / Math.max(1, document.body.scrollHeight);
      particles.rotation.y = sy * Math.PI * 0.5;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ---------- تحجيم ----------
    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(dpr);
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ---------- حلقة الرسم ----------
    const clock = new THREE.Clock();
    let raf = 0;
    let lastRender = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // دوران تلقائي بطيء
      particles.rotation.y += 0.0008;
      particles.rotation.x = Math.sin(t * 0.1) * 0.15;

      // تفاعل الماوس: ميلان المجموعة
      if (mouse.active) {
        const targetRotX = mouse.y * 0.3;
        const targetRotY = mouse.x * 0.3;
        particles.rotation.x +=
          (targetRotX - particles.rotation.x) * 0.04;
        particles.rotation.y +=
          (targetRotY - particles.rotation.y) * 0.04;
      }

      // تنفّس: تكبير/تصغير
      const scale = 1 + Math.sin(t * 0.5) * 0.04;
      particles.scale.setScalar(scale);

      renderer.render(scene, camera);
    };
    tick();

    // ---------- تنظيف ----------
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
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
