"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * خلفية C: "حبوب رمل تتجمع في ساعة رملية"
 *
 * الرمزية: الوقت يمر (الملل يتحول لفرصة بناء)
 *
 * المنظر:
 * - خلفية كهرمانية دافئة (تدرّج غروب)
 * - إطار ساعة رملية (خشب + زجاج)
 * - ~800 حبة رمل تتساقط
 * - تتجمع في الأسفل
 * - كل 30 ثانية: تنقلب تلقائياً
 * - تحذير بصري: "لا تُضيّع وقتك"
 */

const SAND_COUNT = 800;
const FLIP_INTERVAL = 30; // ثوانٍ بين كل انقلاب
const GRAVITY = 0.012;

// ألوان الرمل: ذهبي / كهرماني / نحاسي
const sandColors = [
  new THREE.Color(0xfbbf24), // ذهبي
  new THREE.Color(0xf59e0b), // كهرماني
  new THREE.Color(0xd97706), // نحاسي
  new THREE.Color(0xea580c), // برتقالي
];

// ---------- Shaders ----------

const sandVertex = `
  attribute float aSize;
  attribute float aOpacity;
  attribute vec3 aColor;
  varying float vOpacity;
  varying vec3 vColor;
  void main() {
    vOpacity = aOpacity;
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const sandFragment = `
  varying float vOpacity;
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * vOpacity;
    // إضاءة من المركز للحواف
    vec3 col = mix(vColor * 0.4, vColor, smoothstep(0.5, 0.0, d));
    gl_FragColor = vec4(col, alpha);
  }
