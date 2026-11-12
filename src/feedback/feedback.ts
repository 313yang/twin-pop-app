import * as Haptics from 'expo-haptics';
import {createAudioPlayer,type AudioPlayer} from 'expo-audio';
import {MAX_VOLUME,getSettings} from '../settings/settingsStore';

export type Sfx='move'|'bump'|'bloom'|'clear';
const SOURCES:Record<Sfx,number>={
  move:require('../../assets/sounds/move.wav'),
  bump:require('../../assets/sounds/bump.wav'),
  bloom:require('../../assets/sounds/bloom.wav'),
  clear:require('../../assets/sounds/clear.wav'),
};
const VOLUME:Record<Sfx,number>={move:.35,bump:.5,bloom:.6,clear:.7};
const HAPTIC:Record<Sfx,()=>Promise<void>>={
  move:()=>Haptics.selectionAsync(),
  bump:()=>Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  bloom:()=>Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  clear:()=>Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
};

const players:Partial<Record<Sfx,AudioPlayer>>={};
function player(name:Sfx){
  if(!players[name]){try{players[name]=createAudioPlayer(SOURCES[name])}catch{return null}}
  return players[name]!;
}

/** 설정에 따라 효과음(볼륨 단계 반영) + 진동 */
export function feedback(name:Sfx){
  const {sfxVolume,haptics}=getSettings();
  if(sfxVolume>0){const p=player(name);if(p){p.volume=VOLUME[name]*sfxVolume/MAX_VOLUME;p.seekTo(0).catch(()=>{});p.play()}}
  if(haptics)HAPTIC[name]().catch(()=>{});
}
