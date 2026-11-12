/** 지도 레이아웃: 아래(1번)에서 위로 올라가는, 조금씩 랜덤하게 꺾이는 길 */
export const ROW_H=56;
export const NODE=52;
export const TOP_PAD=50,BOTTOM_PAD=70;
/** 이웃 노드끼리 최소 가로 간격: 아래 노드의 별(노드 위 약 36px 폭)이 위 노드에 가리지 않도록 */
const MIN_DX=NODE*.95;
/** 가로 간격에 더해지는 랜덤 폭 */
const EXTRA_DX=NODE*.7;
/** 화면 가장자리 여백 */
const EDGE=NODE*.9;
/** 같은 방향으로 최대 몇 번 연속 갈지 */
const MAX_RUN=3;

export type Point={x:number;y:number};

export function mapHeight(count:number){return TOP_PAD+BOTTOM_PAD+(count-1)*ROW_H;}

/** 시드 기반 의사난수 (같은 챕터는 항상 같은 모양) */
function random(seed:number){let s=seed>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/2**32;};}

/** 아래(0)부터 위로 노드 중심 좌표. 좌우로 랜덤하게 꺾이되 이웃 노드와 겹치지 않음 */
export function nodePoints(count:number,width:number,seed:number):Point[]{
  const rand=random(seed),min=EDGE,max=width-EDGE,points:Point[]=[];
  let x=width/2,dir=rand()<.5?-1:1,run=0;
  for(let i=0;i<count;i++){
    if(i>0){
      const step=MIN_DX+rand()*EXTRA_DX;
      if(run>=MAX_RUN||rand()<.3){dir=-dir;run=0}
      if(x+dir*step<min||x+dir*step>max){dir=-dir;run=0}
      x=Math.min(max,Math.max(min,x+dir*step));run++;
    }
    points.push({x,y:mapHeight(count)-BOTTOM_PAD-i*ROW_H});
  }
  return points;
}

/** 노드들을 부드럽게 잇는 SVG path */
export function pathD(points:Point[]){
  if(!points.length)return '';
  let d=`M${points[0].x} ${points[0].y}`;
  for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],my=(a.y+b.y)/2;d+=` C${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`;}
  return d;
}
