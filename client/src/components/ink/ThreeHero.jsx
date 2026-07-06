// src/components/ink/ThreeHero.jsx - wireframe-inked floating primitives
// Flat MeshBasicMaterial fills + EdgesGeometry outlines, mouse parallax.
import { useEffect, useRef } from "react";
import * as THREE from "three";

const INK = 0xf2efe6;
const PAPER = 0x1c1b17;
const RED = 0xe63946;

const ThreeHero = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 100);
    camera.position.z = 16;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const geos = [
      new THREE.BoxGeometry(1.7, 1.7, 1.7),
      new THREE.IcosahedronGeometry(1.2, 0),
      new THREE.TorusGeometry(1, 0.34, 8, 18),
      new THREE.ConeGeometry(1, 1.9, 6),
      new THREE.OctahedronGeometry(1.3, 0),
    ];

    const items = [];
    for (let i = 0; i < 20; i++) {
      const geo = geos[i % geos.length];
      const red = i % 6 === 0;
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: red ? RED : PAPER })
      );
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: INK, linewidth: 2 })
      );
      mesh.add(edges);
      mesh.position.set(
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8 - 2
      );
      // keep the left text column clear
      if (mesh.position.x > -8 && mesh.position.x < 2) mesh.position.x += 12;
      mesh.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      const s = 0.55 + Math.random() * 0.75;
      mesh.scale.set(s, s, s);
      group.add(mesh);
      items.push({
        mesh,
        dx: (Math.random() - 0.5) * 0.012,
        dy: (Math.random() - 0.5) * 0.012,
        fy: 0.4 + Math.random() * 0.8,
        ph: Math.random() * 6.28,
        y0: mesh.position.y,
      });
    }

    let mx = 0;
    let my = 0;
    const onMouseMove = (e) => {
      const r = el.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };
    // listen on the hero section (el has pointer-events none siblings above)
    const hero = el.parentElement || el;
    hero.addEventListener("mousemove", onMouseMove);

    let w = 0;
    let h = 0;
    let t = 0;
    let frameId;
    const tick = () => {
      if (!el.isConnected) return;
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (cw !== w || ch !== h) {
        w = cw;
        h = ch;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      t += 0.016;
      for (const it of items) {
        it.mesh.rotation.x += it.dx;
        it.mesh.rotation.y += it.dy;
        it.mesh.position.y = it.y0 + Math.sin(t * it.fy + it.ph) * 0.5;
      }
      group.rotation.y += (mx * 0.3 - group.rotation.y) * 0.05;
      group.rotation.x += (my * 0.18 - group.rotation.x) * 0.05;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      hero.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      geos.forEach((geo) => geo.dispose());
      if (renderer.domElement.parentElement === el) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
};

export default ThreeHero;
