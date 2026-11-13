import {AppState} from 'react-native';
import {createAudioPlayer,setAudioModeAsync,type AudioPlayer} from 'expo-audio';
import {MAX_VOLUME,getSettings,subscribeSettings} from '../settings/settingsStore';
import {AudioSession} from '../../modules/audio-session';

type BgmTrack='home'|'stage';
const SOURCES:Record<BgmTrack,number>={
  home:require('../../assets/sounds/home.mp3'),
  stage:require('../../assets/sounds/stage.mp3'),
};
const BGM_MAX=.5;
/** 곡마다 원본 음량 차이 보정 (홈 곡이 커서 낮춤) */
const TRACK_GAIN:Record<BgmTrack,number>={home:.6,stage:1};
const players:Partial<Record<BgmTrack,AudioPlayer>>={};
let track:BgmTrack='home';
let active=AppState.currentState==='active';
let ready=false;
/** 다른 앱 음악이 재생 중이면 배경음을 이 비율로 낮춤 */
const OTHER_AUDIO_GAIN=.2;
/** 다른 음악 재생 여부 확인 주기 (재생/정지 알림을 못 받는 경우 대비) */
const OTHER_AUDIO_POLL_MS=3000;
let otherAudio=false;
function checkOtherAudio(){
  let next=false;try{next=!!AudioSession?.isOtherAudioPlaying()}catch{}
  if(next!==otherAudio){otherAudio=next;apply()}
}
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
  player.volume=BGM_MAX*TRACK_GAIN[track]*(otherAudio?OTHER_AUDIO_GAIN:1)*bgmVolume/MAX_VOLUME;
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
      AppState.addEventListener('change',s=>{active=s==='active';if(active)checkOtherAudio();apply()});
      AudioSession?.addListener('onOtherAudioChange',checkOtherAudio);
      setInterval(()=>{if(active)checkOtherAudio()},OTHER_AUDIO_POLL_MS);
      checkOtherAudio();
      apply();
    })
    .catch(()=>{initialization=null});
  return initialization;
}
