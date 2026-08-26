"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

/**
 * حقل جزيئات تفاعلي:
 * - جزيئات ذهبية/بنفسجية مضيئة
 * - تتفاعل مع حركة الماوس (الكاميرا تميل نحو المؤشر)
 * - تتنفس ببطء (توسّع/انكماش)
 * - رمزية: التشتت ← التنظيم (تحويل الملل لبناء)
 */

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const COUNT = 1800;

  // مواقع عشوائية في كرة
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // توزيع في كرة (spherical)
      const r = 4 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  // ألوان متدرجة (ذهبي → بنفسجي)
  const colors = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const gold = new THREE.Color("#f59e0b");
    const violet = new THREE.Color("#8b5cf6");
    for (let i = 0; i < COUNT; i++) {
      const c = gold.clone().lerp(violet, Math.random());
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.current.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (pointsRef.current) {
      // دوران بطيء
      pointsRef.current.rotation.y += 0.0006;
      pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.15;
    }
    if (groupRef.current) {
      // ميلان نحو الماوس (تفاعل)
      const targetX = mouse.current.y * 0.3;
      const targetY = mouse.current.x * 0.3;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;
      // تنفّس
      const scale = 1 + Math.sin(t * 0.5) * 0.03;
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ضباب خلفي للعمق
function FogPlane() {
  return null;
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-20">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ParticleField />
      </Canvas>
      {/* طبقة تعتيم خفيفة لقراءة النص (الخلفية 3D تبان من خلالها) */}
      <div className="absolute inset-0 bg-background/35" />
      {/* توهج ذهبي خفيف أسفل الشاشة */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at bottom, rgba(245,158,11,0.18), transparent 70%)",
        }}
      />
    </div>
  );
}
