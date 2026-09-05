import React, { useLayoutEffect, useRef } from 'react';

export default function ContactMessage() {
  const field = useRef(null);
  const resize = () => {
    const element = field.current;
    if (!element) return;
    element.style.height = '0px';
    const contentHeight = element.scrollHeight + 1;
    const limit = parseFloat(getComputedStyle(element).maxHeight);
    element.style.height = `${Math.min(contentHeight, limit)}px`;
    element.style.overflowY = contentHeight > limit ? 'auto' : 'hidden';
  };

  useLayoutEffect(() => {
    resize();
    let width = field.current.clientWidth;
    const observer = new ResizeObserver(() => {
      if (field.current.clientWidth === width) return;
      width = field.current.clientWidth;
      resize();
    });
    observer.observe(field.current);
    return () => observer.disconnect();
  }, []);

  return <label className="connect-message">Задача<textarea ref={field} name="message" rows="1" onInput={resize} placeholder="Что хотите изменить с помощью ИИ" /></label>;
}
