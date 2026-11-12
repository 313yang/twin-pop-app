import {useCallback,useEffect,useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isRewardedReady,showHintAd,subscribeRewardedReady} from '../ads/rewarded';

const STORAGE='twinpop.hints.v1';
export const FREE_HINTS_PER_DAY=3;
type Saved={date:string;used:number};

/** 하루 무료 힌트 수 관리 + 소진 시 보상형 광고로 1회 충전 */
export function useHintQuota(today:string){
  const [used,setUsed]=useState(0);
  const [adReady,setAdReady]=useState(isRewardedReady);
  useEffect(()=>subscribeRewardedReady(setAdReady),[]);
  useEffect(()=>{AsyncStorage.getItem(STORAGE).then(raw=>{const s:Saved|null=raw?JSON.parse(raw):null;setUsed(s?.date===today?s.used:0)}).catch(()=>setUsed(0))},[today]);
  const persist=(n:number)=>{setUsed(n);AsyncStorage.setItem(STORAGE,JSON.stringify({date:today,used:n})).catch(()=>{})};
  const remaining=Math.max(0,FREE_HINTS_PER_DAY-used);

  /** 무료 힌트가 있으면 차감 후 reveal, 없으면 광고 시청 완료 후 reveal */
  const requestHint=useCallback((reveal:()=>void)=>{
    if(remaining>0){persist(used+1);reveal();return}
    showHintAd(reveal);
  },[remaining,used,today]);

  return {remaining,adReady,requestHint};
}
