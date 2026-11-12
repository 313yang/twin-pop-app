import React from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
export type IconName='back'|'pause'|'help'|'undo'|'reset'|'hint'|'heart'|'swap'|'check'|'right'|'up'|'down'|'left'|'calendar'|'hand'|'star'|'starEmpty'|'lock';
const names:Record<IconName,string>={back:'angle-left',pause:'pause',help:'question',undo:'undo-alt',reset:'redo-alt',hint:'lightbulb',heart:'heart',swap:'exchange-alt',check:'check',right:'arrow-right',up:'arrow-up',down:'arrow-down',left:'arrow-left',calendar:'calendar-alt',hand:'hand-point-up',star:'star',starEmpty:'star',lock:'lock'};
export function Icon({name,size=24,color='#9c8a72'}:{name:IconName;size?:number;color?:string}){
 return <FontAwesome5 name={names[name]} size={size} color={color} solid={name==='star'} accessible={false}/>;
}
