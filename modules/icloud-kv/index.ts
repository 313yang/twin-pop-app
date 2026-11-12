import {requireOptionalNativeModule,type EventSubscription} from 'expo-modules-core';

type ICloudKVModule={
  isAvailable():boolean;
  getString(key:string):string|null;
  setString(key:string,value:string):void;
  synchronize():boolean;
  addListener(event:'onChange',fn:(e:{keys:string[]})=>void):EventSubscription;
};

/** iOS 네이티브 빌드에만 존재. Expo Go·안드로이드에서는 null */
export const ICloudKV=requireOptionalNativeModule<ICloudKVModule>('ICloudKV');
