import {Platform} from 'react-native';
import {RewardedAd,RewardedAdEventType,AdEventType,TestIds} from 'react-native-google-mobile-ads';
import {markRewardedShown} from './interstitial';

const IOS_HINT_UNIT='ca-app-pub-8097019015758092/3313054774';
// TODO: Android 광고 단위 생성 후 교체
const ANDROID_HINT_UNIT=TestIds.REWARDED;
const UNIT_ID=__DEV__?TestIds.REWARDED:Platform.select({ios:IOS_HINT_UNIT,default:ANDROID_HINT_UNIT});

let ad:RewardedAd|null=null;
let loaded=false;
const listeners=new Set<(ready:boolean)=>void>();
const setLoaded=(v:boolean)=>{loaded=v;listeners.forEach(fn=>fn(v))};

function load(){if(!ad)return;setLoaded(false);ad.load()}

export function initRewarded(){
  if(ad)return;
  ad=RewardedAd.createForAdRequest(UNIT_ID,{requestNonPersonalizedAdsOnly:true});
  ad.addAdEventListener(RewardedAdEventType.LOADED,()=>setLoaded(true));
  ad.addAdEventListener(AdEventType.ERROR,()=>setLoaded(false));
  load();
}

export function isRewardedReady(){return loaded}
export function subscribeRewardedReady(fn:(ready:boolean)=>void){listeners.add(fn);return()=>{listeners.delete(fn)}}

/** 광고 시청 완료 시 onReward 호출. 끝까지 보지 않으면 보상 없음. */
export function showHintAd(onReward:()=>void){
  if(!ad||!loaded)return;
  const current=ad;let earned=false;
  const offEarn=current.addAdEventListener(RewardedAdEventType.EARNED_REWARD,()=>{earned=true});
  const offClose=current.addAdEventListener(AdEventType.CLOSED,()=>{offEarn();offClose();markRewardedShown();if(earned)onReward();load()});
  setLoaded(false);
  current.show().catch(()=>{offEarn();offClose();load()});
}
