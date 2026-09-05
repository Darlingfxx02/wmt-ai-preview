import React from 'react';
import './HeroGalaxy.css';

// Deliberate positions keep the central wordmark quieter than the edges.
const STARS = [
  [46,34,7,0],[92,102,10,1.7],[152,24,5,3.1],[197,112,6,.8],
  [250,39,9,2.4],[305,119,5,4],[348,22,6,1.2],[408,108,8,3.4],
  [475,29,5,2],[536,119,6,.4],[606,22,8,3.7],[673,112,5,1.5],
  [717,35,7,4.4],[774,119,9,2.7],[833,27,5,.6],[945,107,8,3.9],
  [976,43,6,2.3],[27,115,4,4.7],
];
const DOTS = [[66,65,3],[127,128,2],[180,54,3],[224,78,2],[283,17,2],
  [329,76,3],[373,132,2],[441,47,2],[492,100,3],[568,44,2],[630,81,3],
  [690,16,2],[752,74,3],[808,91,2],[857,126,3],[917,20,2],[966,72,3]];

export default function HeroGalaxy({ active }) {
  return <span className={`hero-galaxy vector-space${active ? ' is-active' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 1000 145" preserveAspectRatio="xMidYMid slice">
      <path fill="#000" d="M0 0h1000v145H0z" />
      {DOTS.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%4===0?1.15:.65} fill="#8f959d" opacity={i%3===0?.65:.32} />)}
      <g className="space-planet-drift">
        <g transform="translate(118 71) rotate(-23)">
          <ellipse rx="65" ry="18" fill="none" stroke="#111323" strokeWidth="13" />
          <circle r="32" fill="#c78057" stroke="#101321" strokeWidth="3" />
          <path d="M-28-12q28 15 57 5M-31 3q34 18 59 9" fill="none" stroke="#a15f48" strokeWidth="7" />
          <path d="M-64 0c0 24 128 24 128 0" fill="none" stroke="#ddba83" strokeWidth="6" strokeLinecap="round" />
        </g>
      </g>
      <g className="space-moon-drift">
        <circle cx="885" cy="69" r="26" fill="#8b9fae" stroke="#111323" strokeWidth="3" />
        <path d="M888 44a26 26 0 0 1 0 50q18-24 0-50" fill="#657688" />
        <circle cx="874" cy="59" r="6" fill="#63798d" />
        <circle cx="889" cy="78" r="8" fill="#63798d" />
        <circle cx="875" cy="83" r="3" fill="#111323" />
      </g>
      {STARS.map(([x,y,size,delay],i)=><g key={i} transform={`translate(${x} ${y})`}>
        <path className="space-twinkle" style={{animationDelay:`-${delay}s`,animationDuration:`${4.5+(i%3)*.7}s`}}
          d={`M0 ${-size} Q${size*.18} ${-size*.18} ${size} 0 Q${size*.18} ${size*.18} 0 ${size} Q${-size*.18} ${size*.18} ${-size} 0 Q${-size*.18} ${-size*.18} 0 ${-size}Z`}
          fill={i%3===0?'#c8cdd5':'#858d98'} />
      </g>)}
      <g className="space-comet"><path d="M-80 0h76" stroke="#6d7683" strokeWidth=".8" strokeLinecap="round" />
        <path d="m0-4 1 3 4 1-4 1-1 4-1-4-4-1 4-1Z" fill="#e3e7ed" />
      </g>
      <g className="space-comet space-comet--second"><path d="M-60 0h45" stroke="#757e8b" strokeWidth=".7" strokeLinecap="round" /><circle r="1.5" fill="#e3e7ed" /></g>
    </svg>
  </span>;
}
