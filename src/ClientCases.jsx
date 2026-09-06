import React, { useEffect, useId, useRef, useState } from 'react';
import training from '../../src/data/training-cases.json';
import implementation from '../../src/data/implementation-cases.json';

const cycleCases = [...training, ...implementation.map(item => ({ ...item, tagLabel: 'Разработка · ' + item.format }))];
const priority = ['wildberries-transformatsiya', 'tsentralnyi-bank-armenii', 'natsproektstroi'];
cycleCases.sort((a, b) => (priority.includes(a.id) ? priority.indexOf(a.id) : 99) - (priority.includes(b.id) ? priority.indexOf(b.id) : 99));

cycleCases.splice(2, 0, { id: 'discuss-your-task', conversion: true, client: 'Обсудить вашу задачу' });
const cycleLength = cycleCases.length;
const cases = Array.from({ length: 3 }, (_, copy) => cycleCases.map(item => ({ ...item, id: `${copy}-${item.id}` }))).flat();
const wrap = (value, size) => ((value % size) + size) % size;

// Rounded trapezoid whose straight sides match the wheel's boundary angles.
function sectorPath(width, height, inset) {
  const points = [[0, 0], [width, 0], [width - inset, height], [inset, height]];
  const rounding = Math.min(28, width * .11, height * .12);
  const corners = points.map((point, i) => {
    const toward = target => {
      const dx = target[0] - point[0], dy = target[1] - point[1];
      const distance = Math.hypot(dx, dy);
      const fraction = Math.min(rounding / distance, .4);
      return [point[0] + dx * fraction, point[1] + dy * fraction];
    };
    return { point, before: toward(points[(i + 3) % 4]), after: toward(points[(i + 1) % 4]) };
  });
  const xy = point => `${point[0] / width} ${point[1] / height}`;
  return `M ${xy(corners[0].before)} ` + corners.map(corner => `Q ${xy(corner.point)} ${xy(corner.after)} L ${xy(corners[(corners.indexOf(corner) + 1) % 4].before)}`).join(' ') + ' Z';
}

function CurvedCaseScrubber({ value, max, radius, onChange }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(1000);
  useEffect(() => {
    const observer = new ResizeObserver(() => setWidth(ref.current.clientWidth));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const length = Math.max(1, width - 16);
  // Half the sag of the concentric card edge; the lower reference is flat.
  const r = Math.max(radius || 5000, length / 2 + 1);
  const sag = (r - Math.sqrt(r * r - (length / 2) ** 2)) / 2;
  // Align the curve ends with the vertically centred arrow controls.
  const y = p => 18 - sag / 2 + sag * (2 * p - 1) ** 2;
  const x = p => 8 + length * p;
  const path = (a, b) => `M ${x(a)} ${y(a)} Q ${x((a + b) / 2)} ${y((a + b) / 2) - sag * (b - a) ** 2} ${x(b)} ${y(b)}`;
  const progress = max ? value / max : 0;
  const thumb = Math.min(.15, 72 / length);
  const start = progress * (1 - thumb);
  const seek = event => {
    const bounds = ref.current.getBoundingClientRect();
    const localX = (event.clientX - bounds.left) * width / bounds.width;
    const p = Math.max(0, Math.min(1, (localX - 8 - length * thumb / 2) / (length * (1 - thumb))));
    onChange(p * max);
  };
  return <svg ref={ref} className="case-curved-scrubber" width="100%" height={Math.ceil(sag + 36)} viewBox={`0 0 ${width} ${Math.ceil(sag + 36)}`} role="slider" tabIndex={0} aria-label="Прокрутка кейсов" aria-valuemin={0} aria-valuemax={Math.round(max)} aria-valuenow={Math.round(value)} aria-valuetext={`Прокручено ${Math.round(progress * 100)}%`} aria-controls="case-slider"
    onPointerDown={event => { if (event.button !== 0) return; event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); seek(event); }}
    onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) seek(event); }}
    onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
    onKeyDown={event => { const steps = { ArrowLeft: -.01, ArrowDown: -.01, ArrowRight: .01, ArrowUp: .01, PageDown: -.1, PageUp: .1 }; if (event.key in steps || ['Home', 'End'].includes(event.key)) { event.preventDefault(); onChange(event.key === 'Home' ? 0 : event.key === 'End' ? max : Math.max(0, Math.min(max, value + max * steps[event.key]))); } }}>
    <path className="case-curved-scrubber__track" d={path(0, 1)} />
    <path className="case-curved-scrubber__thumb" d={path(start, start + thumb)} />
  </svg>;
}

