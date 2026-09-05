import React from 'react';

export default function OrangeMaterial() {
  return <svg width="0" height="0" aria-hidden="true" style={{position:'absolute',pointerEvents:'none'}}><defs>
    <linearGradient id="wmt-orange-ramp" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#ff7605"/><stop offset=".5" stopColor="#ff5331"/><stop offset="1" stopColor="#ff300d"/></linearGradient>
    <pattern id="wmt-orange-material" width="1" height="1" viewBox="0 0 64 64" preserveAspectRatio="none">
      <rect width="64" height="64" fill="url(#wmt-orange-ramp)"/>
      {Array.from({length:4096},(_,i)=>{
        const x=i%64,y=Math.floor(i/64);
        const shade=((x+11)*73856093 ^ (y+17)*19349663)>>>0;
        return <rect key={i} x={x} y={y} width="1" height="1" fill={shade%2?'white':'black'} opacity={[0,.025,.035,.018,.025,.012,.04,.05][shade%8]}/>;
      })}
    </pattern>
  </defs></svg>;
}
