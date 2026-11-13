import {requireOptionalNativeModule,type EventSubscription} from 'expo-modules-core';

type AudioSessionModule={
  isOtherAudioPlaying():boolean;
  addListener(event:'onOtherAudioChange',fn:(e:{playing:boolean})=>void):EventSubscription;
};

/** iOS 네이티브 빌드에만 존재. 없으면 null */
export const AudioSession=requireOptionalNativeModule<AudioSessionModule>('AudioSession');
