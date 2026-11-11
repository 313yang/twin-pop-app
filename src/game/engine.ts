import { levels } from './levels';
import type { Direction, Level, Pair, Session } from './types';
const directions: Pair[] = [[0,-1],[1,0],[0,1],[-1,0]];
export const same = (a: Pair,b: Pair) => a[0]===b[0] && a[1]===b[1];
export function move(level: Level, position: Pair, direction: Direction): Pair {
  return position.map((p,b) => {
    const d = b===1 && level.reverse ? (direction+2)%4 : direction;
    const [dx,dy]=directions[d],x=p%level.n+dx,y=Math.floor(p/level.n)+dy;
    return x<0||y<0||x>=level.n||y>=level.n||level.boards[b][y*level.n+x] ? p:y*level.n+x;
  }) as Pair;
}
export function solve(level: Level, start: Pair, goal=level.goals): Direction[] | null {
  const queue=[start], seen=new Map<string,{parent:string;direction:Direction}|null>([[start.join(','),null]]);
  for(let i=0;i<queue.length;i++){
    const state=queue[i],key=state.join(',');
    if(same(state,goal)){const path:Direction[]=[];let at=key;while(seen.get(at)){const entry=seen.get(at)!;path.push(entry.direction);at=entry.parent;}return path.reverse();}
    for(let d=0;d<4;d++){const next=move(level,state,d as Direction),k=next.join(',');if(!seen.has(k)){seen.set(k,{parent:key,direction:d as Direction});queue.push(next);}}
  }
  return null;
}
export function koreaDate(date=new Date()): string {const kst=new Date(date.getTime()+9*60*60*1000);return kst.toISOString().slice(0,10);}
export const sessionKey=(s:Session)=>s.mode==='daily'?`daily-${s.date}`:`campaign-${s.index}`;
const dailyCache=new Map<string,Level>();
export function getLevel(mode:Session['mode'],index:number,date:string): Level {
  if(mode==='campaign')return levels[Math.max(0,Math.min(239,index-1))];
  if(dailyCache.has(date))return dailyCache.get(date)!;
  let seed=Number(date.replaceAll('-',''))>>>0;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let attempt=0;attempt<100;attempt++){
    const n=5,boards=[0,1].map(()=>Array.from({length:25},()=>random()<.25?1:0)) as Level['boards'];
    const start=boards.map(b=>{const free=b.flatMap((v,i)=>v?[]:[i]);return free[Math.floor(random()*free.length)];}) as Pair;
    if(start.some(p=>p===undefined))continue;
    const level:Level={n,boards,start,goals:[...start],reverse:false,par:0};
    let pos:Pair=[...start];for(let i=0;i<35;i++)pos=move(level,pos,Math.floor(random()*4) as Direction);
    level.goals=pos;const path=solve(level,start);if(path&&path.length>=8&&path.length<=14&&pos.every((p,b)=>p!==start[b])){level.par=path.length;dailyCache.set(date,level);return level;}
  }
  const fallback=levels[30+(Number(date.replaceAll('-',''))%30)];dailyCache.set(date,fallback);return fallback;
}
