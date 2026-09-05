import React from 'react';
import './research-alternatives.css';
import BookMockup, { researchCovers } from './BookMockup';

function Cover({index}) {
  return <div className={`research-cover research-cover--${index}`} aria-hidden="true">
    <span className="research-cover__brand">WMT AI</span>
    {index === 0 ? <strong>2027</strong> : index === 1 ? <div className="research-cover__pixels">{Array.from({length:16},(_,i)=><i key={i}/>)}</div> : <strong>2025<br/>2026</strong>}
    <span className="research-cover__caption">{['Точка схождения','Тихая замена','ИИ: итоги и прогнозы'][index]}</span>
  </div>;
}

export default function ResearchAlternative({mode, researches, Arrow}) {
  return <section className={`research-alt research-alt--${mode}`} aria-labelledby={`research-${mode}-title`}>
    <header className="research-alt__heading"><h2 id={`research-${mode}-title`}>Наши исследования</h2><p>Фиксируем изменения раньше, чем они становятся общим местом.</p></header>
    <div className="research-alt__items">
      {researches.map(([title,copy],index)=><article className="research-alt__item" key={title}>
        {mode === 'compact' ? <svg className="research-alt__document" viewBox="0 0 32 40" fill="none" aria-hidden="true"><path d="M5 2h15l7 7v29H5zM20 2v8h7M10 18h12M10 24h12M10 30h8" stroke="currentColor" strokeWidth="1.5"/></svg> : mode === 'shelf' ? <div className="research-alt__book-card"><BookMockup src={researchCovers[index]} title={title} index={index}/></div> : <Cover index={index}/>}
        <div className="research-alt__copy"><h3>{mode === 'shelf' ? <a className="research-alt__title-link" href={`mailto:info@wmt-ai.ru?subject=${encodeURIComponent('Запрос исследования: '+title)}`} aria-label={`Запросить исследование: ${title}`}><Arrow arrow compact/><span>{title}</span></a> : title}</h3><p>{copy}</p></div>
        {mode !== 'shelf' && <a href={`mailto:info@wmt-ai.ru?subject=${encodeURIComponent('Запрос исследования: '+title)}`} aria-label={`Запросить исследование: ${title}`}><span>Запросить исследование</span><Arrow arrow compact/></a>}
      </article>)}
    </div>
  </section>;
}
