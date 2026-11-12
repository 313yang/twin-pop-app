export type StarCount=1|2|3;
/** 최단 대비 이 배수 이상 움직이면 별 1개 */
export const ONE_STAR_RATIO=4;

/** 최단과 같으면 3개, 최단의 4배 이상이면 1개, 그 사이는 2개 */
export function starsFor(moves:number,par:number):StarCount{
  if(moves<=par)return 3;
  if(moves>=par*ONE_STAR_RATIO)return 1;
  return 2;
}
