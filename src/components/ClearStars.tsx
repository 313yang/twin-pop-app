import React,{useEffect,useRef} from 'react';
import {Animated,Easing,StyleSheet,View} from 'react-native';
import Svg,{Defs,G,Path,RadialGradient,Circle,Stop} from 'react-native-svg';
import {Icon} from './Icon';
import type {StarCount} from '../game/stars';

type Props={stars:StarCount;reduced:boolean};

const GOLD='#e7bd62',EMPTY='#e3d6c0';
const SIZES=[30,46,30];
const POP_STAGGER_MS=180,PULSE_MS=520,SPIN_MS=9000;
const RAY_COUNT=12;
const RAYS_SIZE=150;

/** 별 뒤로 천천히 도는 햇살 */
function Rays({spin}:{spin:Animated.Value}){
  return <Animated.View pointerEvents="none" style={[s.rays,{transform:[{rotate:spin.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']})}]}]}>
    <Svg width={RAYS_SIZE} height={RAYS_SIZE} viewBox="0 0 100 100">
      <Defs><RadialGradient id="raysGlow" cx="50%" cy="50%" r="50%"><Stop offset="0" stopColor="#fff3c4" stopOpacity={1}/><Stop offset="1" stopColor="#fff3c4" stopOpacity={0}/></RadialGradient></Defs>
      <Circle cx="50" cy="50" r="50" fill="url(#raysGlow)"/>
      {Array.from({length:RAY_COUNT},(_,i)=><G key={i} rotation={i*360/RAY_COUNT} origin="50, 50"><Path d="M47 50L50 2L53 50Z" fill="#ffe08a" opacity={.55}/></G>)}
    </Svg>
  </Animated.View>;
}

/** 한 개의 별: 팝 등장 후, 획득한 별은 통통 맥박 + 살랑 흔들림 */
function Star({index,earned,pop,pulse}:{index:number;earned:boolean;pop:Animated.Value;pulse:Animated.Value}){
  const wiggle=index===1?['-6deg','6deg']:index===0?['-12deg','4deg']:['12deg','-4deg'];
  const scale=earned?Animated.multiply(pop,pulse.interpolate({inputRange:[0,1],outputRange:[1,1.2]})):pop;
  return <Animated.View style={{transform:[{scale},{rotate:earned?pulse.interpolate({inputRange:[0,1],outputRange:wiggle}):'0deg'}]}}>
    <Icon name={earned?'star':'starEmpty'} size={SIZES[index]} color={earned?GOLD:EMPTY}/>
  </Animated.View>;
}

/** 클리어 별: 획득 수만큼 금색, 순서대로 팝 → 통통 튀며 축하 */
export function ClearStars({stars,reduced}:Props){
  const pops=useRef([0,1,2].map(()=>new Animated.Value(0))).current;
  const pulses=useRef([0,1,2].map(()=>new Animated.Value(0))).current;
  const spin=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    if(reduced){pops.forEach(v=>v.setValue(1));return}
    pops.forEach(v=>v.setValue(0));pulses.forEach(v=>v.setValue(0));
    const intro=Animated.stagger(POP_STAGGER_MS,pops.map(v=>Animated.spring(v,{toValue:1,friction:4,tension:140,useNativeDriver:true})));
    const beat=(v:Animated.Value)=>Animated.sequence([Animated.timing(v,{toValue:1,duration:PULSE_MS,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),Animated.timing(v,{toValue:0,duration:PULSE_MS,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]);
    const loop=Animated.loop(Animated.stagger(POP_STAGGER_MS,pulses.map(beat)));
    const rays=Animated.loop(Animated.timing(spin,{toValue:1,duration:SPIN_MS,easing:Easing.linear,useNativeDriver:true}));
    intro.start(()=>loop.start());rays.start();
    return()=>{intro.stop();loop.stop();rays.stop()};
  },[reduced,pops,pulses,spin]);
  return <View style={s.row} accessibilityLabel={`별 ${stars}개`}>
    {!reduced&&stars===3&&<Rays spin={spin}/>}
    {[0,1,2].map(i=><Star key={i} index={i} earned={i<stars} pop={pops[i]} pulse={pulses[i]}/>)}
  </View>;
}

const s=StyleSheet.create({
  row:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:14,marginBottom:16,height:64},
  rays:{position:'absolute',width:RAYS_SIZE,height:RAYS_SIZE,left:'50%',top:'50%',marginLeft:-RAYS_SIZE/2,marginTop:-RAYS_SIZE/2},
});
