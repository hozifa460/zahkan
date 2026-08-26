"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * خلفية D: "خلايا تنقسم" + منظر عضوي (النسخة الخفيفة)
 *
 * - خلفية متدرجة حيّة (تنفّس)
 * - خلايا بألوان عضوية
 * - جزيئات بيئية
 * - هالات ناعمة
 * - تفاعل مع الماوس
 *
 * بدون meshes ثقيلة (لا ساعة رملية، لا أقماع، لا فيزياء)
 * محسّن للأداء: يحترم prefers-reduced-motion
 */

const CELL_COUNT = 60; // كان 90 — نُقلّل
const AMBIENT_COUNT = 200; // كان 300
const HALO_COUNT = 8;

const cellVertex = `
  attribute float aSize;
  attribute float aOpacity;
  attribute vec3 aColor;
  varying float vOpacity;
  varying vec3 vColor;
  void main() {
    vOpacity = aOpacity;
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (260.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const cellFragment = `
  varying float vOpacity;
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float alpha = core * vOpacity;
    vec3 col = mix(vColor * 0.5, vColor, core);
    gl_FragColor = vec4(col, alpha);
  }
`;

interface Cell {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  targetSize: number;
  age: number;
  maxAge: number;
  color: THREE.Color;
  opacity: number;
  dividing: boolean;
  divisionTimer: number;
}

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // احترام تفضيل تقليل الحركة
    if (typeof window !== "undefined") {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduceMotion) {
        // ارسم مشهد ثابت بدون animation
        drawStaticScene(containerRef.current);
        return;
      }
    }

    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const bgColors = [
      new THREE.Color(0x0a1f1a),
      new THREE.Color(0x0a1419),
      new THREE.Color(0x14110a),
      new THREE.Color(0x0a1414),
    ];
    let bgIdx = 0;
    let bgNextIdx = 1;
    let bgTransition = 0;
    const BG_DURATION = 12;

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 9;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false, // نُقلّل الحمل
        alpha: true,
        powerPreference: "low-power",
      });
    } catch (e) {
      // fallback: CSS background
      drawStaticScene(container);
      return;
    }

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5); // DPR أقل
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(bgColors[0], 1);
    container.appendChild(renderer.domElement);

    const positions = new Float32Array(CELL_COUNT * 3);
    const sizes = new Float32Array(CELL_COUNT);
    const opacities = new Float32Array(CELL_COUNT);
    const colors = new Float32Array(CELL_COUNT * 3);

    const palette = [
      new THREE.Color(0x10b981),
      new THREE.Color(0x34d399),
      new THREE.Color(0x60a5fa),
      new THREE.Color(0xa78bfa),
      new THREE.Color(0xf59e0b),
      new THREE.Color(0xfb7185),
    ];

    const cells: Cell[] = [];
    for (let i = 0; i < CELL_COUNT; i++) {
      const cell = createCell(palette, true);
      cells.push(cell);
      writeCell(cell, i, positions, sizes, opacities, colors);
    }

    function createCell(palette: THREE.Color[], initial = false): Cell {
      const color = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: (Math.random() - 0.5) * 12,
        y: (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.005,
        vy: (Math.random() - 0.5) * 0.005,
        size: initial ? 0.04 + Math.random() * 0.08 : 0.02,
        targetSize: 0.1 + Math.random() * 0.15,
        age: initial ? Math.random() : 0,
        maxAge: 10 + Math.random() * 12,
        color,
        opacity: initial ? 0.6 : 0,
        dividing: false,
        divisionTimer: 0,
      };
    }

    function writeCell(
      cell: Cell,
      idx: number,
      pos: Float32Array,
      s: Float32Array,
      o: Float32Array,
      c: Float32Array
    ) {
      pos[idx * 3] = cell.x;
      pos[idx * 3 + 1] = cell.y;
      pos[idx * 3 + 2] = (Math.random() - 0.5) * 0.5;
      s[idx] = cell.size;
      o[idx] = cell.opacity;
      c[idx * 3] = cell.color.r;
      c[idx * 3 + 1] = cell.color.g;
      c[idx * 3 + 2] = cell.color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.ShaderMaterial({
      vertexShader: cellVertex,
      fragmentShader: cellFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ambient particles
    const ambientPositions = new Float32Array(AMBIENT_COUNT * 3);
    const ambientSizes = new Float32Array(AMBIENT_COUNT);
    const ambientOpacities = new Float32Array(AMBIENT_COUNT);
    const ambientColors = new Float32Array(AMBIENT_COUNT * 3);

    for (let i = 0; i < AMBIENT_COUNT; i++) {
      ambientPositions[i * 3] = (Math.random() - 0.5) * 20;
      ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      ambientSizes[i] = 0.015 + Math.random() * 0.025;
      ambientOpacities[i] = 0.3 + Math.random() * 0.4;
      const base = palette[Math.floor(Math.random() * palette.length)];
      const c = base.clone().multiplyScalar(0.6);
      ambientColors[i * 3] = c.r;
      ambientColors[i * 3 + 1] = c.g;
      ambientColors[i * 3 + 2] = c.b;
    }

    const ambientGeo = new THREE.BufferGeometry();
    ambientGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(ambientPositions, 3)
    );
    ambientGeo.setAttribute(
      "aSize",
      new THREE.BufferAttribute(ambientSizes, 1)
    );
    ambientGeo.setAttribute(
      "aOpacity",
      new THREE.BufferAttribute(ambientOpacities, 1)
    );
    ambientGeo.setAttribute(
      "aColor",
      new THREE.BufferAttribute(ambientColors, 3)
    );

    const ambientMat = new THREE.ShaderMaterial({
      vertexShader: cellVertex,
      fragmentShader: cellFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const ambientPoints = new THREE.Points(ambientGeo, ambientMat);
    scene.add(ambientPoints);

    // halos
    const glowTex = makeGlowTexture();
    const glowGeo = new THREE.PlaneGeometry(2, 2);
    const halos: THREE.Mesh[] = [];
    for (let i = 0; i < HALO_COUNT; i++) {
      const m = new THREE.MeshBasicMaterial({
        map: glowTex,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: palette[i % palette.length],
      });
      const mesh = new THREE.Mesh(glowGeo, m);
      mesh.scale.setScalar(2 + Math.random() * 3);
      mesh.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10,
        -2
      );
      scene.add(mesh);
      halos.push(mesh);
    }

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

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(dpr);
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf = 0;
    let lastTime = performance.now();
    let lastFrame = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      // throttle to 30fps for perf
      const now = performance.now();
      if (now - lastFrame < 33) return;
      lastFrame = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = clock.getElapsedTime();

      bgTransition += (dt * 1000) / (BG_DURATION * 1000);
      if (bgTransition >= 1) {
        bgTransition = 0;
        bgIdx = bgNextIdx;
        bgNextIdx = (bgNextIdx + 1) % bgColors.length;
      }
      const bgEased = 1 - Math.pow(1 - bgTransition, 2);
      const currentBg = bgColors[bgIdx]
        .clone()
        .lerp(bgColors[bgNextIdx], bgEased);
      renderer.setClearColor(currentBg, 1);

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const sizeAttr = geometry.attributes.aSize as THREE.BufferAttribute;
      const opacityAttr = geometry.attributes
        .aOpacity as THREE.BufferAttribute;
      const colorAttr = geometry.attributes.aColor as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const sizeArr = sizeAttr.array as Float32Array;
      const opArr = opacityAttr.array as Float32Array;
      const colArr = colorAttr.array as Float32Array;

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.x += cell.vx + Math.sin(t * 0.5 + i) * 0.002;
        cell.y += cell.vy + Math.cos(t * 0.4 + i * 0.7) * 0.002;
        if (Math.abs(cell.x) > 7) cell.vx *= -1;
        if (Math.abs(cell.y) > 5) cell.vy *= -1;
        if (mouse.active) {
          const dx = mouse.world.x - cell.x;
          const dy = mouse.world.y - cell.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 2 && d > 0.01) {
            const force = 0.005 * (1 - d / 2);
            cell.vx += (dx / d) * force;
            cell.vy += (dy / d) * force;
          }
        }
        cell.vx *= 0.98;
        cell.vy *= 0.98;

        cell.age += dt;
        const lifeRatio = cell.age / cell.maxAge;

        if (lifeRatio < 0.1) {
          cell.opacity = lifeRatio / 0.1;
          cell.size = cell.targetSize * (lifeRatio / 0.1);
        } else if (lifeRatio < 0.4) {
          cell.opacity = 0.85;
          cell.size = cell.targetSize * (0.8 + 0.2 * Math.sin(t + i));
        } else if (lifeRatio < 0.7) {
          if (!cell.dividing) {
            cell.dividing = true;
            cell.divisionTimer = 0;
          }
          cell.divisionTimer += dt;
          const pulse = Math.sin(cell.divisionTimer * 3) * 0.5 + 0.5;
          cell.size = cell.targetSize * (1 + pulse * 0.3);
        } else {
          cell.opacity = (1 - lifeRatio) / 0.3;
        }

        if (cell.divisionTimer > 1.5 && cell.dividing) {
          cell.dividing = false;
          cell.divisionTimer = 0;
          if (cells.length < CELL_COUNT + 10) {
            const newCell = createCell(palette);
            newCell.x = cell.x + (Math.random() - 0.5) * 0.5;
            newCell.y = cell.y + (Math.random() - 0.5) * 0.5;
            cells.push(newCell);
          }
        }

        if (lifeRatio >= 1) {
          const newCell = createCell(palette);
          newCell.x = cell.x;
          newCell.y = cell.y;
          cells[i] = newCell;
          continue;
        }

        posArr[i * 3] = cell.x;
        posArr[i * 3 + 1] = cell.y;
        sizeArr[i] = cell.size;
        opArr[i] = cell.opacity;
        colArr[i * 3] = cell.color.r;
        colArr[i * 3 + 1] = cell.color.g;
        colArr[i * 3 + 2] = cell.color.b;
      }

      posAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;
      opacityAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;

      for (let i = 0; i < halos.length; i++) {
        const h = halos[i];
        h.position.x += Math.sin(t * 0.1 + i) * 0.002;
        h.position.y += Math.cos(t * 0.12 + i) * 0.002;
        (h.material as THREE.MeshBasicMaterial).opacity =
          0.08 + Math.sin(t * 0.5 + i) * 0.04;
      }

      if (mouse.active) {
        const targetRotY = mouse.x * 0.1;
        const targetRotX = -mouse.y * 0.08;
        points.rotation.y += (targetRotY - points.rotation.y) * 0.03;
        points.rotation.x += (targetRotX - points.rotation.x) * 0.03;
        ambientPoints.rotation.y = points.rotation.y;
        ambientPoints.rotation.x = points.rotation.x;
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
      ambientGeo.dispose();
      ambientMat.dispose();
      glowGeo.dispose();
      glowTex.dispose();
      halos.forEach((h) => (h.material as THREE.MeshBasicMaterial).dispose());
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

function makeGlowTexture(): THREE.CanvasTexture {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const cx = c.getContext("2d")!;
  const g = cx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0, "rgba(255,255,255,0.7)");
  g.addColorStop(0.3, "rgba(255,255,255,0.2)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  cx.fillStyle = g;
  cx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

function drawStaticScene(container: HTMLDivElement | null) {
  if (!container) return;
  // fallback: gradient CSS only
  container.style.background =
    "linear-gradient(135deg, #0a1f1a 0%, #0a1419 50%, #14110a 100%)";
}
