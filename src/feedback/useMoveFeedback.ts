import {useEffect,useRef} from 'react';
import {feedback} from './feedback';
import type {State} from '../game/state';
import type {Level} from '../game/types';

/** 이동 결과에 맞는 효과음·진동: 이동 / 벽에 막힘 / 꽃봉오리 도착 / 클리어 */
export function useMoveFeedback(state:State,level:Level|null){
  const prev=useRef<{revision:number;moves:number;arrived:number}|null>(null);
  useEffect(()=>{
    const s=state.session;
    if(!s||!level||state.screen!=='game'){prev.current=null;return}
    const moves=s.history.length,arrived=s.position.filter((p,b)=>p===level.goals[b]).length,last=prev.current;
    prev.current={revision:state.revision,moves,arrived};
    if(!last||state.direction===null||last.revision===state.revision)return;
    if(state.won)feedback('clear');
    else if(moves<=last.moves)feedback('bump');
    else if(arrived>last.arrived)feedback('bloom');
    else feedback('move');
  },[state.revision,state.screen,state.won,state.direction,state.session,level]);
}
