import React, { useEffect, useLayoutEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './block-variants.css';

export default function BlockVariants({ children, label, initialVariant = 0, id: providedId }) {
  const variants = React.Children.toArray(children);
  const [selected, setSelected] = useState(initialVariant);
  const [visible, setVisible] = useState(false);
  const host = useRef(null);
  const generatedId = useId();
  const id = providedId || generatedId;
  const switchTop = useRef(null);
  useLayoutEffect(() => {
    if (switchTop.current === null) return;
    const top = host.current.getBoundingClientRect().top;
    window.scrollTo({ top: window.scrollY + top - switchTop.current, behavior: 'instant' });
    switchTop.current = null;
  }, [selected]);

  useEffect(() => {
    const element = host.current;
    let frame;
    const update = () => {
      frame = undefined;
      const rect = element.getBoundingClientRect();
      const middle = window.innerHeight / 2;
      setVisible(rect.top <= middle && rect.bottom > middle);
    };
    const schedule = () => { if (frame === undefined) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return <>
    <div ref={host} id={id} className="block-variants">{variants[selected]}</div>
    {visible && variants.length > 1 && createPortal(
      <aside className="block-variant-panel" aria-label={`Варианты блока: ${label}`}>
        {variants.map((_, index) => <button
          key={index}
          type="button"
          aria-label={`${label}: вариант ${index + 1}`}
          aria-pressed={selected === index}
          aria-controls={id}
          title={`Вариант ${index + 1}`}
          onClick={() => {
            if (index === selected) return;
            switchTop.current = Math.max(90, host.current.getBoundingClientRect().top);
            setSelected(index);
          }}
        >{index + 1}</button>)}
      </aside>, document.body
    )}
  </>;
}
