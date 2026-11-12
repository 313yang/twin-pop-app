import type {Progress} from './types';

/** 클라우드에 올리는 부분(진행 중 판 정보 resume 제외) */
export type CloudProgress=Pick<Progress,'nextStage'|'wins'|'swipeLearned'>;

export function toCloud(p:Progress):CloudProgress{return {nextStage:p.nextStage,wins:p.wins,swipeLearned:p.swipeLearned};}

/** 로컬 + 클라우드 병합: 더 앞선 진행, 더 좋은(적은) 기록을 유지. resume은 로컬 것 */
export function mergeProgress(local:Progress,cloud:CloudProgress|null):Progress{
  if(!cloud)return local;
  const wins={...local.wins};
  for(const [k,v] of Object.entries(cloud.wins??{}))if(typeof v==='number'&&v>0)wins[k]=Math.min(wins[k]??Infinity,v);
  return {...local,wins,nextStage:Math.max(local.nextStage,Number(cloud.nextStage)||1),swipeLearned:local.swipeLearned||!!cloud.swipeLearned};
}

/** 병합 결과가 로컬과 달라졌는지(클라우드 반영이 필요한지) */
export function sameCloud(a:CloudProgress,b:CloudProgress){return JSON.stringify(a)===JSON.stringify(b);}
