import React, { useId } from 'react';
import './situation-motion.css';

// Local SVG materials keep every illustration self-contained, crisp, and static.
function Scene({ type, wide = false, small = false, children }) {
  const id = `bento-${useId().replace(/:/g, '')}`;
  const paint = name => `url(#${id}-${name})`;
  return <svg className={small ? 'bento-effect-art' : `situation-motion situation-motion--${type}${wide ? ' situation-motion--wide' : ''}`} viewBox={small ? '0 0 80 80' : wide ? '0 0 640 260' : '0 0 400 250'} fill="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2=".8" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#787981" stopOpacity=".44"/><stop offset=".45" stopColor="#3c3d44" stopOpacity=".8"/><stop offset="1" stopColor="#24252b" stopOpacity=".95"/></linearGradient>
      <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#dfe1ed" stopOpacity=".55"/><stop offset=".4" stopColor="#90929f" stopOpacity=".12"/><stop offset="1" stopColor="#b6b8c4" stopOpacity=".3"/></linearGradient>
      <linearGradient id={`${id}-orange`} x1="0" y1="1" x2=".8" y2="0"><stop stopColor="#ff8b32"/><stop offset=".52" stopColor="#ff5331"/><stop offset="1" stopColor="#ffb99a"/></linearGradient>
      <linearGradient id={`${id}-dim`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#9496a3" stopOpacity=".6"/><stop offset="1" stopColor="#474851" stopOpacity=".2"/></linearGradient>
      <radialGradient id={`${id}-light`}><stop stopColor="#ff673c" stopOpacity=".28"/><stop offset="1" stopColor="#ff5331" stopOpacity="0"/></radialGradient>
      <filter id={`${id}-shadow`} x="-50%" y="-50%" width="200%" height="220%"><feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#070709" floodOpacity=".5"/></filter>
      <filter id={`${id}-glow`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="7"/></filter>
    </defs>
    {children(paint)}
  </svg>;
}
function Plate({ p, x, y, w, h, r = 12, children, ...props }) {
  return <g {...props}><rect x={x} y={y+3} width={w} height={h} rx={r} fill="#1c1d22"/><rect x={x} y={y} width={w} height={h} rx={r} fill={p('glass')} stroke={p('edge')}/><path d={`M${x+r} ${y+3}H${x+w-r}`} stroke="#fff" strokeOpacity=".13"/>{children}</g>;
}
function Lines({ x, y, width = 40 }) { return <g stroke="#c4c6d3" strokeOpacity=".3" strokeWidth="3" strokeLinecap="round"><path d={`M${x} ${y}h${width}m-${width} 9h${width*.65}`}/></g>; }
function RouteScene() {
  return <Scene type="route">{p=><>
    <ellipse cx="225" cy="148" rx="167" ry="105" fill={p('light')}/>
    <g transform="translate(0 3) rotate(-7 200 130)">
      <Plate p={p} x={57} y={51} w={284} h={159} r={18} opacity=".25"/>
      <Plate p={p} x={49} y={37} w={284} h={159} r={18} opacity=".5"/>
      <Plate p={p} x={41} y={23} w={284} h={159} r={18} filter={p('shadow')}>
        <g stroke="#a8abb9" strokeOpacity=".08">{[90,130,170,210,250,290].map(x=><path key={x} d={`M${x} 45v119`}/>)}{[64,94,124,154].map(y=><path key={y} d={`M59 ${y}h247`}/>)}</g>
        <path d="M81 144H126Q142 144 142 128V104Q142 88 158 88H181Q198 88 198 72V55M198 88H244V136H302" stroke="#858894" strokeOpacity=".4" strokeWidth="2" strokeDasharray="4 5"/>
        <path d="M81 144H126Q142 144 142 128V104Q142 88 158 88H251" stroke="#ff683d" strokeWidth="10" opacity=".35" filter={p('glow')}/>
        <path d="M81 144H126Q142 144 142 128V104Q142 88 158 88H251" stroke={p('orange')} strokeWidth="3"/>
        {[ [81,144],[142,110],[198,55],[244,136] ].map(([x,y],i)=><g key={x}><circle cx={x} cy={y} r="8" fill="#303138" stroke={i<2?'#ff875d':'#656772'}/><circle cx={x} cy={y} r="2.5" fill={i<2?'#ffad86':'#848693'}/></g>)}
      </Plate>
    </g>
    <g filter={p('shadow')}><Plate p={p} x={238} y={42} w={74} h={77} r={19}/><rect x="246" y="50" width="58" height="59" rx="14" fill={p('orange')}/><path d="M264 92V65m0 1h23l-6 8 6 8h-23" stroke="white" strokeWidth="2.5"/></g>
    <Plate p={p} x={99} y={175} w={153} h={35} r={17} filter={p('shadow')}><circle cx="118" cy="192" r="4" fill="#ff8153"/><path d="M132 192h30m8 0h16m8 0h39" stroke="#b4b6c2" strokeOpacity=".55" strokeWidth="3"/><circle cx="166" cy="192" r="2" fill="#ffd0b4"/></Plate>
  </>}</Scene>;
}
function SignalScene() {
  return <Scene type="signal">{p=><>
    <ellipse cx="206" cy="121" rx="151" ry="112" fill={p('light')}/>
    <g opacity=".3" transform="rotate(-22 120 140)"><Plate p={p} x={60} y={73} w={91} h={123}/></g>
    <g transform="rotate(-12 145 138)"><Plate p={p} x={100} y={55} w={91} h={136} filter={p('shadow')}><Lines x={116} y={78}/><rect x="116" y="107" width="58" height="48" rx="5" fill={p('dim')} opacity=".35"/></Plate></g>
    <g transform="rotate(13 265 132)"><Plate p={p} x={233} y={60} w={87} h={132}><Lines x={248} y={84}/><Lines x={248} y={132} width={31}/></Plate></g>
    <Plate p={p} x={155} y={36} w={101} h={158} filter={p('shadow')}><rect x="164" y="45" width="83" height="140" rx="8" fill="#ff6836" fillOpacity=".07"/><Lines x={174} y={59} width={42}/><path d="M175 160h59m-59 9h35" stroke="#ffaf8a" strokeOpacity=".6" strokeWidth="3"/></Plate>
    <circle cx="208" cy="112" r="45" fill="#ff6836" opacity=".2" filter={p('glow')}/>
    <circle cx="208" cy="112" r="48" fill="#28292f" fillOpacity=".74" stroke={p('edge')} strokeWidth="7" filter={p('shadow')}/>
    <circle cx="208" cy="112" r="40" fill={p('light')} stroke="#ff9a70" strokeOpacity=".65"/>
    <path d="M177 98a35 35 0 0 1 45-17" stroke="white" strokeOpacity=".4" strokeWidth="2"/>
    <path d="m194 113 10 10 20-24" stroke={p('orange')} strokeWidth="5"/>
    <path d="m244 149 28 31" stroke="#1a1b20" strokeWidth="17"/><path d="m244 148 29 31" stroke={p('dim')} strokeWidth="12"/>
    <path d="M65 216H326" stroke="#b0b2c0" strokeOpacity=".1"/><path d="M165 216h85" stroke={p('orange')} strokeWidth="2"/>
  </>}</Scene>;
}
function SyncScene() {
  return <Scene type="sync">{p=><>
    <ellipse cx="200" cy="149" rx="152" ry="99" fill={p('light')}/>
    <g stroke="#80838f" strokeOpacity=".18"><ellipse cx="200" cy="159" rx="132" ry="54"/><ellipse cx="200" cy="159" rx="104" ry="40"/><path d="M47 159h306M200 97v122"/></g>
    <path d="M99 107v36q0 16 16 16h49M200 74v67M301 107v36q0 16-16 16h-49" stroke="#ff6a3e" strokeOpacity=".3" strokeWidth="8" filter={p('glow')}/>
    <path d="M99 107v36q0 16 16 16h49M200 74v67M301 107v36q0 16-16 16h-49" stroke={p('orange')} strokeWidth="2"/>
    {[66,167,268].map((x,i)=><Plate key={x} p={p} x={x} y={i===1?20:46} w={66} h={68} r={16} filter={p('shadow')}>
      {i===0?<g stroke="#d6d8e2" strokeWidth="2"><circle cx={x+33} cy="70" r="7"/><path d={`M${x+20} 96v-4a13 10 0 0 1 26 0v4Z`}/></g>:i===1?<g stroke="#d6d8e2" strokeWidth="2"><rect x={x+24} y="36" width="18" height="12" rx="3"/><path d={`M${x+33} 48v9m-14 0h28m-28 0v9m28-9v9`}/></g>:<g stroke="#d6d8e2" strokeWidth="2"><ellipse cx={x+33} cy="67" rx="14" ry="5"/><path d={`M${x+19} 67v23c0 7 28 7 28 0V67m-28 12c0 7 28 7 28 0`}/></g>}
    </Plate>)}
    <Plate p={p} x={157} y={133} w={86} h={69} r={19} filter={p('shadow')}/>
    <Plate p={p} x={163} y={124} w={74} h={66} r={16}/>
    <rect x="172" y="131" width="56" height="48" rx="12" fill={p('orange')}/>
    <g stroke="white" strokeWidth="2"><path d="m187 147 13-7 13 7v15l-13 7-13-7Zm0 0 13 8 13-8m-13 8v14"/></g>
    {[126,274].map(x=><circle key={x} cx={x} cy="159" r="3" fill="#ffd0b0"/>)}
  </>}</Scene>;
}
export function ResultMotion() {
  return <Scene type="result" wide>{p=><>
    <ellipse cx="359" cy="139" rx="236" ry="118" fill={p('light')}/>
    <g transform="rotate(-10 161 139)" opacity=".5"><Plate p={p} x={89} y={52} w={123} h={150}/></g>
    <Plate p={p} x={113} y={60} w={123} h={151} filter={p('shadow')}><circle cx="130" cy="77" r="2" fill="#8a8c98"/><circle cx="138" cy="77" r="2" fill="#8a8c98"/><Lines x={130} y={100} width={74}/><Lines x={130} y={136} width={57}/><rect x="130" y="172" width="44" height="18" rx="4" fill={p('dim')}/></Plate>
    <path d="M228 144h71" stroke="#ff7949" strokeWidth="2" strokeDasharray="3 6"/><circle cx="269" cy="144" r="17" fill="#35363b" stroke={p('edge')}/><path d="m263 144 4 4 8-9" stroke="#ffc7a4" strokeWidth="2"/>
    <g transform="rotate(-4 419 130)">
      <Plate p={p} x={296} y={30} w={255} h={189} r={17} filter={p('shadow')}>
        <Lines x={315} y={50} width={68}/><g stroke="#a8aab5" strokeOpacity=".1">{[91,124,157,190].map(y=><path key={y} d={`M314 ${y}h217`}/>)}</g>
        {[ [328,154,27,39],[373,132,27,61],[418,105,27,88],[463,77,34,116] ].map(([x,y,w,h],i)=><g key={x}><rect x={x+4} y={y+4} width={w} height={h} rx="6" fill="#14151a" opacity=".5"/><rect x={x} y={y} width={w} height={h} rx="6" fill={i===3?p('orange'):p('dim')} stroke={i===3?'#ffba92':p('edge')} strokeOpacity=".55"/><path d={`M${x+5} ${y+4}h${w-10}`} stroke="white" strokeOpacity=".2"/></g>)}
        <path d="M327 137C352 137 357 112 382 112S414 85 437 85 467 56 500 56" stroke={p('orange')} strokeWidth="2"/>
        {[[327,137],[382,112],[437,85],[500,56]].map(([x,y])=><circle key={x} cx={x} cy={y} r="4" fill="#292a30" stroke="#ffbb93" strokeWidth="2"/>)}
      </Plate>
    </g>
    <Plate p={p} x={437} y={184} w={110} h={39} r={19} filter={p('shadow')}><circle cx="458" cy="203" r="9" fill={p('orange')}/><path d="m454 203 3 3 5-6" stroke="#fff" strokeWidth="1.5"/><path d="M476 199h49m-49 8h31" stroke="#d0d2dc" strokeOpacity=".5" strokeWidth="3"/></Plate>
  </>}</Scene>;
}
export function EffectVisual({ type }) {
  return <Scene small>{p=><>
    <circle cx="40" cy="40" r="37" fill={p('light')}/>
    {type===0?<>{[0,1,2].map(i=><Plate key={i} p={p} x={12+i*5} y={20+i*13} w={49-i*10} h={15} r={5}/>)}<path d="M61 19v34m-6-6 6 6 6-6" stroke={p('orange')} strokeWidth="3"/></>:type===1?<>{[0,1,2].map(i=><rect key={i} x={13+i*18} y={48-i*14} width="12" height={20+i*14} rx="4" fill={i===2?p('orange'):p('glass')} stroke={p('edge')}/>)}<path d="m15 34 17-12 15 2 16-13" stroke="#ffb895" strokeWidth="2"/></>:<><path d="M22 41h15q5 0 5-5V23h15M42 36v21h15" stroke={p('orange')} strokeWidth="2"/>{[[11,31],[54,12],[54,48]].map(([x,y],i)=><rect key={x+y} x={x} y={y} width="20" height="20" rx="6" fill={i===0?p('glass'):p('orange')} stroke={p('edge')}/>)}</>}
  </>}</Scene>;
}
export default function SituationMotion({ type }) {
  const Component = [RouteScene, SignalScene, SyncScene][type];
  return Component ? <Component /> : null;
}
