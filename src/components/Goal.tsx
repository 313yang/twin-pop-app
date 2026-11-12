import React,{useEffect,useRef} from 'react';
import {Animated,Easing,StyleSheet,View} from 'react-native';
import Svg,{Circle,Defs,Ellipse,G,Path,RadialGradient,Stop} from 'react-native-svg';

type Props={size:number;mint:boolean;arrived:boolean;celebrate:boolean;reduced:boolean};

const COLORS={
  peach:{petal:'#ffc3b4',petalEdge:'#ef9e8b',inner:'#ffe3da',bud:'#ffad9a',glow:'#ffb3a1'},
  mint:{petal:'#cdeedb',petalEdge:'#8fc9a6',inner:'#effbf3',bud:'#a9dcbd',glow:'#9fdcb9'},
};
type Palette=typeof COLORS.peach;
const LEAF='#9cc27f',LEAF_EDGE='#7fa565',CENTER='#ffd36e',CENTER_EDGE='#e6b04f';
const PETAL_COUNT=5;
const PETAL='M50 50C33 44 30 16 50 12C70 16 67 44 50 50Z';
/** 핀 꽃은 칸보다 크게 → 사과 뒤 후광처럼 */
const BLOOM_SPREAD=1.9;
const SWAY_MS=1600,BURST_MS=700;
const BURST_PIECES=8;
const SHINE_MS=1300,TWINKLE_MS=1100;
/** 클리어 반짝이 위치(칸 대비, 중심 기준)·크기·지연 */
const TWINKLES=[{x:-.7,y:-.55,s:.42,delay:0},{x:.75,y:-.45,s:.36,delay:250},{x:.65,y:.6,s:.3,delay:550},{x:-.6,y:.55,s:.3,delay:800},{x:.05,y:-.95,s:.32,delay:400},{x:-1,y:.05,s:.26,delay:950},{x:1,y:.1,s:.26,delay:700}];
const SPARK='M12 0Q13.5 10.5 24 12Q13.5 13.5 12 24Q10.5 13.5 0 12Q10.5 10.5 12 0Z';

/** 살랑거리는 꽃봉오리 */
function Bud({c}:{c:Palette}){
  return <Svg width="100%" height="100%" viewBox="0 0 100 100">
    <Ellipse cx="50" cy="90" rx="18" ry="3.5" fill={LEAF_EDGE} opacity={.2}/>
    <Path d="M50 90V60" stroke={LEAF_EDGE} strokeWidth={4} strokeLinecap="round"/>
    <Path d="M50 76C40 76 32 70 30 62C40 61 48 66 50 76Z" fill={LEAF} stroke={LEAF_EDGE} strokeWidth={2}/>
    <Path d="M50 72C60 72 68 66 70 58C60 57 52 62 50 72Z" fill={LEAF} stroke={LEAF_EDGE} strokeWidth={2}/>
    <Path d="M50 64C36 60 34 40 50 24C66 40 64 60 50 64Z" fill={c.bud} stroke={c.petalEdge} strokeWidth={2.5}/>
    <Path d="M50 64C42 58 42 44 50 34C58 44 58 58 50 64Z" fill={c.petal} opacity={.9}/>
    <Path d="M44 40Q46 34 50 31" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={.8}/>
  </Svg>;
}

/** 활짝 핀 꽃 + 뒤 후광 */
function Bloom({c,id}:{c:Palette;id:string}){
  return <Svg width="100%" height="100%" viewBox="0 0 100 100">
    <Defs><RadialGradient id={id} cx="50%" cy="50%" r="50%"><Stop offset="0" stopColor="#fff" stopOpacity={.95}/><Stop offset=".5" stopColor={c.glow} stopOpacity={.45}/><Stop offset="1" stopColor={c.glow} stopOpacity={0}/></RadialGradient></Defs>
    <Circle cx="50" cy="50" r="50" fill={`url(#${id})`}/>
    {Array.from({length:PETAL_COUNT},(_,i)=><G key={i} rotation={i*360/PETAL_COUNT} origin="50, 50"><Path d={PETAL} fill={c.petal} stroke={c.petalEdge} strokeWidth={1.6}/><Path d="M50 42C47 36 47 26 50 21" stroke={c.inner} strokeWidth={2.2} strokeLinecap="round" fill="none"/></G>)}
    <Circle cx="50" cy="50" r="7" fill={CENTER} stroke={CENTER_EDGE} strokeWidth={1.5}/>
  </Svg>;
}

/** 개화 순간 사방으로 퍼지는 꽃잎 조각 */
function Burst({c,size,t}:{c:Palette;size:number;t:Animated.Value}){
  const piece=size*.18;
  return <>{Array.from({length:BURST_PIECES},(_,i)=>{const a=i/BURST_PIECES*Math.PI*2,dist=size*.75;
    return <Animated.View key={i} style={{position:'absolute',left:(size-piece)/2,top:(size-piece)/2,width:piece,height:piece,
      opacity:t.interpolate({inputRange:[0,.15,1],outputRange:[0,1,0]}),
      transform:[{translateX:t.interpolate({inputRange:[0,1],outputRange:[0,Math.cos(a)*dist]})},{translateY:t.interpolate({inputRange:[0,1],outputRange:[0,Math.sin(a)*dist]})},{rotate:t.interpolate({inputRange:[0,1],outputRange:['0deg',`${i%2?200:-200}deg`]})}]}}>
      <Svg width={piece} height={piece} viewBox="0 0 20 20"><Path d="M10 1C15 6 15 14 10 19C5 14 5 6 10 1Z" fill={i%3===0?CENTER:c.petal}/></Svg>
    </Animated.View>})}</>;
}

