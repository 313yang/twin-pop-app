import {getLocales} from 'expo-localization';
import {en,ja,ko,zh,type StringKey} from './strings';

export type Lang='ko'|'en'|'ja'|'zh';
const DICTS={ko,en,ja,zh};

/** 기기 언어 → 지원 언어. 지원하지 않는 언어는 영어 */
function detect():Lang{
  const code=getLocales()[0]?.languageCode??'en';
  return (code in DICTS?code:'en') as Lang;
}

export const lang:Lang=detect();

/** 번역 문구. {n} 등 자리표시자를 params로 채움 */
export function t(key:StringKey,params?:Record<string,string|number>){
  const s=DICTS[lang][key]??ko[key];
  return params?s.replace(/\{(\w+)\}/g,(_,k)=>String(params[k]??'')):s;
}
