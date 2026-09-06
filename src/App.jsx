import HeroGalaxy from './HeroGalaxy';
import React, { useEffect, useId, useRef, useState } from "react";
import Matter from "matter-js";
import ClientCases from "./ClientCases";
import BlockVariants from "./BlockVariants";
import FooterVariants from "./FooterVariants";
import ContactMessage from "./ContactMessage";
import OrangeMaterial from "./OrangeMaterial";
import ResearchAlternative from "./ResearchAlternatives";
import "./lower-sections.css";
import "./page-finale.css";
import igorPortrait from "../../src/assets/igor-nikitin-founder.jpg";
import wmtLogoFull from "../../src/assets/wmt-logo-full.png";

const steps = [
  ["Общие цели руководства", "и команды. Единый подход", "и правила трансформации."],
  ["Инициативы с наибольшей", "пользой для бизнеса.", "Выбираем, с чего начать."],
  ["Готовность данных и экономика.", "Отсеиваем неокупаемые идеи", "до крупных вложений."],
  ["Пилоты в реальных процессах.", "От первых результатов", "к ежедневному использованию."],
  ["Успешный опыт — в другие", "процессы и команды.", "Больше эффекта для бизнеса."],
];
const stepTitles = ["Подготовка", "Приоритеты", "Проверка", "Внедрение", "Масштабирование"];

const stepDigitPixels = [
  ["111", "101", "101", "101", "111"],
  ["010", "110", "010", "010", "111"],
  ["111", "001", "111", "100", "111"],
  ["111", "001", "111", "001", "111"],
  ["101", "101", "111", "001", "001"],
  ["111", "100", "111", "001", "111"],
];

function SoftPixelNumber({ number, arrow = false, compact = false, textured = false }) {
  const filterId = `soft-step-${useId()}`;
  const pixels = arrow ? ["111", "011", "101"] : stepDigitPixels[number];
  return <svg className={compact ? "direction-arrow" : "method-number"} viewBox={compact ? "4 4 28 28" : "4 4 28 44"} preserveAspectRatio="xMidYMin meet" role={arrow ? undefined : "img"} aria-hidden={arrow || undefined} aria-label={arrow ? undefined : `Этап ${number}`}>
    <defs>
      <filter id={filterId} x="-15%" y="-20%" width="130%" height="140%" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="1.3" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8.5" />
      </filter>
      {textured && <mask id={`${filterId}-mask`} maskUnits="userSpaceOnUse" x="4" y="4" width="28" height="44" style={{maskType:'alpha'}}>
        <g fill="white" filter={`url(#${filterId})`}>{pixels.flatMap((row, y) => [...row].map((pixel, x) => pixel === '1' ? <rect key={`${x}-${y}`} x={6 + x * 8} y={6 + y * 8} width="8.2" height="8.2" /> : null))}</g>
      </mask>}
    </defs>
    {textured && <g className="number-layer-shadow"><g mask={`url(#${filterId}-mask)`}><rect x="4" y="4" width="28" height="44" fill="#f2f2f2" /></g></g>}
    {textured && <g className="number-layer-middle" mask={`url(#${filterId}-mask)`}><rect x="4" y="4" width="28" height="44" fill="#171719" /></g>}
    {textured && <g className="number-texture" mask={`url(#${filterId}-mask)`}><foreignObject x="4" y="4" width="28" height="44"><div xmlns="http://www.w3.org/1999/xhtml" className="number-texture__fill" /></foreignObject></g>}
    {(compact && arrow ? [0, 1] : [0]).map(copy => <g key={copy} className={copy ? 'pixel-arrow-copy' : 'pixel-arrow-primary'}><g fill="currentColor" filter={`url(#${filterId})`}>
      {pixels.flatMap((row, y) =>
        [...row].map((pixel, x) => pixel === "1" ? <rect key={`${x}-${y}`} x={6 + x * 8} y={6 + y * 8} width="8.2" height="8.2" /> : null)
      )}
    </g></g>)}
  </svg>;
}

const situations = [
  "С ИИ надо что-то делать, но непонятно, с чего начать",
  "Инициатив много, а что даст эффект — неясно",
  "Команда, процессы или данные не готовы",
  "Нужен конкретный результат, а не презентации",
];

const directions = [
  ["Подготовка и корпоративное обучение", "Стратегические сессии, интенсивы, обучение команд, аудит текущей ситуации и формирование базы инициатив."],
  ["Готовые решения и продукты", "Нейроключ — корпоративная среда для работы с ИИ. Релевантер — AI-ассистент для автоматизации найма."],
  ["Заказная разработка и интеграция", "Разрабатываем и внедряем ИИ-решения под конкретные процессы и инфраструктуру клиента."],
  ["Усиление команды клиента", "Подключаем специалистов WMT для развития и поддержки ИИ-инфраструктуры клиента."],
];

const researches = [
  ["Точка схождения 2027", "Как меняется бизнес, когда ИИ перестаёт быть отдельным инструментом."],
  ["Тихая замена", "Исследование незаметного перераспределения функций между людьми и ИИ."],
  ["ИИ в 2025 и прогнозы на 2026", "Главные изменения рынка без шума и технологического фольклора."],
];

const heroTags = [
  "Стратегия",
  "Корпоративное обучение",
  "Аудит процессов",
  "ИИ-пилоты",
  "Готовые продукты",
  "Заказная разработка",
  "Интеграция",
  "Масштабирование",
];

