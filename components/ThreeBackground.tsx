"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * خلفية C: "ساعة رملية زجاجية فضية"
 *
 * النسخة الأنيقة (مطابقة للصورة المرجعية):
 * - زجاج شفاف بدون إطار خشبي
 * - رمل فضي لامع (معدني)
 * - خلفية سوداء أنيقة
 * - إضاءة جانبية سينمائية
 * - انعكاس على الأرض
 *
 * الأداء:
 * - 300 حبة رمل (خفيف)
 * - DPR 1.5x, antialias off
 * - 30fps throttle
 * - Lazy-loaded
 */

const SAND_COUNT = 350;
const FLIP_INTERVAL = 30;

const sandVertex = `
  attribute float aSize;
  attribute float aOpacity;
  varying float vOpacity;
  void main() {
    vOpacity = aOpacity;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// شادر يحاكي الرمل المعدني اللامع (يعتمد على موقع في الفضاء + إضاءة وهمية)
const sandFragment = `
  varying float vOpacity;
  uniform float uTime;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * vOpacity;
    // تدرج لوني فضي: أبيض لامع → رمادي داكن
    vec3 light = vec3(0.95, 0.96, 0.98);
    vec3 dark = vec3(0.4, 0.4, 0.45);
    // إضاءة عشوائية لكل حبة (لتأثير الـ shimmer)
    float shimmer = sin(uTime * 3.0 + gl_FragCoord.x * 0.1 + gl_FragCoord.y * 0.1) * 0.5 + 0.5;
    vec3 col = mix(dark, light, shimmer * 0.6 + 0.4);
    gl_FragColor = vec4(col, alpha);
  }
