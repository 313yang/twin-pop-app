import { getLevel, move, same, sessionKey } from './engine';
import type { Direction, Mode, Pair, Progress, Session } from './types';
export const emptyProgress=():Progress=>({version:1,nextStage:1,wins:{},swipeLearned:false,resume:null});
export type State={ready:boolean;screen:'home'|'levels'|'game';progress:Progress;session:Session|null;won:boolean;revision:number;direction:Direction|null};
export const initialState:State={ready:false,screen:'home',progress:emptyProgress(),session:null,won:false,revision:0,direction:null};
export type Action={type:'hydrate';progress:Progress}|{type:'start';mode:Mode;index:number;date:string;fresh?:boolean}|{type:'move';direction:Direction}|{type:'undo'}|{type:'reset'}|{type:'home'|'levels'|'learned'};
function updateSession(state:State,session:Session):State{return {...state,session,progress:{...state.progress,resume:session},revision:state.revision+1};}
export function reducer(state:State,action:Action):State {
  if(action.type==='hydrate')return {...state,ready:true,progress:action.progress};
  if(action.type==='home'||action.type==='levels')return {...state,screen:action.type};
  if(action.type==='learned')return {...state,progress:{...state.progress,swipeLearned:true}};
  if(action.type==='start'){
    const level=getLevel(action.mode,action.index,action.date),prior=state.progress.resume;
    const session:Session=!action.fresh&&prior&&prior.mode===action.mode&&prior.index===action.index&&(action.mode!=='daily'||prior.date===action.date)?prior:{mode:action.mode,index:action.index,date:action.date,position:[...level.start],history:[]};
    return updateSession({...state,screen:'game',won:false,direction:null},session);
  }
  if(!state.session||state.screen!=='game')return state;
  const s=state.session,l=getLevel(s.mode,s.index,s.date);
  if(action.type==='reset')return updateSession({...state,won:false,direction:null},{...s,position:[...l.start],history:[]});
  if(state.won)return state;
  if(action.type==='undo'){
    if(!s.history.length)return state;
    return updateSession({...state,direction:null},{...s,position:s.history[s.history.length-1],history:s.history.slice(0,-1)});
  }
  if(action.type==='move'){
    const position=move(l,s.position,action.direction);
    if(same(position,s.position))return {...state,revision:state.revision+1,direction:action.direction};
    const session={...s,position,history:[...s.history,s.position]};
    let next=updateSession({...state,direction:action.direction},session);
    if(same(position,l.goals)){const key=sessionKey(s);next={...next,won:true,progress:{...next.progress,resume:null,nextStage:s.mode==='campaign'?Math.min(240,Math.max(state.progress.nextStage,s.index+1)):state.progress.nextStage,wins:{...state.progress.wins,[key]:Math.min(state.progress.wins[key]??Infinity,session.history.length)}}};}
    return next;
  }
  return state;
}
export function parseProgress(raw:string|null):Progress {
  if(!raw)return emptyProgress();
  try {
    const p=JSON.parse(raw);if(p.version!==1)return emptyProgress();
    const clean=emptyProgress();clean.nextStage=Number.isInteger(p.nextStage)?Math.max(1,Math.min(240,p.nextStage)):1;clean.swipeLearned=p.swipeLearned===true;
    if(p.wins&&typeof p.wins==='object')for(const [k,v] of Object.entries(p.wins)){if(/^(campaign-\d{1,3}|daily-\d{4}-\d{2}-\d{2})$/.test(k)&&typeof v==='number'&&Number.isInteger(v)&&v>0)clean.wins[k]=v;}
    const r=p.resume;if(!r||!['campaign','daily'].includes(r.mode)||!Number.isInteger(r.index)||r.index<1||r.index>240||!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||!Array.isArray(r.history)||r.history.length>10000)return clean;
    const l=getLevel(r.mode,r.index,r.date),valid=(a:unknown):a is Pair=>Array.isArray(a)&&a.length===2&&a.every((v,b)=>Number.isInteger(v)&&v>=0&&v<l.n*l.n&&!l.boards[b][v]);
    if(!valid(r.position)||!r.history.every(valid))return clean;
    let prior=l.start;for(const pos of [...r.history,r.position]){if(!same(prior,pos)&&![0,1,2,3].some(d=>same(move(l,prior,d as Direction),pos)))return clean;prior=pos;}
    if(!same(r.position,l.goals))clean.resume={mode:r.mode,index:r.index,date:r.date,position:r.position,history:r.history};
    return clean;
  }catch{return emptyProgress();}
}
