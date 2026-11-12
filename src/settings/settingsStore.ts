import {useSyncExternalStore} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE='twinpop.settings.v1';
/** 볼륨 단계 0(끔)~5(최대) */
export const VOLUME_LEVELS=[0,1,2,3,4,5] as const;
export type VolumeLevel=typeof VOLUME_LEVELS[number];
export const MAX_VOLUME=5;
export type Settings={sfxVolume:VolumeLevel;bgmVolume:VolumeLevel;haptics:boolean};
const DEFAULTS:Settings={sfxVolume:3,bgmVolume:3,haptics:true};

let current:Settings=DEFAULTS;
const listeners=new Set<()=>void>();
const emit=()=>listeners.forEach(fn=>fn());

const level=(v:unknown,fallback:VolumeLevel):VolumeLevel=>typeof v==='number'&&v>=0&&v<=MAX_VOLUME?Math.round(v) as VolumeLevel:fallback;

/** 저장값 정리 (예전 sound:true/false 설정도 이어받음) */
function parse(raw:string):Settings{
  const p=JSON.parse(raw);
  const legacy=p.sound===false?0:undefined;
  return {sfxVolume:level(p.sfxVolume??legacy,DEFAULTS.sfxVolume),bgmVolume:level(p.bgmVolume,DEFAULTS.bgmVolume),haptics:p.haptics!==false};
}

/** 앱 시작 시 저장된 설정 불러오기 */
export function loadSettings(){
  return AsyncStorage.getItem(STORAGE).then(raw=>{if(!raw)return;try{current=parse(raw);emit()}catch{}}).catch(()=>{});
}
export function getSettings(){return current}
export function updateSettings(patch:Partial<Settings>){
  current={...current,...patch};emit();
  AsyncStorage.setItem(STORAGE,JSON.stringify(current)).catch(()=>{});
}
export function subscribeSettings(fn:()=>void){listeners.add(fn);return()=>{listeners.delete(fn)}}

/** 설정 구독 훅 */
export function useSettings(){return useSyncExternalStore(subscribeSettings,getSettings)}