/** 클리어 시 꽃 뒤로 은은하게 숨 쉬는 빛 */
function Shine({c,id,size,t}:{c:Palette;id:string;size:number;t:Animated.Value}){
  const big=size*3.2;
  return <Animated.View style={{position:'absolute',width:big,height:big,left:(size-big)/2,top:(size-big)/2,opacity:t.interpolate({inputRange:[0,1],outputRange:[.6,1]})}}>
    <Svg width="100%" height="100%" viewBox="0 0 100 100"><Defs><RadialGradient id={id} cx="50%" cy="50%" r="50%"><Stop offset="0" stopColor="#fffbe6" stopOpacity={1}/><Stop offset=".25" stopColor="#fff1b8" stopOpacity={.9}/><Stop offset=".55" stopColor={c.glow} stopOpacity={.6}/><Stop offset="1" stopColor={c.glow} stopOpacity={0}/></RadialGradient></Defs><Circle cx="50" cy="50" r="50" fill={`url(#${id})`}/></Svg>
  </Animated.View>;
}

/** 순서대로 반짝 나타났다 사라지는 별 */
function Twinkle({size,x,y,s,delay}:{size:number}&typeof TWINKLES[number]){
  const t=useRef(new Animated.Value(0)).current;
  useEffect(()=>{const a=Animated.loop(Animated.sequence([Animated.delay(delay),Animated.timing(t,{toValue:1,duration:TWINKLE_MS,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),Animated.timing(t,{toValue:0,duration:0,useNativeDriver:true}),Animated.delay(1200-delay)]));a.start();return()=>a.stop()},[t,delay]);
  const px=size*s;
  return <Animated.View style={{position:'absolute',left:size/2+size*x-px/2,top:size/2+size*y-px/2,width:px,height:px,opacity:t.interpolate({inputRange:[0,.4,1],outputRange:[0,1,0]}),transform:[{scale:t.interpolate({inputRange:[0,.4,1],outputRange:[.3,1.1,.5]})},{rotate:t.interpolate({inputRange:[0,1],outputRange:['0deg','90deg']})}]}}>
    <Svg width={px} height={px} viewBox="0 0 24 24"><Path d={SPARK} fill="#ffd66e"/></Svg>
  </Animated.View>;
}

/** 도착지점: 꽃봉오리 → 사과 도착 시 퐁! 개화 */
export function Goal({size,mint,arrived,celebrate,reduced}:Props){
  const shine=useRef(new Animated.Value(0)).current;
  useEffect(()=>{shine.setValue(0);if(!celebrate||reduced)return;const a=Animated.loop(Animated.sequence([Animated.timing(shine,{toValue:1,duration:SHINE_MS,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),Animated.timing(shine,{toValue:0,duration:SHINE_MS,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));a.start();return()=>a.stop()},[celebrate,reduced,shine]);
  const sway=useRef(new Animated.Value(0)).current,bloom=useRef(new Animated.Value(arrived?1:0)).current,burst=useRef(new Animated.Value(0)).current,spin=useRef(new Animated.Value(0)).current;
  useEffect(()=>{if(reduced||arrived)return;const a=Animated.loop(Animated.sequence([Animated.timing(sway,{toValue:1,duration:SWAY_MS,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),Animated.timing(sway,{toValue:0,duration:SWAY_MS,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));a.start();return()=>a.stop()},[sway,reduced,arrived]);
  useEffect(()=>{
    if(reduced){bloom.setValue(arrived?1:0);return}
    if(!arrived){Animated.timing(bloom,{toValue:0,duration:250,useNativeDriver:true}).start();return}
    burst.setValue(0);
    Animated.parallel([Animated.spring(bloom,{toValue:1,friction:4,tension:120,useNativeDriver:true}),Animated.timing(burst,{toValue:1,duration:BURST_MS,easing:Easing.out(Easing.quad),useNativeDriver:true})]).start();
    const r=Animated.loop(Animated.timing(spin,{toValue:1,duration:12000,easing:Easing.linear,useNativeDriver:true}));r.start();return()=>r.stop();
  },[arrived,reduced,bloom,burst,spin]);
  const c=mint?COLORS.mint:COLORS.peach,id=mint?'bloomMint':'bloomPeach',big=size*BLOOM_SPREAD;
  return <View pointerEvents="none" style={{width:size,height:size}}>
    {celebrate&&<Shine c={c} id={`${id}Shine`} size={size} t={shine}/>}
    <Animated.View style={{position:'absolute',width:big,height:big,left:(size-big)/2,top:(size-big)/2,opacity:bloom,transform:[{scale:bloom.interpolate({inputRange:[0,1],outputRange:[.2,1]})},{rotate:spin.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']})}]}}><Bloom c={c} id={id}/></Animated.View>
    <Animated.View style={[StyleSheet.absoluteFill,{opacity:bloom.interpolate({inputRange:[0,.3],outputRange:[1,0],extrapolate:'clamp'}),transform:[{translateY:size*.35},{rotate:sway.interpolate({inputRange:[0,1],outputRange:['-7deg','7deg']})},{translateY:-size*.35}]}]}><Bud c={c}/></Animated.View>
    {!reduced&&<Burst c={c} size={size} t={burst}/>}
    {celebrate&&!reduced&&TWINKLES.map((p,i)=><Twinkle key={i} size={size} {...p}/>)}
  </View>;
}
