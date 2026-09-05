import React, { useEffect, useRef } from 'react';

const FLIP_MS = 1050;
const pauseMs = () => 350 + Math.random() * 700;

// A single instanced grid: white front/back faces and four black edge faces.
export default function HeroTileScene() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const stage = host.parentElement;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let teardown = () => {};

    import('three').then(THREE => {
      if (disposed) return;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      } catch {
        return; // Keep the existing CSS grid when WebGL is unavailable.
      }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      host.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(0, 1, 0, -1, 0.1, 2000);
      camera.position.z = 1000;
      const face = new THREE.MeshBasicMaterial({ color: '#f7f8f9' });
      const edge = new THREE.MeshBasicMaterial({ color: '#171719' });
      const transform = new THREE.Object3D();
      let tiles, geometry, cells = [], active = null, lastIndex = -1;
      let frame = 0, timer = 0, visible = false;
      const render = () => renderer.render(scene, camera);
      const setTile = (index, angle = 0, axis = 'y') => {
        const cell = cells[index];
        transform.position.set(cell.x, -cell.y, 0);
        transform.rotation.set(0, 0, 0);
        transform.rotation[axis] = angle;
        transform.updateMatrix();
        tiles.setMatrixAt(index, transform.matrix);
        tiles.instanceMatrix.needsUpdate = true;
      };
      const canAnimate = () => visible && !document.hidden && !motion.matches;
      const stop = () => {
        cancelAnimationFrame(frame);
        clearTimeout(timer);
        frame = timer = 0;
        if (active) {
          setTile(active.index);
          active = null;
          render();
        }
      };
      const schedule = () => {
        if (canAnimate() && !timer && !frame) timer = window.setTimeout(startFlip, pauseMs());
      };
      const animate = now => {
        const progress = Math.min(1, (now - active.start) / FLIP_MS);
        const eased = (1 - Math.cos(Math.PI * progress)) / 2;
        setTile(active.index, active.direction * Math.PI * eased, active.axis);
        render();
        if (progress < 1) frame = requestAnimationFrame(animate);
        else {
          // Both broad faces are identical; reset to avoid accumulating angles.
          setTile(active.index);
          render();
          active = null;
          frame = 0;
          schedule();
        }
      };
      function startFlip() {
        timer = 0;
        if (!canAnimate() || !cells.length) return;
        // Avoid the central copy and select a fully visible square.
        const copy = stage.querySelector('.hero-nomu-core').getBoundingClientRect();
        const bounds = stage.getBoundingClientRect();
        const candidates = cells.flatMap((cell, index) => {
          const outsideCopy = cell.x + 24 < copy.left - bounds.left || cell.x - 24 > copy.right - bounds.left || cell.y + 24 < copy.top - bounds.top || cell.y - 24 > copy.bottom - bounds.top;
          return index !== lastIndex && outsideCopy && cell.x > 24 && cell.x < bounds.width - 24 && cell.y > 90 && cell.y < bounds.height - 90 ? [index] : [];
        });
        if (!candidates.length) { schedule(); return; }
        const index = candidates[Math.floor(Math.random() * candidates.length)];
        lastIndex = index;
        active = { index, start: performance.now(), axis: Math.random() < 0.5 ? 'x' : 'y', direction: Math.random() < 0.5 ? -1 : 1 };
        frame = requestAnimationFrame(animate);
      }
      const resize = () => {
        stop();
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        const grid = window.innerWidth <= 680 ? 32 : 40;
        renderer.setSize(width, height, false);
        camera.right = width;
        camera.bottom = -height;
        camera.updateProjectionMatrix();
        if (tiles) { scene.remove(tiles); tiles.dispose(); geometry.dispose(); }
        cells = [];
        const columns = Math.ceil(width / grid / 2);
        const rows = Math.ceil(height / grid / 2);
        for (let row = -rows; row <= rows; row++) {
          for (let col = -columns; col <= columns; col++) {
            cells.push({ x: width / 2 + col * grid, y: height / 2 + row * grid });
          }
        }
        geometry = new THREE.BoxGeometry(grid - 1, grid - 1, 3);
        tiles = new THREE.InstancedMesh(geometry, [edge, edge, edge, edge, face, face], cells.length);
        tiles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        tiles.frustumCulled = false;
        cells.forEach((_, index) => setTile(index));
        scene.add(tiles);
        render();
        stage.classList.add('has-tile-scene');
        schedule();
      };
      const sync = () => { stop(); schedule(); };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
      observer.observe(stage);
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      document.addEventListener('visibilitychange', sync);
      motion.addEventListener('change', sync);
      const contextLost = event => { event.preventDefault(); stop(); stage.classList.remove('has-tile-scene'); };
      renderer.domElement.addEventListener('webglcontextlost', contextLost);
      renderer.domElement.addEventListener('webglcontextrestored', resize);
      resize();
      teardown = () => {
        stop();
        observer.disconnect();
        resizeObserver.disconnect();
        document.removeEventListener('visibilitychange', sync);
        motion.removeEventListener('change', sync);
        renderer.domElement.removeEventListener('webglcontextlost', contextLost);
        renderer.domElement.removeEventListener('webglcontextrestored', resize);
        stage.classList.remove('has-tile-scene');
        geometry?.dispose();
        tiles?.dispose();
        face.dispose();
        edge.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }).catch(() => { /* The CSS grid remains visible if the chunk fails to load. */ });

    return () => { disposed = true; teardown(); };
  }, []);

  return <div ref={hostRef} className="hero-tile-scene" aria-hidden="true" />;
}