`;

// ---------- مكوّن ----------

interface Grain {
  x: number;
  y: number;
  vx: number;
  vy: number;
  settled: boolean;
  size: number;
  color: THREE.Color;
  opacity: number;
}

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---------- المشهد ----------
    const scene = new THREE.Scene();

    // خلفية متدرجة كهرمانية (تدرّج عمودي)
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 12;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // ---------- تدرّج الخلفية (شادر) ----------
    const bgGeo = new THREE.PlaneGeometry(50, 30);
    const bgMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          // تدرّج: من برتقالي دافئ (أعلى) إلى ذهبي (أسفل)
          vec3 top = vec3(0.45, 0.20, 0.10); // كهرماني غامق
          vec3 mid = vec3(0.60, 0.30, 0.10); // برتقالي
          vec3 bot = vec3(0.30, 0.15, 0.05); // بني
          float t = vUv.y;
          vec3 col = mix(bot, mid, smoothstep(0.0, 0.5, t));
          col = mix(col, top, smoothstep(0.5, 1.0, t));
          // نبض خفيف
          col += 0.02 * sin(uTime * 0.3);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      depthWrite: false,
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.z = -10;
    scene.add(bgMesh);

    // ---------- إطار الساعة الرملية (بسيط) ----------
    // 4 أعمدة خشبية + 2 مثلث زجاجي
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x3a1f0a,
      roughness: 0.7,
      metalness: 0.2,
    });
    const glassMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
    });

    // إطار الساعة
    const frame = new THREE.Group();

    // لوح خشبي علوي
    const topPlate = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.15, 0.4),
      woodMat
    );
    topPlate.position.y = 4;
    frame.add(topPlate);

    // لوح خشبي سفلي
    const botPlate = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.15, 0.4),
      woodMat
    );
    botPlate.position.y = -4;
    frame.add(botPlate);

    // 4 أعمدة
    for (let i = 0; i < 4; i++) {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 8.2, 8),
        woodMat
      );
      col.position.set(i < 2 ? -1.3 : 1.3, 0, i % 2 === 0 ? -0.15 : 0.15);
      frame.add(col);
    }

    // مثلثات زجاجية
    const triTop = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 4, 4, 1, true),
      glassMat
    );
    triTop.position.y = 2;
    triTop.rotation.y = Math.PI / 4;
    frame.add(triTop);

    const triBot = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 4, 4, 1, true),
      glassMat
    );
    triBot.position.y = -2;
    triBot.rotation.y = Math.PI / 4;
    triBot.rotation.z = Math.PI;
    frame.add(triBot);

    // إضاءة خفيفة
    const light = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(light);
    const dirLight = new THREE.DirectionalLight(0xffd9a3, 0.8);
    dirLight.position.set(3, 5, 5);
    scene.add(dirLight);

    scene.add(frame);

    // ---------- حبيبات الرمل ----------
    const positions = new Float32Array(SAND_COUNT * 3);
    const sizes = new Float32Array(SAND_COUNT);
    const opacities = new Float32Array(SAND_COUNT);
    const colors = new Float32Array(SAND_COUNT * 3);

    const grains: Grain[] = [];
    for (let i = 0; i < SAND_COUNT; i++) {
      // نصف في الأعلى، نصف في الأسفل (في البداية)
      const isTop = i < SAND_COUNT / 2;
      const grain: Grain = {
        x: isTop ? (Math.random() - 0.5) * 1.5 : (Math.random() - 0.5) * 1.5,
        y: isTop ? 0.5 + Math.random() * 3 : -0.5 - Math.random() * 3,
        vx: 0,
        vy: 0,
        settled: !isTop,
        size: 0.03 + Math.random() * 0.025,
        color: sandColors[Math.floor(Math.random() * sandColors.length)],
        opacity: 0.9,
      };
      grains.push(grain);
      writeGrain(grain, i, positions, sizes, opacities, colors);
    }

    function writeGrain(
      g: Grain,
      idx: number,
      pos: Float32Array,
      s: Float32Array,
      o: Float32Array,
      c: Float32Array
    ) {
      pos[idx * 3] = g.x;
      pos[idx * 3 + 1] = g.y;
      pos[idx * 3 + 2] = 0.1;
      s[idx] = g.size;
      o[idx] = g.opacity;
      c[idx * 3] = g.color.r;
      c[idx * 3 + 1] = g.color.g;
      c[idx * 3 + 2] = g.color.b;
    }

    const sandGeo = new THREE.BufferGeometry();
    sandGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    sandGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    sandGeo.setAttribute(
      "aOpacity",
      new THREE.BufferAttribute(opacities, 1)
    );
    sandGeo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    const sandMat = new THREE.ShaderMaterial({
      vertexShader: sandVertex,
      fragmentShader: sandFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const sandPoints = new THREE.Points(sandGeo, sandMat);
    scene.add(sandPoints);

    // ---------- إدارة الانقلاب ----------
    let lastFlip = 0;
    let flipPhase = 0; // 0 = تساقط عادي، 1 = قلب
    let flipProgress = 0;
    const FLIP_DURATION = 2.5; // ثوانٍ
    const SWAP_TOP_BOTTOM_AT = 0.5; // لحظة تبادل

    // ---------- الحلقة ----------
    const clock = new THREE.Clock();
    let raf = 0;
    let lastTime = performance.now();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = clock.getElapsedTime();

      // شادر الخلفية
      (bgMat.uniforms.uTime.value as number) = t;

      // إدارة الانقلاب
      if (t - lastFlip > FLIP_INTERVAL) {
        flipPhase = 1;
        flipProgress = 0;
        lastFlip = t;
      }

      if (flipPhase === 1) {
        flipProgress += dt / FLIP_DURATION;
        // دوران الإطار
        const rot = flipProgress * Math.PI;
        frame.rotation.z = rot;
        // عند منتصف الانقلاب: تبديل
        if (flipProgress >= SWAP_TOP_BOTTOM_AT && flipProgress < SWAP_TOP_BOTTOM_AT + 0.1) {
          // تبديل مواقع كل الحبيبات: عكس Y
          for (let i = 0; i < grains.length; i++) {
            grains[i].y = -grains[i].y;
            grains[i].x = -grains[i].x * 0.3;
            // الحبيبات في الأعلى تنزل، وفي الأسفل تصعد
            if (grains[i].y > 0) {
              grains[i].vy = -0.05;
            } else {
              grains[i].vy = 0.05;
            }
            grains[i].settled = false;
          }
        }
        if (flipProgress >= 1) {
          flipPhase = 0;
          flipProgress = 0;
          frame.rotation.z = 0;
        }
      }

      // تحديث حبيبات الرمل (فيزياء)
      const posAttr = sandGeo.attributes.position as THREE.BufferAttribute;
      const sizeAttr = sandGeo.attributes.aSize as THREE.BufferAttribute;
      const opacityAttr = sandGeo.attributes
        .aOpacity as THREE.BufferAttribute;
      const colorAttr = sandGeo.attributes.aColor as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const sizeArr = sizeAttr.array as Float32Array;
      const opArr = opacityAttr.array as Float32Array;
      const colArr = colorAttr.array as Float32Array;

      for (let i = 0; i < grains.length; i++) {
        const g = grains[i];

        if (!g.settled) {
          // جاذبية
          g.vy -= GRAVITY * 60 * dt;
          // احتكاك هواء
          g.vy *= 0.995;
          g.vx *= 0.97;
          g.vx += (Math.random() - 0.5) * 0.003;

          g.x += g.vx;
          g.y += g.vy;

          // حدود الساعة الرملية (مثلث)
          // الجزء العلوي: ضيق عند y=0، عريض عند y=4
          // الجزء السفلي: عريض عند y=0، ضيق عند y=-4
          const halfWidth = (Math.abs(g.y) / 4) * 1.1;

          if (g.y > 0) {
            // في الجزء العلوي (مثلث مقلوب)
            if (g.y > 4) g.y = 4;
            if (Math.abs(g.x) > halfWidth) {
              g.x = Math.sign(g.x) * halfWidth;
              g.vx *= -0.3;
            }
          } else {
            // في الجزء السفلي (مثلث)
            if (g.y < -4) g.y = -4;
            if (Math.abs(g.x) > halfWidth) {
              g.x = Math.sign(g.x) * halfWidth;
              g.vx *= -0.3;
            }
          }

          // ثبات في القاع
          if (g.y < -3.8) {
            g.settled = true;
            g.vx = 0;
            g.vy = 0;
          }
          // ثبات في الأعلى
          if (g.y > 3.8 && flipPhase === 0) {
            g.settled = true;
            g.vx = 0;
            g.vy = 0;
          }
        }

        // اهتزاز طفيف حتى لو ثبت
        const wiggleX = g.settled ? Math.sin(t * 0.5 + i) * 0.005 : 0;
        const wiggleY = g.settled ? Math.cos(t * 0.4 + i * 0.7) * 0.003 : 0;

        posArr[i * 3] = g.x + wiggleX;
        posArr[i * 3 + 1] = g.y + wiggleY;
        sizeArr[i] = g.size;
        opArr[i] = g.opacity;
        colArr[i * 3] = g.color.r;
        colArr[i * 3 + 1] = g.color.g;
        colArr[i * 3 + 2] = g.color.b;
      }

      posAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;
      opacityAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;

      // تحريك الإطار مع الماوس
      if (mouse.active) {
        const targetRotY = mouse.x * 0.2;
        const targetRotX = -mouse.y * 0.1;
        frame.rotation.y += (targetRotY - frame.rotation.y) * 0.03;
        frame.rotation.x += (targetRotX - frame.rotation.x) * 0.03;
        sandPoints.rotation.y = frame.rotation.y;
        sandPoints.rotation.x = frame.rotation.x;
      }

      renderer.render(scene, camera);
    };
    tick();

    // ---------- التفاعل ----------
    const mouse = { x: 0, y: 0, world: new THREE.Vector3(), active: false };

    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.x = x;
      mouse.y = y;
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

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      bgGeo.dispose();
      bgMat.dispose();
      woodMat.dispose();
      glassMat.dispose();
      sandGeo.dispose();
      sandMat.dispose();
      frame.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
        }
      });
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
