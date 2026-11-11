import React from 'react';
import Svg,{Path,Rect} from 'react-native-svg';
export type IconName='back'|'pause'|'help'|'undo'|'reset'|'hint'|'heart'|'swap'|'check'|'right'|'up'|'down'|'left'|'calendar'|'hand';
const paths:Partial<Record<IconName,string>>={back:'M15 5L8 12L15 19',pause:'M8 6V18M16 6V18',help:'M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5M12 17v.1',undo:'M8 5L3 10L8 15M4 10H14a6 6 0 0 1 0 12',reset:'M19 8A8 8 0 1 0 20 15M19 3V8H14',hint:'M9 18h6M10 21h4M8 14C2 8 7 2 12 2s10 6 4 12l-1 2H9Z',heart:'M12 20S2 14 2 8a5 5 0 0 1 10-1A5 5 0 0 1 22 8c0 6-10 12-10 12Z',swap:'M5 8H20M16 4l4 4-4 4M19 16H4M8 12l-4 4 4 4',check:'M5 12l4 4L19 6',right:'M4 12H20M14 6l6 6-6 6',left:'M20 12H4M10 6l-6 6 6 6',up:'M12 20V4M6 10l6-6 6 6',down:'M12 4V20M6 14l6 6 6-6',calendar:'M7 3V7M17 3V7M4 10H20'};
export function Icon({name,size=24,color='#9c8a72'}:{name:IconName;size?:number;color?:string}){
 return <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
 {name==='calendar'&&<Rect x={3} y={5} width={18} height={16} rx={3} stroke={color} strokeWidth={1.8} fill="none"/>}
 {name==='hand'?<><Path d="M8 13V5a2 2 0 0 1 4 0v6-1a2 2 0 0 1 4 0v1a2 2 0 0 1 4 1v4c0 4-2 6-6 6h-1c-2 0-4-1-5-3l-4-5c-1-2 1-4 3-2l1 1Z" fill="#fff8eb" stroke={color} strokeWidth={1.5} strokeLinejoin="round"/><Path d="M3 5V2M1 3h4" stroke={color} strokeWidth={1.2} strokeLinecap="round"/></>:<Path d={paths[name]} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none"/>}
 </Svg>
}
