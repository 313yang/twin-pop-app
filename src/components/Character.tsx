import React,{useEffect,useMemo,useRef} from 'react';
import {Animated} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {characterSvg} from '../art/character';
export function Character({mint=false,size=70,happy=false,idle=false,reduced=false}:{mint?:boolean;size?:number;happy?:boolean;idle?:boolean;reduced?:boolean}){
 const bob=useRef(new Animated.Value(0)).current;
 const xml=useMemo(()=>characterSvg(mint,happy),[mint,happy]);
 useEffect(()=>{bob.setValue(0);if(reduced||!idle)return;const a=Animated.loop(Animated.sequence([Animated.timing(bob,{toValue:-8,duration:1100,useNativeDriver:true}),Animated.timing(bob,{toValue:0,duration:1100,useNativeDriver:true})]));a.start();return()=>a.stop()},[idle,reduced,bob]);
 return <Animated.View pointerEvents="none" accessible={false} style={{width:size,height:size,transform:[{translateY:bob}]}}><SvgXml xml={xml} width={size} height={size}/></Animated.View>
}