function PhysicsTags() {
  const containerRef = useRef(null);
  const chipRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      container.classList.add("is-static");
      return undefined;
    }

    const { Engine, Runner, Bodies, Body, Composite, Events, Mouse, MouseConstraint } = Matter;
    const engine = Engine.create({ gravity: { x: 0, y: 1.05 } });
    const runner = Runner.create();
    const chips = chipRefs.current.filter(Boolean);
    let walls = [];

    const bounds = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const thickness = 80;
      if (walls.length) Composite.remove(engine.world, walls);
      walls = [
        Bodies.rectangle(width / 2, height + thickness / 2, width + thickness * 2, thickness, { isStatic: true }),
        Bodies.rectangle(-thickness / 2, height / 2, thickness, height + 240, { isStatic: true }),
        Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + 240, { isStatic: true }),
        Bodies.rectangle(width / 2, -110, width + thickness * 2, thickness, { isStatic: true }),
      ];
      Composite.add(engine.world, walls);
      return { width, height };
    };

    const { width } = bounds();
    const columns = width < 720 ? 3 : 5;
    const bodyEntries = chips.map((chip, index) => {
      const chipWidth = chip.offsetWidth;
      const chipHeight = chip.offsetHeight;
      const column = index % columns;
      const row = Math.floor(index / columns);
      const lane = width / columns;
      const x = Math.max(chipWidth / 2 + 5, Math.min(width - chipWidth / 2 - 5, lane * (column + 0.5)));
      const y = -30 - row * 68 - (index % 2) * 12;
      const body = Bodies.rectangle(x, y, chipWidth, chipHeight, {
        chamfer: { radius: chipHeight / 2 },
        restitution: 0.32,
        friction: 0.42,
        frictionAir: 0.008,
        density: 0.0018,
        angle: ((index % 5) - 2) * 0.045,
      });
      chip.style.opacity = "1";
      return { chip, body, width: chipWidth, height: chipHeight };
    });

    Composite.add(engine.world, bodyEntries.map(({ body }) => body));

    const mouse = Mouse.create(container);
    // Matter uses the wheel only for canvas zoom and prevents the browser's
    // default scroll. This scene has no zoom, so keep page scrolling native.
    container.removeEventListener("wheel", mouse.mousewheel);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, damping: 0.16, render: { visible: false } },
    });
    Composite.add(engine.world, mouseConstraint);

    const syncDom = () => {
      bodyEntries.forEach(({ chip, body, width: chipWidth, height: chipHeight }) => {
        chip.style.transform = `translate3d(${body.position.x - chipWidth / 2}px, ${body.position.y - chipHeight / 2}px, 0) rotate(${body.angle}rad)`;
      });
    };
    const startDrag = () => container.classList.add("is-dragging");
    const endDrag = () => container.classList.remove("is-dragging");
    Events.on(engine, "afterUpdate", syncDom);
    Events.on(mouseConstraint, "startdrag", startDrag);
    Events.on(mouseConstraint, "enddrag", endDrag);
    Runner.run(runner, engine);

    const resizeObserver = new ResizeObserver(() => {
      const { width: nextWidth, height: nextHeight } = bounds();
      bodyEntries.forEach(({ body, width: chipWidth, height: chipHeight }) => {
        Body.setPosition(body, {
          x: Math.max(chipWidth / 2, Math.min(nextWidth - chipWidth / 2, body.position.x)),
          y: Math.max(-60, Math.min(nextHeight - chipHeight / 2, body.position.y)),
        });
      });
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      Events.off(engine, "afterUpdate", syncDom);
      Events.off(mouseConstraint, "startdrag", startDrag);
      Events.off(mouseConstraint, "enddrag", endDrag);
      Runner.stop(runner);
      Mouse.clearSourceEvents(mouse);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-nomu-tags" aria-label="Направления работы WMT AI">
      {heroTags.map((tag, index) => (
        <span ref={(node) => { chipRefs.current[index] = node; }} key={tag}><b>{tag}</b></span>
      ))}
    </div>
  );
}

function FlowMap({ compact = false }) {
  return (
    <svg className={`flow-map ${compact ? "flow-map--compact" : ""}`} viewBox="0 0 760 520" role="img" aria-label="Поток от бизнес-задач к измеримому результату">
      <defs>
        <filter id="soft"><feGaussianBlur stdDeviation="12" /></filter>
        <linearGradient id="warm" x1="0" x2="1"><stop stopColor="#ff5331"/><stop offset="1" stopColor="#ff9d7f"/></linearGradient>
      </defs>
      <circle className="flow-halo" cx="380" cy="260" r="128" />
      <path className="flow-orbit orbit-a" d="M78 132C205 14 562 22 680 168S610 465 390 470 38 344 78 132Z" />
      <path className="flow-orbit orbit-b" d="M120 400C34 262 180 84 362 88s346 126 298 286-365 153-540 26Z" />
      <path className="flow-live" pathLength="1" d="M80 346C196 452 301 382 358 270s150-158 310-90" />
      <g className="flow-core">
        <rect x="276" y="182" width="208" height="156" rx="44" />
        <path d="M330 274l36-36 34 34 31-31" />
        <circle cx="330" cy="274" r="8"/><circle cx="366" cy="238" r="8"/><circle cx="400" cy="272" r="8"/><circle cx="431" cy="241" r="8"/>
      </g>
      <g className="flow-node node-a"><rect x="30" y="105" width="152" height="58" rx="20"/><text x="106" y="140">ПРОЦЕССЫ</text></g>
      <g className="flow-node node-b"><rect x="553" y="106" width="165" height="58" rx="20"/><text x="635" y="140">ДАННЫЕ</text></g>
      <g className="flow-node node-c"><rect x="42" y="386" width="166" height="58" rx="20"/><text x="125" y="421">КОМАНДА</text></g>
      <g className="flow-node node-d"><rect x="548" y="380" width="176" height="58" rx="20"/><text x="636" y="415">ЭФФЕКТ</text></g>
      <circle className="packet packet-a" r="7"><animateMotion dur="6s" repeatCount="indefinite" path="M80 346C196 452 301 382 358 270s150-158 310-90"/></circle>
      <circle className="packet packet-b" r="5"><animateMotion dur="6s" begin="-3s" repeatCount="indefinite" path="M80 346C196 452 301 382 358 270s150-158 310-90"/></circle>
    </svg>
  );
}

function BlockSystem() {
  const blocks = [
    [0,0,2,1,"hot"],[2,0,1,2,"ink"],[3,0,2,1,"soft"],[5,0,1,1,"hot"],
    [0,1,1,2,"ink"],[1,1,1,1,"paper"],[3,1,2,1,"hot"],[5,1,1,2,"ink"],
    [1,2,2,1,"hot"],[3,2,1,1,"paper"],[4,2,1,1,"ink"],
  ];
  return <svg className="block-system" viewBox="0 0 900 450" role="img" aria-label="Модульная схема ИИ-трансформации">
    <rect className="block-bg" width="900" height="450" />
    {blocks.map(([x,y,w,h,t],i)=><rect key={i} className={`system-block system-block--${t} system-block--${i}`} x={x*150} y={y*150} width={w*150} height={h*150}/>) }
    <path className="system-route" d="M75 375H225V225H375V75H525V225H675V375H825" />
    <g className="system-signal"><rect x="354" y="54" width="42" height="42" rx="7"/><path d="M366 75h18M375 66v18"/></g>
    <text x="28" y="34">от задачи</text><text x="760" y="422">к эффекту</text>
  </svg>;
}

function useSectionProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight - r.top) / (r.height + innerHeight * .25)));
      el.style.setProperty("--progress", p);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return ref;
}

function useHeroProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      frame = 0;
      const enabled = innerWidth > 1000 && !reduce.matches;
      if (!enabled) {
        el.style.setProperty("--hero-p", "0");
        el.style.setProperty("--hero-main", "64%");
        el.style.setProperty("--hero-side", "36%");
        el.style.setProperty("--hero-copy-top", "44%");
        el.style.setProperty("--hero-copy-bottom", "0%");
        el.style.setProperty("--hero-copy-width", "320px");
        el.style.setProperty("--hero-copy-center", "50%");
        el.style.setProperty("--hero-copy-opacity", "1");
        el.style.setProperty("--hero-title-opacity", "1");
        el.style.setProperty("--hero-cue-opacity", "1");
        el.style.setProperty("--hero-proof", "0");
        return;
      }
      const rect = el.getBoundingClientRect();
      const distance = Math.max(1, el.offsetHeight - innerHeight);
      const p = Math.max(0, Math.min(1, -rect.top / distance));
      const eased = p * p * (3 - 2 * p);
      const proof = Math.max(0, Math.min(1, (p - .72) / .2));
      const copyTop = innerHeight * .44 + (76 - innerHeight * .44) * eased;
      el.style.setProperty("--hero-p", p.toFixed(4));
      el.style.setProperty("--hero-main", `${64 - eased * 64}%`);
      el.style.setProperty("--hero-side", `${36 + eased * 64}%`);
      el.style.setProperty("--hero-copy-top", `${copyTop}px`);
      el.style.setProperty("--hero-copy-bottom", "0%");
      el.style.setProperty("--hero-copy-width", `${320 + eased * 440}px`);
      el.style.setProperty("--hero-copy-center", "50%");
      el.style.setProperty("--hero-copy-opacity", "1");
      el.style.setProperty("--hero-title-opacity", "1");
      el.style.setProperty("--hero-cue-opacity", "1");
      el.style.setProperty("--hero-proof", proof.toFixed(4));
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", requestUpdate, { passive: true });
    addEventListener("resize", requestUpdate, { passive: true });
    reduce.addEventListener("change", requestUpdate);
    return () => {
      removeEventListener("scroll", requestUpdate);
      removeEventListener("resize", requestUpdate);
      reduce.removeEventListener("change", requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return ref;
}

function useNomuScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const section = ref.current;
    const stage = section?.querySelector(".hero-nomu-stage");
    if (!section || !stage) return undefined;
    const brand = document.querySelector(".header > .brand");

    let frame = 0;
    let textureKey = "";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const percent = (value) => `${Number(value.toFixed(4))}%`;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / distance));
      const mobile = window.innerWidth <= 680;
      const grid = mobile ? 32 : 40;
      const shapeColumns = mobile ? 15 : 27;
      const shapeRows = mobile ? 11 : 13;
      let targetColumns = Math.ceil((window.innerWidth + grid * 2) / grid);
      if (targetColumns % 2 === 0) targetColumns += 1;
      targetColumns = Math.max(shapeColumns + 4, targetColumns);
      let targetRows = Math.ceil((window.innerHeight + grid * 2) / grid);
      if (targetRows % 2 === 0) targetRows += 1;
      targetRows = Math.max(shapeRows + 4, targetRows);
      const nextTextureKey = `${grid}:${targetColumns}:${targetRows}`;
      if (nextTextureKey !== textureKey) {
        textureKey = nextTextureKey;
        const textureWidth = targetColumns * grid;
        const textureHeight = targetRows * grid;
        const cells = [];
        const shades = ['transparent','rgba(0,0,0,.025)','rgba(255,255,255,.035)','rgba(0,0,0,.018)','rgba(255,255,255,.025)','rgba(0,0,0,.012)','rgba(0,0,0,.04)','rgba(255,255,255,.05)'];
        for (let row = 0; row < targetRows; row += 1) {
          for (let column = 0; column < targetColumns; column += 1) {
            let hash = Math.imul(column + 11, 0x45d9f3b) ^ Math.imul(row + 17, 0x27d4eb2d);
            hash = Math.imul(hash ^ (hash >>> 16), 0x7feb352d);
            hash = Math.imul(hash ^ (hash >>> 15), 0x846ca68b);
            hash ^= hash >>> 16;
            const fill = shades[(hash >>> 24) % shades.length];
            cells.push(`<rect x="${column * grid}" y="${row * grid}" width="${grid}" height="${grid}" fill="${fill}"/>`);
          }
        }
        const texture = `<svg xmlns="http://www.w3.org/2000/svg" width="${textureWidth}" height="${textureHeight}" viewBox="0 0 ${textureWidth} ${textureHeight}" shape-rendering="crispEdges">${cells.join("")}</svg>`;
        stage.style.setProperty("--cloud-texture", `url("data:image/svg+xml,${encodeURIComponent(texture)}")`);
        stage.style.setProperty("--cloud-texture-width", `${textureWidth}px`);
        stage.style.setProperty("--cloud-texture-height", `${textureHeight}px`);
      }
      const motionProgress = reducedMotion.matches ? 0 : Math.min(1, progress / .96);
      // Earth-photo preview: keep the central pill dark throughout the reveal.
      const stageRect = stage.getBoundingClientRect();
      const pillRect = stage.querySelector(".hero-nomu-core h1 strong")?.getBoundingClientRect();
      const textureWidth = targetColumns * grid;
      const textureHeight = targetRows * grid;
      const textureLeft = (stage.clientWidth - textureWidth) / 2;
      const textureTop = (stage.clientHeight - textureHeight) / 2;
      const pillLeft = (pillRect?.left ?? stageRect.left + stage.clientWidth / 2) - stageRect.left;
      const pillRight = (pillRect?.right ?? stageRect.left + stage.clientWidth / 2) - stageRect.left;
      const pillTop = (pillRect?.top ?? stageRect.top + stage.clientHeight / 2) - stageRect.top;
      const pillBottom = (pillRect?.bottom ?? stageRect.top + stage.clientHeight / 2) - stageRect.top;
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      const expandRange = (start, end, minimum, limit) => {
        let nextStart = start;
        let nextEnd = end;
        const missing = Math.max(0, minimum - (nextEnd - nextStart));
        nextStart -= Math.floor(missing / 2);
        nextEnd += Math.ceil(missing / 2);
        if (nextStart < 0) {
          nextEnd -= nextStart;
          nextStart = 0;
        }
        if (nextEnd > limit) {
          nextStart -= nextEnd - limit;
          nextEnd = limit;
        }
        return [clamp(nextStart, 0, limit), clamp(nextEnd, 0, limit)];
      };
      let startLeft = Math.floor((pillLeft - textureLeft) / grid);
      let startRight = Math.ceil((pillRight - textureLeft) / grid);
      let startTop = Math.floor((pillTop - textureTop) / grid);
      let startBottom = Math.ceil((pillBottom - textureTop) / grid);
      [startLeft, startRight] = expandRange(startLeft, startRight, 1, targetColumns);
      [startTop, startBottom] = expandRange(startTop, startBottom, 1, targetRows);
      const leftIndex = Math.round(startLeft * (1 - motionProgress));
      const rightIndex = targetColumns - Math.round((targetColumns - startRight) * (1 - motionProgress));
      const topIndex = Math.round(startTop * (1 - motionProgress));
      const bottomIndex = targetRows - Math.round((targetRows - startBottom) * (1 - motionProgress));
      const columns = rightIndex - leftIndex;
      const rows = bottomIndex - topIndex;
      const roundness = 1 - motionProgress;
      const x = (cell) => percent((cell / columns) * 100);
      const y = (row) => percent((row / rows) * 100);
      const radius = rows >= 3 && motionProgress < .6 ? 1 : 0;
      const rowInsets = Array.from({ length: rows }, (_, row) =>
        Math.max(0, radius - Math.min(row, rows - 1 - row))
      );
      const points = [[rowInsets[0], 0], [columns - rowInsets[0], 0]];
      for (let row = 0; row < rows; row += 1) {
        const currentRight = columns - rowInsets[row];
        points.push([currentRight, row + 1]);
        if (row < rows - 1) points.push([columns - rowInsets[row + 1], row + 1]);
      }
      points.push([rowInsets[rows - 1], rows]);
      for (let row = rows - 1; row >= 0; row -= 1) {
        points.push([rowInsets[row], row]);
        if (row > 0) points.push([rowInsets[row - 1], row]);
      }
      const clip = points.map(([cell, row]) => `${x(cell)} ${y(row)}`).join(",");
      const cloudWidth = columns * grid;
      const cloudHeight = rows * grid;
      const cloudLeft = textureLeft + leftIndex * grid;
      const cloudTop = textureTop + topIndex * grid;
      const cloudCenterX = cloudLeft + cloudWidth / 2;
      const cloudCenterY = cloudTop + cloudHeight / 2;

      // Switch between two solid logo colors using the same geometry as the hero.
      if (brand) {
        const logoRect = brand.getBoundingClientRect();
        const logoX = logoRect.left + logoRect.width / 2 - stageRect.left;
        const logoY = logoRect.top + logoRect.height / 2 - stageRect.top;
        const row = Math.floor((logoY - cloudTop) / grid);
        const inset = (rowInsets[row] ?? 0) * grid;
        const onOrange = progress > 0 && logoY >= 0 && logoY < stageRect.height &&
          row >= 0 && row < rows && logoX >= cloudLeft + inset &&
          logoX < cloudLeft + cloudWidth - inset;
        brand.classList.toggle("is-on-orange", onOrange);
      }

      stage.querySelectorAll('.hero-nomu-core h1 > span, .hero-nomu-core > p').forEach(text => {
        const bounds = text.getBoundingClientRect();
        const left = bounds.left - stageRect.left;
        const right = bounds.right - stageRect.left;
        const topRow = Math.floor((bounds.top - stageRect.top - cloudTop) / grid);
        const bottomRow = Math.floor((bounds.bottom - stageRect.top - cloudTop) / grid);
        let covered = progress > 0 && topRow >= 0 && bottomRow < rows;
        for (let row = topRow; covered && row <= bottomRow; row += 1) {
          const inset = rowInsets[row] * grid;
          covered = left >= cloudLeft + inset && right <= cloudLeft + cloudWidth - inset;
        }
        text.classList.toggle('is-on-gradient', covered);
      });

      stage.style.setProperty("--cloud-width", `${cloudWidth}px`);
      stage.style.setProperty("--cloud-height", `${cloudHeight}px`);
      stage.style.setProperty("--cloud-shift-x", `${cloudCenterX - stage.clientWidth / 2}px`);
      stage.style.setProperty("--cloud-shift-y", `${cloudCenterY - stage.clientHeight / 2}px`);
      stage.style.setProperty("--cloud-texture-x", `${-leftIndex * grid}px`);
      stage.style.setProperty("--cloud-texture-y", `${-topIndex * grid}px`);
      stage.style.setProperty("--cloud-opacity", progress === 0 ? "0" : "1");
      stage.style.setProperty("--cloud-clip", `polygon(${clip})`);
      stage.style.setProperty("--cloud-progress", progress.toFixed(4));
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    reducedMotion.addEventListener("change", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const [filled, setFilled] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const header = headerRef.current;
        if (!header) return;
        const x = document.documentElement.clientWidth / 2;
        const y = header.getBoundingClientRect().bottom + 1;
        const surfaces = document.querySelectorAll('.about-statement, .plus-divider--dark, .why, .directions, .client-cases, .event, .footer, .method-journey__card--contact');
        setDark([...surfaces].some(surface => {
          const rect = surface.getBoundingClientRect();
          if (surface.matches('.client-cases')) {
            const slider = surface.querySelector('.case-slider');
            if (!slider) return false;
            // At the viewport centre the outer card arc starts 16px above
            // the slider's padding. Keep the dark theme until it reaches the header.
            const sliderRect = slider.getBoundingClientRect();
            const scale = slider.offsetHeight ? sliderRect.height / slider.offsetHeight : 1;
            const arcTop = sliderRect.top +
              ((parseFloat(getComputedStyle(slider).paddingTop) || 0) - 16) * scale;
            const headerTop = header.getBoundingClientRect().top;
            return rect.left <= x && rect.right >= x && rect.top <= y && arcTop > headerTop;
          }
          if (!(rect.left <= x && rect.right >= x && rect.top <= y && rect.bottom > y)) return false;
          // Respect clipping of the sliding contact card inside its stage.
          const stage = surface.closest('.method-journey__stage');
          if (stage) {
            const clip = stage.getBoundingClientRect();
            return y >= clip.top && y < clip.bottom;
          }
          return true;
        }));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  useEffect(() => {
    const method = document.querySelector('#method');
    let active = false;
    let fillTimer = null;
    const cancelFill = () => {
      window.clearTimeout(fillTimer);
      fillTimer = null;
    };
    const fullyEntered = () => Boolean(method && headerRef.current &&
      method.getBoundingClientRect().top <= headerRef.current.getBoundingClientRect().top);
    const update = () => {
      if (fullyEntered()) {
        if (!active && fillTimer === null) {
          fillTimer = window.setTimeout(() => {
            fillTimer = null;
            if (fullyEntered()) {
              active = true;
              setFilled(true);
            }
          }, 100);
        }
      } else {
        cancelFill();
        // A small exit margin prevents toggling on subpixel scroll near the boundary.
        if (active && method && headerRef.current &&
            method.getBoundingClientRect().top > headerRef.current.getBoundingClientRect().top + 8) {
          active = false;
          setFilled(false);
        }
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelFill();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return <header ref={headerRef} className={`header${filled ? '' : ' header--hero'}${dark ? ' header--dark' : ''}`}>
    <a className="brand" href="#top" aria-label="WMT AI, на главную">
      <img src={wmtLogoFull} alt="WMT AI" />
    </a>
    <nav className={open ? "nav is-open" : "nav"} aria-label="Главная навигация">
      <a href="#method" onClick={() => setOpen(false)}>Как работаем</a>
      <a href="#directions" onClick={() => setOpen(false)}>Направления</a>
      <a href="#cases" onClick={() => setOpen(false)}>Кейсы</a>
      <a href="#research" onClick={() => setOpen(false)}>Исследования</a>
    </nav>
    <a className="button button--dark header-cta" href="#contact">Обсудить задачу</a>
    <button className="menu" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Открыть меню"><span/><span/></button>
  </header>;
}

const BUSINESS_MATERIALS = [
  { name: 'brick-reference', file: 'illustrated-brick.png' },
  { name: 'wood-reference', file: 'illustrated-wood.png' },
  { name: 'banknotes', file: 'illustrated-money.png' },
  { name: 'denim_fabric', file: 'illustrated-denim.png' },
  { name: 'brown_leather', file: 'illustrated-leather.png' },
];

function HeroCta() {
  const [frame, setFrame] = useState({ from: 0, to: null, serial: 0 });
  const [active, setActive] = useState(false);
  const [material, setMaterial] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(() => window.scrollY > 0);
  useEffect(() => {
    const updateScroll = () => setHasScrolled(window.scrollY > 0);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const restoreRef = useRef(null);
  const pendingRef = useRef(null);
  const advance = (target, direction = 'up') => setFrame(previous => {
    if (previous.to !== null) {
      pendingRef.current = { target, direction };
      return previous;
    }
    if (previous.from === target) return previous;
    return { from: previous.from, to: target, direction, serial: previous.serial + 1 };
  });

  useEffect(() => {
    if (active || frame.to !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => {
      if (frame.from === 2) setMaterial(previous => (previous + 1) % BUSINESS_MATERIALS.length);
      advance((frame.from + 1) % 3);
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [active, frame.from, frame.to]);

  const activate = () => {
    if (restoreRef.current !== null) return;
    restoreRef.current = frame.to ?? frame.from;
    setActive(true);
    advance(2, 'down');
  };
  const deactivate = () => {
    const restore = restoreRef.current;
    restoreRef.current = null;
    setActive(false);
    if (restore !== null) advance(restore);
  };
  const content = (index) => <span className="hero-rotator__content">
    <span>{index === 0 ? 'в вашем бизнесе' : index === 1 ? 'это wmt ai' : 'обсудим задачу'}</span>
    {index === 2 && <svg className="hero-nomu-chevrons" viewBox="0 0 60 56" aria-hidden="true">
      <polyline points="8 8 24 28 8 48" />
      <polyline points="36 8 52 28 36 48" />
    </svg>}
  </span>;

  return <>
    <span className={`hero-business${(frame.to ?? frame.from) === 0 ? ' is-active' : ''}${hasScrolled ? ' is-scrolled' : ''}`} aria-hidden="true">
      {BUSINESS_MATERIALS.map(({ name, file }, index) => <span key={name}
        className={`hero-business__material hero-business__material--${name}${material === index ? ' is-selected' : ''}`}
        style={{ backgroundImage: `url(/wmt-ai-preview/business-textures/${file})` }} />)}
    </span>
    <HeroGalaxy active={(frame.to ?? frame.from) === 1} /><a className="hero-nomu-cta hero-rotator" data-space={(frame.to ?? frame.from) === 1} href="#contact" aria-label="обсудим задачу"
    onMouseEnter={() => { hoverRef.current = true; activate(); }}
    onMouseLeave={() => { hoverRef.current = false; if (!focusRef.current) deactivate(); }}
    onFocus={() => { focusRef.current = true; activate(); }}
    onBlur={() => { focusRef.current = false; if (!hoverRef.current) deactivate(); }}
  >
    <span className="hero-rotator__sizer" aria-hidden="true">{content(0)}</span>
    <span className="hero-rotator__sizer" aria-hidden="true">{content(2)}</span>
    <span key={frame.serial} className={`hero-rotator__track${frame.to !== null ? ' is-moving' : ''}${frame.direction === 'down' ? ' is-down' : ''}`}
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        const pending = pendingRef.current;
        pendingRef.current = null;
        setFrame(previous => {
          if (previous.to === null) return previous;
          const current = previous.to;
          return pending !== null && pending.target !== current
            ? { from: current, to: pending.target, direction: pending.direction, serial: previous.serial + 1 }
            : { ...previous, from: current, to: null };
        });
      }}
    >
      <span className="hero-rotator__row">{content(frame.to !== null && frame.direction === 'down' ? frame.to : frame.from)}</span>
      {frame.to !== null && <span className="hero-rotator__row">{content(frame.direction === 'down' ? frame.from : frame.to)}</span>}
    </span>
  </a></>;
}

const journeySteps = [
  ["Обучаем руководство и команду", "Выстраиваем общее понимание, цели и правила трансформации и готовим команду к погружению в ИИ."],
  ["Собираем и выбираем инициативы", "Определяем то, что действительно важно для бизнеса и подлежит улучшению с помощью ИИ."],
  ["Проверяем реализуемость, данные и экономику", "Отсекаем то, что не окупится, с минимальными затратами."],
  ["Внедряем решения и запускаем пилоты", "Интегрируем пилоты ИИ-инструментов и выводим рабочие решения в процессы."],
  ["Масштабируем то, что показало эффект", "Приумножаем успешные кейсы, усиливаем результат в деньгах и открываем новые возможности."],
  ["Оставить заявку", "", "contact"],
];

function MethodJourney() {
  const ref = useRef(null);
  useEffect(() => {
    const section = ref.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const stage = section.querySelector('.method-journey__stage');
      const windowBox = section.querySelector('.method-journey__window');
      const trailingSpace = Math.max(0, stage.getBoundingClientRect().bottom - windowBox.getBoundingClientRect().bottom);
      section.style.setProperty('--journey-tail', reduced.matches ? '0px' : `${trailingSpace}px`);
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const distance = Math.max(1, section.offsetHeight - stage.offsetHeight);
      const sectionTop = section.getBoundingClientRect().top;
      // Finish the first entrance as the stage becomes fully visible.
      // The pinned scroll starts with card two, rather than card one.
      const entrance = Math.max(0, Math.min(1,
        (window.innerHeight - sectionTop) / Math.max(1, window.innerHeight - top)));
      const progress = Math.max(0, Math.min(1, (top - sectionTop) / distance));
      const position = sectionTop > top
        ? entrance - 1
        : progress * (journeySteps.length - 1);
      const strip = parseFloat(getComputedStyle(section).getPropertyValue('--journey-strip'));
      const contactStrip = parseFloat(getComputedStyle(section).getPropertyValue('--journey-contact-strip'));
      const current = Math.min(journeySteps.length - 1, Math.floor(position + 0.000001));
      section.querySelectorAll('.method-journey__card').forEach((card, index) => {
        const travel = Math.max(0, Math.min(1, position - index + 1));
        const parkedRight = stage.clientWidth - (journeySteps.length - 1 - index) * strip - contactStrip;
        const parkedLeft = index * strip;
        const x = parkedRight + (parkedLeft - parkedRight) * travel;
        card.style.transform = reduced.matches ? 'none' : `translateX(${x}px)`;
        card.classList.toggle('is-current', reduced.matches || index === current);
        card.classList.toggle('is-docked', reduced.matches || index <= current);
        card.classList.toggle('is-revealing', reduced.matches || travel > 0);
        const button = card.querySelector('.method-journey__step-button');
        if (index === current) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
    };
  }, []);
  const goToStep = (index) => {
    const section = ref.current;
    const stage = section.querySelector('.method-journey__stage');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.querySelectorAll('.method-journey__card')[index].scrollIntoView({ block: 'center', behavior: 'instant' });
      return;
    }
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    const distance = Math.max(1, section.offsetHeight - stage.offsetHeight);
    window.scrollTo({
      top: window.scrollY + section.getBoundingClientRect().top - top + distance * index / (journeySteps.length - 1) + 1,
      behavior: 'smooth',
    });
  };
  return <section ref={ref} className="method-journey" aria-label="Этапы ИИ-трансформации">
    <div className="method-journey__stage">
      <div className="method-journey__heading"><h2>ИИ-трансформация на практике</h2></div>
      <div className="method-journey__window">
        {journeySteps.map(([title, description, type], i) => <article className={`method-journey__card${type === 'contact' ? ' method-journey__card--contact' : ''}`} key={title} style={{ '--journey-index': i }}>
          <button className="method-journey__step-button" type="button" onClick={() => goToStep(i)} aria-label={type === 'contact' ? 'Перейти к заявке' : `Перейти к этапу ${i + 1}: ${title}`}>
            {type === 'contact' ? <SoftPixelNumber arrow /> : <SoftPixelNumber number={i + 1} />}
          </button>
          {type === 'contact' ? <a className="method-journey__contact-link" href="#contact"><span>{title}</span></a> : <div><h3>{title}</h3><p>{description}</p></div>}
        </article>)}
      </div>
    </div>
  </section>;
}

function DirectionMark({ type }) {
  return <svg className={`directions-mark directions-mark--${type}`} viewBox="0 0 160 112" fill="none" aria-hidden="true">
    {type === 'learn' && <>{[0,1,2].map(i => <rect key={i} x={22 + i * 22} y={38 - i * 12} width="68" height="60" rx="2" />)}<path d="M86 43h29M86 55h20" /></>}
    {type === 'build' && <><path d="M8 56h48V20h48v72h48M56 56h48" /><rect x="4" y="48" width="16" height="16" /><rect x="48" y="12" width="16" height="16" /><rect x="96" y="48" width="16" height="16" /><rect x="140" y="84" width="16" height="16" /></>}
    {type === 'team' && <>{[[36,24],[80,24],[36,68]].map(([x,y]) => <rect key={`${x}-${y}`} x={x} y={y} width="32" height="32" />)}<path d="M96 68v32M80 84h32" /></>}
    {type === 'kids' && <><path d="M16 92h32V60h32V28h32v64h32" /><rect x="12" y="20" width="22" height="22" /><path d="M54 16v20M44 26h20M104 58h1M126 58h1M106 72q10 12 20 0" /></>}
  </svg>;
}

function DirectionRow({ className, children }) {
  return <div className="direction-row"><article className={className}>{children}</article></div>;
}

function DirectionsShowcase() {
  return <section className="directions-showcase" id="directions">
    <header className="directions-showcase__heading">
      <h2><span>Основные направления</span></h2>
    </header>
    <div className="directions-mosaic">
      <PlusDivider className="directions-divider" />
      <DirectionRow className="direction-tile direction-tile--learn">
        <h3>Подготовка и корпоративное обучение</h3>
        <p>Стратегические сессии, интенсивы, обучение команд, аудит текущей ситуации и формирование базы инициатив.</p>
        <details><summary>Подробнее<SoftPixelNumber arrow compact /></summary><p>Помогает компании подготовиться к изменениям и создать внутреннюю мотивацию к реальному внедрению.</p></details>
      </DirectionRow>
      <PlusDivider className="directions-divider" />
      <DirectionRow className="direction-tile direction-tile--products">
        <div className="direction-tile__top"><span>02</span><span className="direction-tile__label">Продуктовая экосистема</span></div>
        <div className="product-copy-track"><div className="product-copy">
          <h3>Готовые решения и продукты</h3>
          <p>Собственная продуктовая экосистема WMT AI помогает быстрее запускать типовые инициативы.</p>
        </div></div>
        <div className="product-modules">
          <div className="product-module product-module--key">
            <img className="product-module__logo" src="/wmt-ai-preview/product-logos/neiroklyuch.svg" alt="" aria-hidden="true" />
            <SoftPixelNumber arrow compact />
            <h4>Нейроключ</h4><p>Корпоративная среда<br />для работы с ИИ.</p>
          </div>
          <div className="product-module product-module--hire">
            <img className="product-module__logo" src="/wmt-ai-preview/product-logos/relevanter.svg" alt="" aria-hidden="true" />
            <SoftPixelNumber arrow compact />
            <h4>Релевантер</h4><p>ИИ-ассистент<br />для автоматизации найма.</p>
          </div>
        </div>
      </DirectionRow>
      <PlusDivider className="directions-divider" />
      <DirectionRow className="direction-tile direction-tile--build">
        <h3>Заказная разработка и интеграция</h3>
        <p>Разрабатываем и внедряем ИИ-решения под конкретные процессы и инфраструктуру клиента.</p>
        <details><summary>Подробнее<SoftPixelNumber arrow compact /></summary><p>От точечных инструментов до более сложных систем, интеграций и ИИ-контуров.</p></details>
      </DirectionRow>
      <PlusDivider className="directions-divider" />
      <DirectionRow className="direction-tile direction-tile--team">
        <h3>Усиление команды клиента</h3>
        <p>В отдельных сценариях подключаем специалистов WMT для развития и поддержки ИИ-инфраструктуры клиента в формате аутстаффинга.</p>
        <details><summary>Подробнее<SoftPixelNumber arrow compact /></summary><p>Это отдельное направление нашей группы компаний.</p></details>
      </DirectionRow>
      <PlusDivider className="directions-divider" />
      <DirectionRow className="direction-tile direction-tile--kids">
        <div className="direction-tile__top"><span>05</span><span className="direction-tile__label">WMT Kids</span></div>
        <div className="direction-tile__kids-copy"><h3>Обучение для детей</h3>
          <p>Практическое обучение по ИИ для школьников: развиваем цифровую грамотность и критическое мышление через проектные и игровые задания.</p>
          <details><summary>Подробнее<SoftPixelNumber arrow compact /></summary><p>Дети учатся формулировать задачи, работать с данными и собирать первые чат-агенты и мини-приложения под руководством педагогов.</p></details>
        </div>
      </DirectionRow>
    </div>
  </section>;
}

function AboutStatement() {
  const sceneRef = useRef(null);
  useEffect(() => {
    const scene = sceneRef.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let startWidth = 320;
    const measure = () => {
      const guide = document.getElementById('directions');
      startWidth = guide ? guide.getBoundingClientRect().left : window.innerWidth * .25;
    };
    const draw = () => {
      frame = 0;
      const width = document.documentElement.clientWidth;
      const headerHeight = document.querySelector('.header')?.getBoundingClientRect().height ?? 0;
      const height = Math.max(1, window.innerHeight - headerHeight);
      const initialScale = Math.min(1, Math.max(1, startWidth) / width);
      // Overlap the invisible part of the scaled canvas with the preceding
      // section. Its visible top then stays flush with that section's bottom.
      const growth = motion.matches ? 0 : height * (1 - initialScale);
      scene.style.setProperty('--about-growth', `${growth}px`);
      scene.style.setProperty('--about-screen-height', `${height}px`);
      scene.style.setProperty('--about-header-height', `${headerHeight}px`);
      const progress = motion.matches ? 1 : Math.min(1, Math.max(0, (headerHeight - scene.getBoundingClientRect().top) / Math.max(1, growth)));
      const scale = initialScale + (1 - initialScale) * progress;
      scene.style.setProperty('--about-scale', scale);
      scene.classList.toggle('is-expanded', progress >= .995);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const resize = () => { measure(); schedule(); };
    measure();
    draw();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    motion.addEventListener('change', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      motion.removeEventListener('change', resize);
    };
  }, []);
  return <section ref={sceneRef} className="about-scene" aria-label="О WMT AI">
    <div className="about-scene__viewport">
      <PlusDivider className="about-scene__grid" />
      <div className="about-statement">
        <div className="about-statement__content">
        <div className="about-statement__emotions" aria-hidden="true">
          <span>🧠</span><span>✨</span><span>🚀</span>
        </div>
        <p>
          WMT AI — команда, которая помогает бизнесу внедрять искусственный интеллект.
          Объединяем обучение, разработку и готовые решения в один маршрут:
          от выбора задачи и первого пилота до изменений в работе компании.
        </p>
        </div>
      </div>
    </div>
  </section>;
}

function WhyBento() {
  const visualSet = 'bento-visuals-flat';
  return <section className="why section" id="why"><div className="shell">
    <h2>Когда приходят к WMT AI</h2>
    <div className="why-bento">
      {situations.slice(0,3).map((text,i)=><article className={`why-bento__situation${i === 0 && visualSet === 'bento-visuals-flat' ? ' why-bento__situation--map' : ''}`} key={text}>
        <h3>{text}</h3>
        <p>{['Находим точку входа и собираем понятный маршрут.', 'Отделяем перспективные идеи от информационного шума.', 'Соединяем людей, процессы и данные в рабочую систему.'][i]}</p>
        {i === 0 && visualSet === 'bento-visuals-flat' ? <><span className="why-bento__art" aria-hidden="true" /><img className="why-bento__map-background" src="/wmt-ai-preview/bento-visuals-flat/route-background.svg" width="400" height="600" alt="" aria-hidden="true" /></> : <img className="why-bento__art" src={`/wmt-ai-preview/${visualSet}/${['route','filter','system'][i]}.svg`} width="400" height="400" alt="" aria-hidden="true" />}
      </article>)}
      <article className="why-bento__result">
        <div className="why-bento__result-copy"><h3>{situations[3]}</h3>
        <p>Работа должна менять экономику, а не количество презентаций. Поэтому связываем инициативы с процессами, владельцами и критериями результата.</p></div>
        <img className="why-bento__art why-bento__art--wide" src={`/wmt-ai-preview/${visualSet}/outcome.svg`} width="640" height="260" alt="" aria-hidden="true" />
      </article>
      <div className="why-bento__effects">
        {[
          ['−','Меньше системных расходов','Рутину забирает ИИ, а люди убирают потери в процессах.'],
          ['+','Больше доходов','Быстрее решения, сильнее ключевые коммерческие процессы.'],
          ['×','Новые деньги','Продукты и направления, которые раньше были не по карману.'],
        ].map(([,title,copy],i)=><article key={title}><div><h3>{title}</h3><p>{copy}</p></div><img className="why-bento__effect-art" src={`/wmt-ai-preview/icons/bento/${['trend-down','trend-up','money-add'][i]}.svg`} width="32" height="32" alt="" aria-hidden="true" /></article>)}
      </div>
    </div>
  </div></section>;
}

function PlusDivider({ className = "" }) {
  const patternId = `plus-divider-${useId()}`;
  return <div className={`plus-divider ${className}`} aria-hidden="true">
    <svg width="100%" height="100%">
      <defs><pattern id={patternId} width="32" height="28" patternUnits="userSpaceOnUse">
        <path d="M8 3v8M4 7h8M24 17v8M20 21h8" fill="none" stroke="currentColor" strokeWidth="1" />
      </pattern></defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  </div>;
}

function MaterialsNewsletter() {
  return <section className="materials-newsletter" id="materials" aria-labelledby="materials-title">
    <div className="materials-newsletter__inner">
        <div className="materials-newsletter__copy">
          <h2 id="materials-title">Эксклюзивные материалы от экспертов WMT AI</h2>
          <p>Мы собираем и отдаём бесплатно инструменты, которые помогают бизнесу понимать возможности ИИ и находить точки применения</p>
        </div>
        <a className="materials-newsletter__cta" href="https://t.me/wmt_ai_iinsait_bot" target="_blank" rel="noopener noreferrer"><SoftPixelNumber arrow compact /><span>Получить<br />материалы</span></a>
    </div>
  </section>;
}

function EventScene() {
  const sceneRef = useRef(null);
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const travel = Math.max(1, scene.offsetHeight - scene.querySelector('.event').offsetHeight);
      const progress = Math.max(0, Math.min(1, (-scene.getBoundingClientRect().top - 32) / Math.max(1, travel - 64)));
      const eased = progress * progress * (3 - 2 * progress);
      scene.style.setProperty('--event-exit', motion.matches ? '1' : String(eased));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    return () => {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      motion.removeEventListener('change', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return <div className="event-scene" ref={sceneRef} id="event">
    <section className="event section" aria-label="WMT AIчница">
      <img src="/wmt-ai-preview/events/iichnica-1.jpg" alt="Мероприятие WMT AI"/>
      <div className="event-copy">
        <div className="event-identity"><img className="event-logo" src="/wmt-ai-preview/logos/wmtaichnica.svg" alt="ИИчница Show"/><p>Собственное мероприятие WMT AI для лидеров бизнеса. Проводится дважды в год в Москве.</p></div>
        <div className="event-summary"><h2><span>Итоги: от ИИ-игрушек</span>{' '}<span>к ИИ-трансформации</span></h2><p>Живые подкасты, разборы реальных кейсов внедрения, закрытый нетворкинг и инсайты для C-level.</p></div>
        <div className="event-details"><div className="event-facts"><p className="event-facts__meta">Прошедшее событие <span>500+ участников</span></p><p className="event-facts__date"><time dateTime="2026-03-31">31 марта 2026 года</time>, Москва</p></div><a className="button button--light" href="https://www.wmtaichnica.ru/" target="_blank" rel="noopener noreferrer">Посмотреть, как это было</a></div>
      </div>
    </section>
  </div>;
}

function ContactForm() {
  return <form onSubmit={e=>e.preventDefault()}><label>Имя<input name="name" autoComplete="name" placeholder="Как к вам обращаться"/></label><label>Рабочая почта<input type="email" name="email" autoComplete="email" placeholder="name@company.ru"/></label><ContactMessage /><button type="submit"><span>Оставить заявку</span><SoftPixelNumber arrow compact /></button><small>Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</small></form>;
}

function ContactModal() {
  const dialogRef = useRef(null);
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    let trigger = null;
    let previousOverflow = '';
    const dialog = dialogRef.current;
    const open = event => {
      const link = event.target.closest?.('a');
      if (!link || link.closest('.connect-section') || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = link.getAttribute('href') || '';
      if (href !== '#contact' && !href.startsWith('mailto:info@wmt-ai.ru?subject=')) return;
      event.preventDefault();
      if (dialog.open) return;
      trigger = link;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setOpened(true);
      dialog.showModal();
    };
    const closed = () => {
      document.body.style.overflow = previousOverflow;
      setOpened(false);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
    document.addEventListener('click', open);
    dialog.addEventListener('close', closed);
    return () => {
      document.removeEventListener('click', open);
      dialog.removeEventListener('close', closed);
      if (dialog.open) document.body.style.overflow = previousOverflow;
    };
  }, []);
  return <dialog ref={dialogRef} className="contact-modal" aria-labelledby="contact-modal-title" onClick={event => {
    if (event.target !== event.currentTarget) return;
    const r = event.currentTarget.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) event.currentTarget.close();
  }}>
    <button className="contact-modal__close" type="button" aria-label="Закрыть форму" autoFocus onClick={() => dialogRef.current.close()}>×</button>
    <h2 id="contact-modal-title">Обсудить первые шаги</h2>
    <p>Расскажите, какая задача сейчас важнее всего. Мы вернёмся с вопросами по существу.</p>
    {opened && <ContactForm />}
  </dialog>;
}

function App() {
  const heroScrollRef = useNomuScroll();
  return <>
    <OrangeMaterial />
    <Header />
    <ContactModal />
    <main id="top">
      <section ref={heroScrollRef} className="hero-nomu" aria-label="ИИ-трансформация WMT AI">
        <div className="hero-nomu-stage">
          <div className="hero-nomu-core">
            <h1>
              <span>ИИ-трансформация</span>
              <strong>
                <HeroCta />
              </strong>
            </h1>
            <p>Находим перспективные ИИ-инициативы, быстро проверяем экономику и масштабируем решения с доказанным эффектом.</p>
          </div>
          <PhysicsTags />
        </div>
      </section>

      <div className="page-frame">
      <section className="trust-band" aria-label="Клиенты WMT AI">
        <div className="company-grid">
          {['Wildberries','Нацпроектстрой','Фора-Банк','Сбер','T1','T2'].map(x => <span key={x}>{x}</span>)}
        </div>
      </section>

      <BlockVariants id="method" label="ИИ-трансформация на практике">
      <MethodJourney />
      <section className="finale-method" id="method-archive" aria-labelledby="finale-method-title">
        <h2 id="finale-method-title">ИИ-трансформация<br />на практике</h2>
        <div className="finale-method__steps">
          {steps.map((step, i) => <article className="finale-method__step" key={stepTitles[i]}>
            <SoftPixelNumber number={i + 1} textured />
            <div><h3>{stepTitles[i]}</h3><p>{step.join(' ')}</p></div>
          </article>)}
          <a className="finale-method__cta" href="#contact"><SoftPixelNumber arrow compact /><span>Оставить заявку</span></a>
        </div>
      </section>
      </BlockVariants>
      <div className="page-inner-guide">
      <div className="plus-divider" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="plus-divider-pattern" width="32" height="28" patternUnits="userSpaceOnUse">
              <path d="M8 3v8M4 7h8M24 17v8M20 21h8" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#plus-divider-pattern)" />
        </svg>
      </div>

      <DirectionsShowcase />

      <AboutStatement />

      <div className="plus-divider plus-divider--dark" aria-hidden="true">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="plus-divider-pattern-dark" width="32" height="28" patternUnits="userSpaceOnUse">
              <path d="M8 3v8M4 7h8M24 17v8M20 21h8" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#plus-divider-pattern-dark)" />
        </svg>
      </div>

      <WhyBento />

      <ClientCases Arrow={SoftPixelNumber} />
      <BlockVariants label="Игорь Никитин" initialVariant={1}>
      <div className="lower-sections">
      <section className="expert-section" id="expert" aria-labelledby="expert-title">
        <div className="expert-identity">
          <img className="expert-portrait" src={igorPortrait} alt="Игорь Никитин" loading="lazy" />
          <div className="expert-caption"><h3>Игорь Никитин</h3><p>Основатель и CEO WMT AI</p></div>
        </div>
        <div className="expert-evidence">
          <div className="expert-symbol" aria-hidden="true"><SoftPixelNumber arrow compact /></div>
          <h2 id="expert-title">Практика, усиленная<br />академическим признанием</h2>
          <div className="expert-facts">
            <div><strong>400+</strong><p>сотрудников в глобальной команде</p></div>
            <div><strong>50+</strong><p>ИИ-внедрений за 2024–2026 годы</p></div>
            <div><strong>~$1M</strong><p>грант от топ-40 университета мира</p></div>
            <div><strong>Патент</strong><p>и платформа IIGOR</p></div>
          </div>
        </div>
      </section>
      </div>
      <div className="lower-sections">
        <section className="expert-section expert-section--mosaic" id="expert-mosaic" aria-labelledby="expert-mosaic-title">
          <div className="expert-identity">
            <img className="expert-portrait" src={igorPortrait} alt="Игорь Никитин" loading="lazy" />
            <div className="expert-caption"><h3>Игорь Никитин</h3><p>Основатель и CEO WMT AI</p></div>
          </div>
          <div className="expert-evidence">
            <h2 id="expert-mosaic-title">Практика, усиленная<br />академическим признанием</h2>
            <div className="expert-mosaic">
              {[
                ['400+', 'сотрудников в глобальной команде'],
                ['50+', 'ИИ-внедрений за 2024–2026 годы'],
                ['~$1M', 'грант от топ-40 университета мира'],
                ['Патент', 'и платформа IIGOR'],
              ].map(([value, caption], i) => <div className="expert-mosaic__fact" key={value}>
                <div className="expert-mosaic__face">
                  <SoftPixelNumber number={i + 1} />
                  <div><strong>{value}</strong><p>{caption}</p></div>
                </div>
              </div>)}
              <span className="expert-mosaic__block expert-mosaic__block--top" aria-hidden="true" />
              <span className="expert-mosaic__block expert-mosaic__block--dark" aria-hidden="true" />
              <span className="expert-mosaic__block expert-mosaic__block--under-cta" aria-hidden="true" />
              <span className="expert-mosaic__block expert-mosaic__block--foot-left" aria-hidden="true" />
              <span className="expert-mosaic__block expert-mosaic__block--foot-right" aria-hidden="true" />
              <a className="expert-mosaic__cta" href="#contact"><span className="expert-mosaic__cta-face"><SoftPixelNumber arrow compact /><span>Оставить<br />заявку</span></span></a>
            </div>
          </div>
        </section>
      </div>
      </BlockVariants>
      <PlusDivider />
      <MaterialsNewsletter />
      <PlusDivider />


      <EventScene />
      <PlusDivider className="finale-divider plus-divider--dark" />

      <div className="lower-sections page-finale">


      <BlockVariants id="research" label="Наши исследования" initialVariant={3}>
      <section className="insights-section" aria-labelledby="insights-title">
        <div className="lower-heading"><h2 id="insights-title">Наши исследования</h2><p>Фиксируем изменения раньше, чем они становятся общим местом.</p></div>
        <div className="insights-grid">{researches.map(([title, copy], i) => <article className={`insight insight--${i}`} key={title}>
          <div className="insight-cover" aria-hidden="true">
            {i === 0 && <div className="convergence-art">{Array.from({length: 7}, (_, n) => <i key={n} style={{'--n': n}} />)}<b>2027</b></div>}
            {i === 1 && <div className="replacement-art">{Array.from({length: 25}, (_, n) => <i key={n} />)}</div>}
            {i === 2 && <div className="forecast-art"><span>2025</span><SoftPixelNumber arrow compact /><span>2026</span></div>}
          </div>
          <div className="insight-copy"><h3>{title}</h3><p>{copy}</p><a href={`mailto:info@wmt-ai.ru?subject=${encodeURIComponent('Запрос исследования: ' + title)}`}><span>Запросить исследование</span><SoftPixelNumber arrow compact /></a></div>
        </article>)}</div>
      </section>
      <ResearchAlternative mode="list" researches={researches} Arrow={SoftPixelNumber} />
      <ResearchAlternative mode="compact" researches={researches} Arrow={SoftPixelNumber} />
      <ResearchAlternative mode="shelf" researches={researches} Arrow={SoftPixelNumber} />
      </BlockVariants>

      <section className="press-section" aria-label="Публикации"><div><span>РБК</span><span>Forbes</span><span>vc.ru</span><span>Т—Ж</span></div></section>

      <PlusDivider />
      <BlockVariants id="contact" label="Обсудить первые шаги" initialVariant={1}>
      {['signature', 'ambient'].map(composition => <section key={composition} className={`connect-section connect-section--${composition}`} aria-labelledby="connect-title">
        <div className="connect-copy"><h2 id="connect-title">Обсудить<br/>первые шаги</h2><p>Расскажите, какая задача сейчас важнее всего. Мы вернёмся с вопросами по существу.</p><a href="mailto:info@wmt-ai.ru">info@wmt-ai.ru <SoftPixelNumber arrow compact /></a></div>
        <ContactForm />
      </section>)}
      </BlockVariants>
      </div>
      <PlusDivider />

      </div>
      </div>
    </main>
    <FooterVariants Arrow={SoftPixelNumber} PlusDivider={PlusDivider} />
  </>;
}

export default App;
