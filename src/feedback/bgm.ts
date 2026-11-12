import {AppState} from 'react-native';
import {createAudioPlayer,setAudioModeAsync,type AudioPlayer} from 'expo-audio';
import {MAX_VOLUME,getSettings,subscribeSettings} from '../settings/settingsStore';

type BgmTrack='home'|'stage';
const SOURCES:Record<BgmTrack,number>={
  home:require('../../assets/sounds/home.mp3'),
  stage:require('../../assets/sounds/stage.mp3'),
};
const BGM_MAX=.5;
const players:Partial<Record<BgmTrack,AudioPlayer>>={};
let track:BgmTrack='home';
let active=AppState.currentState==='active';
let ready=false;
let initialization:Promise<void>|null=null;

function apply(){
  if(!ready)return;
  const {bgmVolume}=getSettings();
  // 이전 곡부터 멈춰 화면 전환 시 두 BGM이 겹치지 않게 한다.
  for(const name of ['home','stage'] as const){
    if(name!==track||!active||bgmVolume===0)players[name]?.pause();
  }
  if(!active||bgmVolume===0)return;
  let player=players[track];
  if(!player){
    try{player=createAudioPlayer(SOURCES[track]);player.loop=true;players[track]=player}
    catch{return}
  }
  player.volume=BGM_MAX*bgmVolume/MAX_VOLUME;
  player.play();
}

/** 홈·지도는 홈 곡, 캠페인·오늘의 퍼즐은 스테이지 곡. 돌아오면 이어 재생. */
export function setBgmTrack(next:BgmTrack){
  if(track===next)return;
  track=next;
  apply();
}

/** 외부 음악 혼합 설정이 끝난 뒤에만 재생을 시작한다. */
export function initBgm():Promise<void>{
  if(initialization)return initialization;
  initialization=setAudioModeAsync({playsInSilentMode:false,interruptionMode:'mixWithOthers'})
    .then(()=>{
      active=AppState.currentState==='active';
      ready=true;
      subscribeSettings(apply);
      AppState.addEventListener('change',s=>{active=s==='active';apply()});
      apply();
    })
    .catch(()=>{initialization=null});
  return initialization;
}
