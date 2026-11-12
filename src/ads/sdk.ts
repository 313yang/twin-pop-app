import {TurboModuleRegistry} from 'react-native';

type AdsLib=typeof import('react-native-google-mobile-ads');

/** 네이티브 모듈이 없는 환경(Expo Go 등)에서는 null → 광고 기능 전체 생략 */
export const ads:AdsLib|null=TurboModuleRegistry.get('RNGoogleMobileAdsModule')
  ?require('react-native-google-mobile-ads')
  :null;
