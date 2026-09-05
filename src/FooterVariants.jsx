import React from 'react';
import './footer-variants.css';

function FooterComposition({ Arrow, PlusDivider }) {
  return <footer className={"footer footer-lab footer-lab--glow"}>
    <PlusDivider className="footer-lab__rail footer-lab__rail--left" />
    <PlusDivider className="footer-lab__rail footer-lab__rail--right" />
    <div className="footer-lab__top">
      <div className="footer-lab__identity">
        <a href="#top" aria-label="WMT AI, на главную"><img src="/wmt-ai-preview/logos/wmt-official.svg" alt="WMT AI" /></a>
        <p>Системная ИИ-трансформация<br/>бизнеса</p>
        <a className="footer-lab__email" href="mailto:info@wmt-ai.ru"><span>info@wmt-ai.ru</span><Arrow arrow compact /></a>
      </div>
      <nav className="footer-lab__links" aria-label="Навигация в футере">
        <div><h3>Что делаем</h3><a href="#method">Как работаем</a><a href="#directions">Направления</a><a href="#cases">Кейсы</a></div>
        <div><h3>Делимся опытом</h3><a href="#research">Исследования</a><a href="#materials">Материалы</a><a href="#event">Мероприятия</a></div>
        <div><h3>Команда</h3><span aria-disabled="true" title="Будущий раздел">О компании <small>скоро</small></span><span aria-disabled="true" title="Будущий раздел">Карьера <small>скоро</small></span><a href="#contact">Связаться</a></div>
      </nav>
    </div>
    <div className="footer-lab__art" aria-hidden="true">
      <div className="footer-lab__propeller" />
    </div>
    <div className="footer-lab__bottom"><span>© 2026 WMT AI</span><span>От первой идеи — к изменениям в бизнесе</span><a href="#top">Наверх ↑</a></div>
  </footer>;
}

export default function FooterVariants({ Arrow, PlusDivider }) {
  return <div id="footer"><FooterComposition Arrow={Arrow} PlusDivider={PlusDivider} /></div>;
}
