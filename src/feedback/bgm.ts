import {AppState} from 'react-native';
import {createAudioPlayer,setAudioModeAsync,type AudioPlayer} from 'expo-audio';
import {MAX_VOLUME,getSettings,subscribeSettings} from '../settings/settingsStore';

/** 배경음 파일. 지금은 1초 무음 임시 파일 → 받은 배경음으로 같은 이름 교체(형식이 다르면 확장자만 수정) */
const BGM_SOURCE=require('../../assets/sounds/bgm.wav');
/** 볼륨 5단계일 때의 실제 볼륨 (효과음보다 작게) */
const BGM_MAX=.5;

let player:AudioPlayer|null=null;
let active=true;

function apply(){
  if(!player)return;
  const {bgmVolume}=getSettings();
  player.volume=BGM_MAX*bgmVolume/MAX_VOLUME;
  if(bgmVolume>0&&active)player.play();else player.pause();
}

/** 앱 시작 시 한 번: 반복 재생 + 설정 변경·백그라운드 전환에 반응 */
export function initBgm(){
  if(player)return;
  try{player=createAudioPlayer(BGM_SOURCE);player.loop=true}catch{player=null;return}
  setAudioModeAsync({playsInSilentMode:false,interruptionMode:'mixWithOthers'}).catch(()=>{});
  subscribeSettings(apply);
  AppState.addEventListener('change',s=>{active=s==='active';apply()});
  apply();
}
