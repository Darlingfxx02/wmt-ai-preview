import React from 'react';
import './research-alternatives.css';
import BookMockup, { researchCovers } from './BookMockup';

export default function ResearchAlternative({researches, Arrow}) {
  const mode = "shelf";
  return <section className={`research-alt research-alt--${mode}`} aria-labelledby={`research-${mode}-title`}>
    <header className="research-alt__heading"><h2 id={`research-${mode}-title`}>Наши исследования</h2><p>Фиксируем изменения раньше, чем они становятся общим местом.</p></header>
    <div className="research-alt__items">
      {researches.map(([title,copy],index)=><article className="research-alt__item" key={title}>
        <div className="research-alt__book-card"><BookMockup src={researchCovers[index]} title={title} index={index}/></div>
        <div className="research-alt__copy"><h3><a className="research-alt__title-link" href={`mailto:info@wmt-ai.ru?subject=${encodeURIComponent('Запрос исследования: '+title)}`} aria-label={`Запросить исследование: ${title}`}><Arrow arrow compact/><span>{title}</span></a></h3><p>{copy}</p></div>

      </article>)}
    </div>
  </section>;
}
