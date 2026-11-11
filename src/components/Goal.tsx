import React,{useEffect,useRef} from 'react';
import {Animated} from 'react-native';
import {Icon} from './Icon';
export function Goal({size,mint,arrived,reduced}:{size:number;mint:boolean;arrived:boolean;reduced:boolean}){
 const pulse=useRef(new Animated.Value(0)).current;
 useEffect(()=>{pulse.setValue(0);if(reduced)return;const a=Animated.loop(Animated.sequence([Animated.timing(pulse,{toValue:1,duration:arrived?450:1100,useNativeDriver:true}),Animated.timing(pulse,{toValue:0,duration:arrived?450:1100,useNativeDriver:true})]));a.start();return()=>a.stop()},[pulse,reduced,arrived]);
 const color=mint?'#84ad92':'#d99583';
 return <Animated.View style={{width:size,height:size,alignItems:'center',justifyContent:'center',borderRadius:size/2,borderWidth:1.5,borderStyle:arrived?'solid':'dashed',borderColor:color,backgroundColor:arrived?(mint?'#94d6b633':'#ff998c33'):'transparent',opacity:reduced?1:pulse.interpolate({inputRange:[0,1],outputRange:[.6,1]}),transform:[{scale:reduced?1:pulse.interpolate({inputRange:[0,1],outputRange:arrived?[1,1.15]:[.9,1]})}]}}><Icon name="heart" size={size*.6} color={color}/></Animated.View>
}
