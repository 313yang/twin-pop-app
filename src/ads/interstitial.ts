import {Platform} from 'react-native';
import type {InterstitialAd} from 'react-native-google-mobile-ads';
import {ads} from './sdk';
import {initRewarded} from './rewarded';

const IOS_STAGE_CLEAR_UNIT='ca-app-pub-8097019015758092/6494265234';
// TODO: Android 광고 단위 생성 후 교체
const TEST_UNIT='ca-app-pub-3940256099942544/4411468910';
const ANDROID_STAGE_CLEAR_UNIT=TEST_UNIT;
const UNIT_ID=__DEV__?TEST_UNIT:Platform.select({ios:IOS_STAGE_CLEAR_UNIT,default:ANDROID_STAGE_CLEAR_UNIT});

const REWARDED_COOLDOWN_MS=5*60*1000;
let lastRewardedAt=0;
export function markRewardedShown(){lastRewardedAt=Date.now()}

let ad:InterstitialAd|null=null;
let loaded=false;

function load(){
  if(!ad)return;
  loaded=false;
  ad.load();
}

export function initAds(){
  if(ad||!ads)return;
  const {AdEventType,InterstitialAd}=ads;
  ad=InterstitialAd.createForAdRequest(UNIT_ID,{requestNonPersonalizedAdsOnly:true});
  ad.addAdEventListener(AdEventType.LOADED,()=>{loaded=true});
  ad.addAdEventListener(AdEventType.ERROR,()=>{loaded=false});
  ads.default().initialize().then(()=>{load();initRewarded()}).catch(()=>{});
}

/** 로드된 광고가 있으면 노출하고 닫힐 때 onDone 호출. 없으면 즉시 onDone. */
export function showStageClearAd(onDone:()=>void){
  if(!ad||!loaded||Date.now()-lastRewardedAt<REWARDED_COOLDOWN_MS){onDone();return}
  const current=ad;
  const unsubscribe=current.addAdEventListener(ads!.AdEventType.CLOSED,()=>{unsubscribe();onDone();load()});
  loaded=false;
  current.show().catch(()=>{unsubscribe();onDone();load()});
}