export default function ClientCases({ Arrow }) {
  const sliceId = `case-slice-${useId().replace(/:/g, "")}`;
  const track = useRef(null);
  const section = useRef(null);
  const reveal = useRef(null);
  const guides = useRef(null);
  const base = useRef(null);
  const controls = useRef(null);
  const slicePath = useRef(null);
  const refreshGeometry = useRef(null);
  const moveFrame = useRef(0);
  const loopMetrics = useRef({ span: 0, origin: 0 });

  const gapOf = el => parseFloat(getComputedStyle(el).columnGap) || 0;
  const dialog = useRef(null);
  const [position, setPosition] = useState({ first: 0, last: 2, atEnd: false, scroll: 0, maxScroll: 0 });
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let displayed = null;
    let previousTime = 0;
    const update = (time = performance.now()) => {
      frame = 0;
      const top = section.current.getBoundingClientRect().top;
      const progress = motion.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * .75 - top) / (innerHeight * .63)));
      const target = progress * progress * (3 - 2 * progress);
      const elapsed = previousTime ? Math.min(64, time - previousTime) : 16;
      previousTime = time;
      // Time-based damping absorbs wheel steps consistently at any refresh rate.
      displayed = displayed === null || motion.matches ? target : displayed + (target - displayed) * (1 - Math.exp(-elapsed / 110));
      const settling = Math.abs(target - displayed) > .0001;
      if (!settling) displayed = target;
      const horizontalPosition = track.current.scrollLeft;
      section.current.style.setProperty('--cases-viewport', `${document.documentElement.clientWidth}px`);
      reveal.current.style.setProperty('--cases-scale', String(.6 + .4 * displayed));
      reveal.current.style.setProperty('--cases-rise', `${80 * (1 - displayed)}px`);
      track.current.scrollLeft = horizontalPosition;
      refreshGeometry.current?.();
      if (settling) frame = requestAnimationFrame(update);
      else previousTime = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', schedule);
    };
  }, []);
  useEffect(() => {
    const el = track.current;
    const cards = [...el.querySelectorAll(':scope > .case-preview')];
    let positioned = false;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const width = el.clientWidth;
      if (!positioned && width) {
        const conversion = cards[cycleLength + 2];
        el.scrollLeft = Math.max(0, conversion.offsetLeft + conversion.offsetWidth / 2 - width / 2);
        positioned = true;
      }
      const span = cards[cycleLength].offsetLeft - cards[0].offsetLeft;
      const origin = cards[cycleLength].offsetLeft - cards[0].offsetLeft;
      loopMetrics.current = { span, origin };
      if (span && (el.scrollLeft < span * .5 || el.scrollLeft >= span * 1.5)) {
        el.scrollLeft = span * .5 + wrap(el.scrollLeft - span * .5, span);
      }
      if (el.scrollTop) el.scrollTop = 0;
      // Untransformed slots keep native scrolling and snap positions stable.
      // Their faces follow the tangent of a large circle below the carousel.
      const viewportWidth = document.documentElement.clientWidth;
      const radius = viewportWidth * (viewportWidth < 600 ? 4.8 : 4.2);
      const visible = [];
      const gap = gapOf(el);
      const visual = cards[1].querySelector('.case-preview__visual');
      const imageWidth = visual.clientWidth;
      const imageHeight = visual.clientHeight;
      const halfSector = motion.matches ? 0 : (cards[0].offsetWidth + gap) / (2 * radius);
      const inset = imageHeight * Math.tan(halfSector);
      slicePath.current.setAttribute('d', sectorPath(imageWidth, imageHeight, inset));
      el.style.setProperty('--case-base-width', `${imageWidth - 2 * inset}px`);
      const guideLayer = guides.current;
      const top = parseFloat(getComputedStyle(el).paddingTop) || 0;
      reveal.current.style.setProperty('--case-controls-height', `${controls.current.offsetHeight}px`);
      const guideHeight = el.clientHeight;
      const contentWidth = cards.at(-1).offsetLeft + cards.at(-1).offsetWidth;
      const scrollX = el.scrollLeft;
      guideLayer.setAttribute('viewBox', `0 0 ${contentWidth} ${guideHeight}`);
      guideLayer.style.left = '0px';
      guideLayer.style.width = `${contentWidth}px`;
      guideLayer.style.height = `${guideHeight}px`;
      const centerX = width / 2;
      const centerY = top + radius;
      const outer = radius + 16;
      const contentHeight = Math.max(...cards.map(card => card.querySelector('.case-preview__open')?.offsetHeight || 0));
      const bottomY = top + contentHeight + 40;
      const innerRadius = Math.max(radius - contentHeight - 40, width / 2 + 1);
      const arcY = centerY - Math.sqrt(outer * outer - centerX * centerX);
      const innerArcY = motion.matches ? bottomY : centerY - Math.sqrt(Math.max(0, innerRadius * innerRadius - centerX * centerX));
      // Stationary underlay: horizontal scrolling only moves the sectors above it.
      base.current.setAttribute('viewBox', `0 0 ${width} ${guideHeight}`);
      base.current.style.height = `${guideHeight}px`;
      base.current.querySelector('path').setAttribute('d', `M 0 ${innerArcY} ${motion.matches ? 'L' : `A ${innerRadius} ${innerRadius} 0 0 1`} ${width} ${innerArcY} L ${width} ${guideHeight} L 0 ${guideHeight} Z`);
      guideLayer.querySelector('.case-wheel-rim').setAttribute('d', motion.matches
        ? `M ${scrollX} ${top - 16} H ${scrollX + width}`
        : `M ${scrollX} ${arcY} A ${outer} ${outer} 0 0 1 ${scrollX + width} ${arcY}`);
      const guideLines = guideLayer.querySelectorAll('line');
      const sectors = guideLayer.querySelectorAll('.case-wheel-sector');
      const bottomEdges = guideLayer.querySelectorAll('.case-wheel-bottom-edge');
      cards.forEach((card, index) => {
        const left = card.offsetLeft - el.scrollLeft;
        const cardWidth = card.offsetWidth;
        if (left + cardWidth > 10 && left < width - 10) visible.push(index);
        const overscan = (cardWidth + gap) * 2;
        const rendered = left + cardWidth + overscan > 0 && left - overscan < width;
        card.style.visibility = rendered ? 'visible' : 'hidden';
        const rawX = left + cardWidth / 2 - width / 2;
        const x = rendered ? rawX : Math.max(-width * .6, Math.min(width * .6, rawX));
        const angle = motion.matches ? 0 : x / radius;
        const shiftX = motion.matches ? 0 : radius * Math.sin(angle) - x;
        const shiftY = radius * (1 - Math.cos(angle));
        card.style.setProperty('--case-x', `${shiftX.toFixed(2)}px`);
        card.style.setProperty('--case-y', `${shiftY.toFixed(2)}px`);
        card.style.setProperty('--case-angle', `${angle.toFixed(5)}rad`);
        // Cards and guides share the native scrolling surface. Only their
        // radial correction changes here, so compositor scrolling cannot separate them.
        // Use one shared boundary for adjacent sectors: independently rounded
        // slot edges can otherwise expose the dark background between fills.
        const boundaryX = (index + 1 < cards.length
          ? (card.offsetLeft + cardWidth + cards[index + 1].offsetLeft) / 2
          : card.offsetLeft + cardWidth + gap / 2) - scrollX;
        const startX = (index > 0
          ? (cards[index - 1].offsetLeft + cards[index - 1].offsetWidth + card.offsetLeft) / 2
          : card.offsetLeft - gap / 2) - scrollX;
        const theta = (boundaryX - centerX) / radius;
        const line = guideLines[index];
        const startTheta = (startX - centerX) / radius;
        const point = (angle, atBottom) => {
          if (motion.matches) return [scrollX + centerX + angle * radius, atBottom ? bottomY : top - 16];
          const distance = atBottom ? innerRadius : outer;
          return [scrollX + centerX + distance * Math.sin(angle), centerY - distance * Math.cos(angle)];
        };
        const a = point(startTheta, false), b = point(theta, false);
        const c = point(theta, true), d = point(startTheta, true);
        sectors[index].setAttribute('d', `M ${a.join(' ')} ${motion.matches ? 'L' : `A ${outer} ${outer} 0 0 1`} ${b.join(' ')} L ${c.join(' ')} ${motion.matches ? 'L' : `A ${innerRadius} ${innerRadius} 0 0 0`} ${d.join(' ')} Z`);
        sectors[index].style.display = rendered ? '' : 'none';
        // Overlap antialiased fill edges beneath the separate light guide stroke.
        sectors[index].setAttribute('stroke', sectors[index].getAttribute('fill'));
        sectors[index].setAttribute('stroke-width', '1');
        sectors[index].setAttribute('vector-effect', 'non-scaling-stroke');
        bottomEdges[index].setAttribute('d', `M ${c.join(' ')} ${motion.matches ? 'L' : `A ${innerRadius} ${innerRadius} 0 0 0`} ${d.join(' ')}`);
        bottomEdges[index].style.display = cases[index].conversion ? 'none' : sectors[index].style.display;
        if (cases[index].conversion) {
          // Leave an actual gap in the rim over the conversion sector instead of
          // painting a second stroke on top of the light one.
          if (sectors[index].style.display !== 'none') {
            const edgePoint = x => [x, motion.matches ? top - 16 : centerY - Math.sqrt(Math.max(0, outer * outer - (x - scrollX - centerX) ** 2))];
            const start = edgePoint(Math.max(scrollX, a[0]));
            const end = edgePoint(Math.min(scrollX + width, b[0]));
            const arc = motion.matches ? 'L' : `A ${outer} ${outer} 0 0 1`;
            const parts = [];
            if (a[0] > scrollX) parts.push(`M ${scrollX} ${motion.matches ? top - 16 : arcY} ${arc} ${start.join(' ')}`);
            if (b[0] < scrollX + width) parts.push(`M ${end.join(' ')} ${arc} ${scrollX + width} ${motion.matches ? top - 16 : arcY}`);
            guideLayer.querySelector('.case-wheel-rim').setAttribute('d', parts.join(' '));
          }
        }
        const inner = innerRadius;
        line.setAttribute('x1', scrollX + (motion.matches ? boundaryX : centerX + outer * Math.sin(theta)));
        line.setAttribute('y1', motion.matches ? top - 16 : centerY - outer * Math.cos(theta));
        line.setAttribute('x2', scrollX + (motion.matches ? boundaryX : centerX + inner * Math.sin(theta)));
        line.setAttribute('y2', c[1]);
        line.style.display = rendered ? '' : 'none';
      });
      const next = { first: visible[0] ?? 0, last: visible.at(-1) ?? 0, atEnd: false, scroll: span ? wrap(el.scrollLeft - origin, span) : 0, maxScroll: span, radius: innerRadius };
      setPosition(previous => previous.first === next.first && previous.last === next.last && previous.atEnd === next.atEnd && previous.scroll === next.scroll && previous.maxScroll === next.maxScroll && previous.radius === next.radius ? previous : next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    let gestureAxis = null;
    let lastWheelTime = 0;
    const onWheel = event => {
      if (event.ctrlKey) return; // Preserve trackpad pinch zoom.
      const now = performance.now();
      if (now - lastWheelTime > 180) gestureAxis = null;
      lastWheelTime = now;
      const horizontal = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
      if (!gestureAxis && (horizontal || event.deltaY)) {
        gestureAxis = event.shiftKey || Math.abs(horizontal) > Math.abs(event.deltaY) ? 'x' : 'y';
      }
      if (gestureAxis !== 'x' || !event.cancelable) return;
      event.preventDefault();
      cancelAnimationFrame(moveFrame.current);
      cancelAnimationFrame(frame);
      frame = 0;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientWidth : 1;
      const scale = Number(getComputedStyle(reveal.current).getPropertyValue('--cases-scale')) || 1;
      // Consume every OS momentum delta without a separate compositor scroll.
      // Scroll position and both curved boundaries are painted in the same frame.
      el.scrollLeft += horizontal * unit / scale;
      update();
    };
    refreshGeometry.current = update;
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    observer.observe(cards[0]);
    observer.observe(controls.current);
    observer.observe(el.closest('.client-cases'));
    el.addEventListener('scroll', schedule, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    motion.addEventListener('change', schedule);
    update();
    return () => {
      cancelAnimationFrame(moveFrame.current);
      refreshGeometry.current = null;
      observer.disconnect();
      el.removeEventListener('scroll', schedule);
      el.removeEventListener('wheel', onWheel);
      motion.removeEventListener('change', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    if (!selected) return;
    dialog.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [selected]);
  const move = direction => {
    const el = track.current;
    cancelAnimationFrame(moveFrame.current);
    const distance = direction * el.clientWidth * .8;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.scrollLeft += distance;
      refreshGeometry.current?.();
      return;
    }
    let start, previous = 0;
    const tick = time => {
      start ??= time;
      const progress = Math.min(1, (time - start) / 360);
      const travelled = distance * (1 - (1 - progress) ** 3);
      el.scrollLeft += travelled - previous;
      previous = travelled;
      refreshGeometry.current?.();
      if (progress < 1) moveFrame.current = requestAnimationFrame(tick);
    };
    moveFrame.current = requestAnimationFrame(tick);
  };
  const close = () => dialog.current.close();
  return <section ref={section} className="client-cases" id="cases" aria-labelledby="client-cases-title">
    <svg width="0" height="0" aria-hidden="true" style={{position:'absolute'}}><defs><clipPath id={sliceId} clipPathUnits="objectBoundingBox"><path ref={slicePath} d="M .18 0 L .82 0 Q 1 0 .984 .20 L .936 .80 Q .92 1 .74 1 L .26 1 Q .08 1 .064 .80 L .016 .20 Q 0 0 .18 0 Z" /></clipPath></defs></svg>
    <header className="client-cases__heading">
      <div><h2 id="client-cases-title"><span className="client-cases__title-end"><svg className="hero-nomu-chevrons client-cases__chevrons client-cases__chevrons--left" viewBox="0 0 60 56" aria-hidden="true"><polyline points="8 8 24 28 8 48" /><polyline points="36 8 52 28 36 48" /></svg>Нам</span> доверяют лидеры <span className="client-cases__title-end">рынка<svg className="hero-nomu-chevrons client-cases__chevrons" viewBox="0 0 60 56" aria-hidden="true"><polyline points="8 8 24 28 8 48" /><polyline points="36 8 52 28 36 48" /></svg></span></h2></div>
    </header>
    <div ref={reveal} className="case-wheel-reveal">
    <div className="case-wheel-stage">
    <svg ref={base} className="case-wheel-underlay" aria-hidden="true"><path fill="#fff" /></svg>
    <div ref={track} className="case-slider" id="case-slider" role="region" aria-roledescription="карусель" aria-label="Кейсы клиентов" tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); } }}>
      {cases.map((item, index) => <article key={item.id} className={'case-preview' + (item.empty ? ' case-preview--empty' : '') + (item.conversion ? ' case-preview--conversion' : '') + (item.featured ? ' case-preview--featured' : '')} aria-hidden={item.empty || undefined} aria-label={item.empty ? undefined : `${index % cycleLength + 1} из ${cycleLength}`}>
        {item.empty ? null : item.conversion ? <a href="#contact" className="case-preview__open case-preview__conversion" aria-label="Обсудить вашу задачу">
          <div className="case-preview__visual case-preview__visual--conversion">
            <span className="case-conversion-arrow" aria-hidden="true"><Arrow arrow compact /></span>
            <h3>Ваш следующий<br />кейс — с нами</h3>
          </div>
        </a> : <button type="button" className="case-preview__open" onClick={() => setSelected(item)} aria-label={`Открыть кейс: ${item.client}`}>
          <div style={{clipPath:`url(#${sliceId})`}} className={'case-preview__visual' + (item.photo ? ' case-preview__visual--photo' : '')}>
            {item.photo ? <img src={item.photo} alt="" loading="lazy" style={{ objectPosition: 'center 65%' }} /> : item.logo ? <img className="case-preview__logo" src={item.logo} alt="" loading="lazy" /> : <span className="case-preview__wordmark">{item.client}</span>}
          </div>
          <span className="case-preview__arrow" aria-hidden="true"><Arrow arrow compact /></span>
          <div className="case-preview__copy"><h3>{item.client}</h3><p>{item.short}</p></div>
        </button>}
      </article>)}
    <svg ref={guides} className="case-wheel-guides" aria-hidden="true"><g>{cases.map((item, index) => item.conversion ? <a key={item.id} href="#contact" aria-label="Ваш следующий кейс — с нами" tabIndex={-1}><path className="case-wheel-sector case-wheel-sector--conversion" fill="url(#wmt-orange-material)" /></a> : <path key={item.id} className="case-wheel-sector" fill={index % 2 ? "var(--case-sector-alt)" : "var(--case-sector)"} />)}</g><path className="case-wheel-rim" />{cases.map(item => <line key={item.id} />)}{cases.map(item => <path key={item.id} className="case-wheel-bottom-edge" />)}</svg>
    </div>
    </div>
    <div ref={controls} className="case-wheel-bottom">
    <div className="case-slider-navigation">
      <CurvedCaseScrubber value={position.scroll} max={position.maxScroll} radius={position.radius} onChange={value => { cancelAnimationFrame(moveFrame.current); const { span, origin } = loopMetrics.current; const phase = span ? wrap(track.current.scrollLeft - origin, span) : 0; track.current.scrollLeft += value - phase; refreshGeometry.current?.(); }} />
      <div className="case-slider-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Предыдущие кейсы" aria-controls="case-slider">←</button>
        <button type="button" onClick={() => move(1)} aria-label="Следующие кейсы" aria-controls="case-slider">→</button>
      </div>
    </div>
    <div className="case-wheel-divider" aria-hidden="true">
      <svg width="100%" height="100%">
        <defs>
          <pattern id={`${sliceId}-crosses`} width="32" height="28" patternUnits="userSpaceOnUse">
            <path d="M8 3v8M4 7h8M24 17v8M20 21h8" fill="none" stroke="#dfe3e7" strokeWidth="1" />
          </pattern>
        </defs>
        <g>
          <rect width="100%" height="100%" fill="#fff" />
          <rect className="case-divider-center" height="100%" fill="var(--paper)" />
          <rect className="case-divider-center" height="100%" fill={`url(#${sliceId}-crosses)`} />
          <rect className="case-divider-rail case-divider-rail--left" width="1" height="100%" />
          <rect className="case-divider-rail case-divider-rail--right" width="1" height="100%" />
        </g>
        <rect width="100%" height="1" fill="#d9dce1" />
        <rect className="case-divider-bottom" width="100%" height="1" fill="#d9dce1" />
      </svg>
    </div>
    </div>
    </div>
    <dialog ref={dialog} className="case-detail" aria-labelledby="case-detail-title" onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close(); } }}>
      {selected && <><button autoFocus className="case-detail__close" type="button" onClick={close} aria-label="Закрыть кейс">×</button><span className="case-preview__format">{selected.tagLabel || selected.format}</span><h2 id="case-detail-title">{selected.client}</h2><p className="case-detail__intro">{selected.short}</p>{[['Контекст', selected.audience], ['Решение', selected.request], ['Результат', selected.result]].map(([title, copy]) => copy && <div className="case-detail__section" key={title}><h3>{title}</h3><p>{copy}</p></div>)}<a href="#contact" className="case-detail__cta" onClick={close}>Обсудить похожую задачу<Arrow arrow compact /></a></>}
    </dialog>
  </section>;
}
