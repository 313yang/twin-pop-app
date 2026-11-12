import React,{useEffect,useMemo,useRef} from 'react';
import {Animated,Easing,StyleSheet,View,useWindowDimensions} from 'react-native';

type Props={reduced:boolean};

const COLORS=['#ffa99a','#9dd5b4','#f2cd70','#c3b0de','#ffd0c4','#8fc7e8'];
const PIECES_PER_SIDE=60;
const DURATION_MS=2600;
/** 절반은 살짝 늦게 한 번 더 팡 */
const SECOND_BURST_MS=350;
/** 발사 각도 범위(수직 기준, 안쪽으로 기울어짐) */
const ANGLE_MIN=12,ANGLE_MAX=42;

type Piece={side:1|-1;vx:number;vy:number;w:number;h:number;color:string;spin:number;delay:number;sway:number};

function makePieces(width:number,height:number):Piece[]{
  const list:Piece[]=[];
  for(const side of [1,-1] as const){
    for(let i=0;i<PIECES_PER_SIDE;i++){
      const angle=(ANGLE_MIN+Math.random()*(ANGLE_MAX-ANGLE_MIN))*Math.PI/180,power=height*(.75+Math.random()*.45);
      const ribbon=Math.random()<.3;
      list.push({side,vx:Math.sin(angle)*power*.9*side*(width/400),vy:Math.cos(angle)*power,w:ribbon?4:7+Math.random()*4,h:ribbon?16+Math.random()*8:9+Math.random()*5,color:COLORS[i%COLORS.length],spin:(Math.random()*900+300)*(Math.random()<.5?-1:1),delay:i<PIECES_PER_SIDE/2?Math.random()*120:SECOND_BURST_MS+Math.random()*120,sway:(Math.random()-.5)*40});
    }
  }
  return list;
}

/** y(t)=vy·t − g·t² 를 샘플링해 포물선 궤적 생성 (위로 솟았다가 화면 아래로) */
const STEPS=[0,.15,.3,.45,.6,.8,1];
function arc(vy:number,fall:number){const g=vy+fall;return STEPS.map(t=>-(vy*2*t-g*t*t));}

function ConfettiPiece({p,width,height}:{p:Piece;width:number;height:number}){
  const t=useRef(new Animated.Value(0)).current;
  useEffect(()=>{const a=Animated.sequence([Animated.delay(p.delay),Animated.timing(t,{toValue:1,duration:DURATION_MS,easing:Easing.linear,useNativeDriver:true})]);a.start();return()=>a.stop()},[t,p.delay]);
  const startX=p.side===1?width*.04:width*.96;
  return <Animated.View style={{position:'absolute',left:startX,top:height,width:p.w,height:p.h,borderRadius:2,backgroundColor:p.color,
    opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
    transform:[
      {translateX:t.interpolate({inputRange:[0,.4,.7,1],outputRange:[0,p.vx*.75,p.vx*.95+p.sway,p.vx+p.sway*-1]})},
      {translateY:t.interpolate({inputRange:STEPS,outputRange:arc(p.vy,height*.3)})},
      {rotate:t.interpolate({inputRange:[0,1],outputRange:['0deg',`${p.spin}deg`]})},
      {rotateX:t.interpolate({inputRange:[0,1],outputRange:['0deg',`${p.spin*1.5}deg`]})},
    ]}}/>;
}

/** 클리어 축하: 화면 양쪽 아래에서 크래커가 팡! 터지며 색종이가 전체 화면에 흩날림 */
export function Celebration({reduced}:Props){
  const {width,height}=useWindowDimensions();
  const pieces=useMemo(()=>makePieces(width,height),[width,height]);
  if(reduced)return null;
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill,{overflow:'hidden'}]}>
    {pieces.map((p,i)=><ConfettiPiece key={i} p={p} width={width} height={height}/>)}
  </View>;
}
