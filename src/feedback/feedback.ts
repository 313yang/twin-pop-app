import * as Haptics from 'expo-haptics';
import {createAudioPlayer,type AudioPlayer} from 'expo-audio';
import {MAX_VOLUME,getSettings} from '../settings/settingsStore';

export type Sfx='move'|'bump'|'bloom'|'clear'|'fanfare';
const SOURCES:Record<Sfx,number>={
  move:require('../../assets/sounds/move.wav'),
  bump:require('../../assets/sounds/bump.wav'),
  bloom:require('../../assets/sounds/bloom.wav'),
  clear:require('../../assets/sounds/clear.wav'),
  fanfare:require('../../assets/sounds/fanfare.wav'),
};
const VOLUME:Record<Sfx,number>={move:.35,bump:.5,bloom:.6,clear:.7,fanfare:.8};
const HAPTIC:Record<Sfx,()=>Promise<void>>={
  move:()=>Haptics.selectionAsync(),
  bump:()=>Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  bloom:()=>Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  clear:()=>Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  fanfare:()=>Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
};

const players:Partial<Record<Sfx,AudioPlayer>>={};
function player(name:Sfx){
  if(!players[name]){try{players[name]=createAudioPlayer(SOURCES[name])}catch{return null}}
  return players[name]!;
}

/** 설정에 따라 효과음(볼륨 단계 반영) + 진동.
 * 끝까지 재생된 플레이어는 끝 위치에 멈춰 있으므로, 처음으로 되감기가 끝난 뒤 재생해야 다시 소리가 난다. */
export function feedback(name:Sfx){
  const {sfxVolume,haptics}=getSettings();
  if(sfxVolume>0){const p=player(name);if(p){p.volume=VOLUME[name]*sfxVolume/MAX_VOLUME;p.pause();p.seekTo(0).then(()=>p.play(),()=>p.play())}}
  if(haptics)HAPTIC[name]().catch(()=>{});
}