`;

interface Grain {
  x: number;
  y: number;
  vx: number;
  vy: number;
  settled: boolean;
  size: number;
  opacity: number;
}

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        drawStaticScene(containerRef.current);
        return;
      }
    }

    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    // خلفية سوداء أنيقة
    scene.background = new THREE.Color(0x050505);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 10;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
      });
    } catch (e) {
      drawStaticScene(container);
      return;
    }

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // --------- الزجاج الشفاف (يحدّد شكل الساعة) ---------
    // مثلثان زجاجيان شفافان (علوي وسفلي)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.05,
      transmission: 0.95, // شفافية عالية
      thickness: 0.5,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      ior: 1.5, // انكسار زجاج حقيقي
    });

    const hourglass = new THREE.Group();

    // المثلث العلوي (مقلوب)
    const triTop = new THREE.Mesh(
      new THREE.ConeGeometry(1.1, 3.2, 32, 1, true),
      glassMat
    );
    triTop.position.y = 1.6;
    hourglass.add(triTop);

    // المثلث السفلي
    const triBot = new THREE.Mesh(
      new THREE.ConeGeometry(1.1, 3.2, 32, 1, true),
      glassMat
    );
    triBot.position.y = -1.6;
    triBot.rotation.z = Math.PI;
    hourglass.add(triBot);

    // عنق ضيق (مخروط صغير)
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.15, 16, 1, true),
      glassMat
    );
    hourglass.add(neck);

    scene.add(hourglass);

    // --------- إضاءة سينمائية جانبية ---------
    const light1 = new THREE.DirectionalLight(0xffffff, 1.2);
    light1.position.set(3, 1, 5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xa0b4d4, 0.6);
    light2.position.set(-3, -1, 4);
    scene.add(light2);

    const ambient = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambient);

    // --------- حبيبات الرمل الفضي ---------
    const positions = new Float32Array(SAND_COUNT * 3);
    const sizes = new Float32Array(SAND_COUNT);
    const opacities = new Float32Array(SAND_COUNT);

    const grains: Grain[] = [];
    for (let i = 0; i < SAND_COUNT; i++) {
      const isTop = i < SAND_COUNT / 2;
      const grain: Grain = {
        x: (Math.random() - 0.5) * 1.0,
        y: isTop ? 0.3 + Math.random() * 2.6 : -0.3 - Math.random() * 2.6,
        vx: 0,
        vy: 0,
        settled: !isTop,
        size: 0.04 + Math.random() * 0.04,
        opacity: 0.95,
      };
      grains.push(grain);
      writeGrain(grain, i, positions, sizes, opacities);
    }

    function writeGrain(
      g: Grain,
      idx: number,
      pos: Float32Array,
      s: Float32Array,
      o: Float32Array
    ) {
      pos[idx * 3] = g.x;
      pos[idx * 3 + 1] = g.y;
      pos[idx * 3 + 2] = 0;
      s[idx] = g.size;
      o[idx] = g.opacity;
    }

    const sandGeo = new THREE.BufferGeometry();
    sandGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    sandGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    sandGeo.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));

    const sandMat = new THREE.ShaderMaterial({
      vertexShader: sandVertex,
      fragmentShader: sandFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
      },
    });

    const sandPoints = new THREE.Points(sandGeo, sandMat);
    scene.add(sandPoints);

    // --------- "خيط الرمل" بين الحجرتين (تيار رفيع) ---------
    // مجموعة صغيرة من الجزيئات المتساقطة بسرعة
    const streamCount = 12;
    const streamPos = new Float32Array(streamCount * 3);
    const streamSizes = new Float32Array(streamCount);
    const streamOp = new Float32Array(streamCount);
    for (let i = 0; i < streamCount; i++) {
      streamPos[i * 3] = (Math.random() - 0.5) * 0.03;
      streamPos[i * 3 + 1] = -0.5 + (i / streamCount) * 1.0;
      streamPos[i * 3 + 2] = 0;
      streamSizes[i] = 0.04;
      streamOp[i] = 0.9;
    }
    const streamGeo = new THREE.BufferGeometry();
    streamGeo.setAttribute("position", new THREE.BufferAttribute(streamPos, 3));
    streamGeo.setAttribute("aSize", new THREE.BufferAttribute(streamSizes, 1));
    streamGeo.setAttribute(
      "aOpacity",
      new THREE.BufferAttribute(streamOp, 1)
    );
    const streamMat = new THREE.ShaderMaterial({
      vertexShader: sandVertex,
      fragmentShader: sandFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
    });
    const stream = new THREE.Points(streamGeo, streamMat);
    scene.add(stream);

    // --------- الانقلاب التلقائي ---------
    let lastFlip = 0;
    let flipPhase = 0;
    let flipProgress = 0;
    const FLIP_DURATION = 2.5;
    const SWAP_AT = 0.5;

    // --------- التفاعل ---------
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

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(dpr);
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // --------- الحلقة ---------
    const clock = new THREE.Clock();
    let raf = 0;
    let lastTime = performance.now();
    let lastFrame = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      if (now - lastFrame < 33) return;
      lastFrame = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = clock.getElapsedTime();

      (sandMat.uniforms.uTime.value as number) = t;
      (streamMat.uniforms.uTime.value as number) = t;

      // انقلاب
      if (t - lastFlip > FLIP_INTERVAL) {
        flipPhase = 1;
        flipProgress = 0;
        lastFlip = t;
      }
      if (flipPhase === 1) {
        flipProgress += dt / FLIP_DURATION;
        const rot = flipProgress * Math.PI;
        hourglass.rotation.z = rot;
        if (flipProgress >= SWAP_AT && flipProgress < SWAP_AT + 0.1) {
          for (let i = 0; i < grains.length; i++) {
            grains[i].y = -grains[i].y;
            grains[i].x = -grains[i].x * 0.3;
            if (grains[i].y > 0) grains[i].vy = -0.05;
            else grains[i].vy = 0.05;
            grains[i].settled = false;
          }
        }
        if (flipProgress >= 1) {
          flipPhase = 0;
          flipProgress = 0;
          hourglass.rotation.z = 0;
        }
      }

      // فيزياء الرمل
      const posAttr = sandGeo.attributes.position as THREE.BufferAttribute;
      const sizeAttr = sandGeo.attributes.aSize as THREE.BufferAttribute;
      const opacityAttr = sandGeo.attributes
        .aOpacity as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const sizeArr = sizeAttr.array as Float32Array;
      const opArr = opacityAttr.array as Float32Array;

      for (let i = 0; i < grains.length; i++) {
        const g = grains[i];
        if (!g.settled) {
          g.vy -= 0.012 * 60 * dt;
          g.vy *= 0.995;
          g.vx *= 0.97;
          g.vx += (Math.random() - 0.5) * 0.003;
          g.x += g.vx;
          g.y += g.vy;
          // حدود المثلثات
          const halfWidth = (Math.abs(g.y) / 3.2) * 1.0;
          if (g.y > 0) {
            if (g.y > 3) g.y = 3;
            if (Math.abs(g.x) > halfWidth) {
              g.x = Math.sign(g.x) * halfWidth;
              g.vx *= -0.3;
            }
          } else {
            if (g.y < -3) g.y = -3;
            if (Math.abs(g.x) > halfWidth) {
              g.x = Math.sign(g.x) * halfWidth;
              g.vx *= -0.3;
            }
          }
          if (g.y < -2.8) {
            g.settled = true;
            g.vx = 0;
            g.vy = 0;
          }
          if (g.y > 2.8 && flipPhase === 0) {
            g.settled = true;
            g.vx = 0;
            g.vy = 0;
          }
        }
        const wiggleX = g.settled ? Math.sin(t * 0.5 + i) * 0.003 : 0;
        const wiggleY = g.settled ? Math.cos(t * 0.4 + i * 0.7) * 0.002 : 0;
        posArr[i * 3] = g.x + wiggleX;
        posArr[i * 3 + 1] = g.y + wiggleY;
        sizeArr[i] = g.size;
        opArr[i] = g.opacity;
      }

      posAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;
      opacityAttr.needsUpdate = true;

      // تحديث خيط الرمل (تيار ينزل من العنق)
      const streamPosAttr = streamGeo.attributes
        .position as THREE.BufferAttribute;
      const streamPosArr = streamPosAttr.array as Float32Array;
      for (let i = 0; i < streamCount; i++) {
        streamPosArr[i * 3 + 1] -= 0.04; // ينزل
        if (streamPosArr[i * 3 + 1] < -3) {
          streamPosArr[i * 3 + 1] = -0.05; // يعود للعنق
        }
        // ميلان مع الساعة
        if (flipPhase === 1) {
          streamPosArr[i * 3 + 1] = -streamPosArr[i * 3 + 1];
        }
      }
      streamPosAttr.needsUpdate = true;

      // تفاعل الماوس: ميلان خفيف
      if (mouse.active) {
        const targetRotY = mouse.x * 0.15;
        const targetRotX = -mouse.y * 0.08;
        hourglass.rotation.y += (targetRotY - hourglass.rotation.y) * 0.03;
        hourglass.rotation.x += (targetRotX - hourglass.rotation.x) * 0.03;
        sandPoints.rotation.y = hourglass.rotation.y;
        sandPoints.rotation.x = hourglass.rotation.x;
        stream.rotation.y = hourglass.rotation.y;
        stream.rotation.x = hourglass.rotation.x;
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
      glassMat.dispose();
      sandGeo.dispose();
      sandMat.dispose();
      streamGeo.dispose();
      streamMat.dispose();
      hourglass.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
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

function drawStaticScene(container: HTMLDivElement | null) {
  if (!container) return;
  container.style.background = "#050505";
}
