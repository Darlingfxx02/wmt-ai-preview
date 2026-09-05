import React from 'react';
import './book-mockup.css';

export const researchCovers = [
  '/wmt-ai-preview/research-books/convergence-2027.webp',
  '/wmt-ai-preview/research-books/quiet-replacement.webp',
  '/wmt-ai-preview/research-books/ai-2025-2026.webp',
];

export default function BookMockup({ src, title, index = 0 }) {
  return <div className={`book-mockup book-mockup--${index}`}>
    <img src={src} alt={`Книга исследования «${title}»`} width="840" height="1210" loading="lazy" />
  </div>;
}
