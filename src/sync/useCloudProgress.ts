import {useEffect,useRef,type Dispatch} from 'react';
import {ICloudKV} from '../../modules/icloud-kv';
import {mergeProgress,sameCloud,toCloud,type CloudProgress} from '../game/progressMerge';
import type {Action,State} from '../game/state';

const KEY='twinpop.progress.v1';

function readCloud():CloudProgress|null{
  try{const raw=ICloudKV?.getString(KEY);return raw?JSON.parse(raw):null}catch{return null}
}
function writeCloud(p:CloudProgress){try{ICloudKV?.setString(KEY,JSON.stringify(p))}catch{}}

/** iCloud 사용 가능 여부 (설정 화면 표시용) */
export function cloudAvailable(){try{return !!ICloudKV?.isAvailable()}catch{return false}}

/** 진행 기록을 iCloud 키-값 저장소와 동기화: 시작 시 병합, 변경 시 업로드, 다른 기기 변경 수신 */
export function useCloudProgress(state:State,dispatch:Dispatch<Action>){
  const progress=useRef(state.progress);progress.current=state.progress;
  const merged=useRef(false);

  const pull=()=>{
    const cloud=readCloud(),next=mergeProgress(progress.current,cloud);
    if(!sameCloud(toCloud(next),toCloud(progress.current)))dispatch({type:'hydrate',progress:next});
    if(!cloud||!sameCloud(toCloud(next),cloud))writeCloud(toCloud(next));
  };

  // 로컬 기록을 불러온 직후 한 번 병합
  useEffect(()=>{
    if(!state.ready||merged.current||!ICloudKV)return;
    merged.current=true;ICloudKV.synchronize();pull();
    const sub=ICloudKV.addListener('onChange',pull);
    return()=>sub.remove();
  },[state.ready]);

  // 클리어 기록이 바뀌면 업로드
  const cloudPart=JSON.stringify(toCloud(state.progress));
  useEffect(()=>{if(merged.current&&ICloudKV)writeCloud(JSON.parse(cloudPart))},[cloudPart]);
}
