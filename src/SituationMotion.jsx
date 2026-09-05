import React from 'react';
import './situation-motion.css';

// Static illustrations share the site's orange gradient and noise material.
function MotionScene({ children, wide = false, type }) {
  return <svg className={`situation-motion situation-motion--${type}${wide ? ' situation-motion--wide' : ''}`} viewBox="0 0 400 230" fill="none" aria-hidden="true" focusable="false">{children}</svg>;
}

function RouteScene() {
  return <MotionScene type="route">
    <path className="sm-track" d="M104 148H172Q190 148 190 130V72"/>
    <path className="sm-route" pathLength="1" d="M104 148H176Q194 148 194 130V116Q194 98 212 98H294"/>
    <rect className="sm-option" x="68" y="122" width="52" height="52" rx="16"/>
    <circle className="sm-start" cx="94" cy="148" r="7"/>
    <rect className="sm-option sm-unselected" x="168" y="42" width="44" height="44" rx="14"/>
    <rect className="sm-route-step" x="171" y="125" width="30" height="30" rx="10"/>
    <g className="sm-destination">
      <rect className="sm-solid" x="272" y="68" width="60" height="60" rx="18"/>
      <path className="sm-filled-icon" d="M290 85a1.5 1.5 0 0 1 3 0v1h20l-5 8 5 8h-20v10a1.5 1.5 0 0 1-3 0Z"/>
    </g>
  </MotionScene>;
}

function SignalScene() {
  return <MotionScene type="signal">
    <g transform="rotate(-14 139 130)"><rect className="sm-option" x="103" y="82" width="72" height="96" rx="17"/><path className="sm-idea-line" d="M120 107h24m-24 13h17"/></g>
    <g transform="rotate(14 261 130)"><rect className="sm-option" x="225" y="82" width="72" height="96" rx="17"/><path className="sm-idea-line" d="M250 107h24m-17 13h17"/></g>
    <g className="sm-choice">
      <rect className="sm-solid" x="160" y="55" width="80" height="108" rx="19"/>
      <path className="sm-filled-icon" d="M191 118v-6c-15-11-9-31 9-31s24 20 9 31v6Z M193 123h14a2 2 0 0 1 0 4h-14a2 2 0 0 1 0-4Z M195 131h10a5 5 0 0 1-10 0Z"/>
    </g>
  </MotionScene>;
}

function SyncScene() {
  return <MotionScene type="sync">
    <path className="sm-piece sm-piece--left" d="M94 82H160V100C180 90 180 140 160 130V148H94Q80 148 80 134V96Q80 82 94 82Z"/>
    <path className="sm-solid" d="M166 82H234V100C254 90 254 140 234 130V148H166V136C186 146 186 84 166 94Z"/>
    <path className="sm-piece sm-piece--right" d="M240 82H306Q320 82 320 96V134Q320 148 306 148H240V136C260 146 260 84 240 94Z"/>
  </MotionScene>;
}

export function ResultMotion() {
  return <MotionScene wide type="result">
    <g className="sm-papers">
      <rect className="sm-paper sm-paper--back" x="78" y="62" width="72" height="92" rx="12" transform="rotate(-12 114 108)"/>
      <rect className="sm-paper" x="94" y="76" width="72" height="92" rx="12"/>
      <path className="sm-paper-lines" d="M112 102h36m-36 13h25"/>
    </g>
    <path className="sm-result-arrow" d="M190 122h32m-9-9 9 9-9 9"/>
    <g className="sm-outcome">
      <path className="sm-chart-baseline" d="M247 169H341"/>
      <rect className="sm-bar sm-bar--a" x="250" y="132" width="23" height="31" rx="6"/>
      <rect className="sm-bar sm-bar--b" x="283" y="104" width="23" height="59" rx="6"/>
      <rect className="sm-solid sm-bar--c" x="316" y="70" width="23" height="93" rx="6"/>
    </g>
  </MotionScene>;
}

export default function SituationMotion({ type }) {
  const Scene = [RouteScene, SignalScene, SyncScene][type];
  return Scene ? <Scene /> : null;
}
