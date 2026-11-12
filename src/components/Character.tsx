import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Animated} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {characterSvg} from '../art/character';
export function Character({mint=false,size=70,happy=false,impact=false,idle=false,reduced=false}:{mint?:boolean;size?:number;happy?:boolean;impact?:boolean;idle?:boolean;reduced?:boolean}){
 const [blink,setBlink]=useState(false);
 const bob=useRef(new Animated.Value(0)).current;
 useEffect(()=>{setBlink(false);if(reduced||happy||impact)return;let reopen:ReturnType<typeof setTimeout>|undefined;const timer=setInterval(()=>{setBlink(true);reopen=setTimeout(()=>setBlink(false),130)},mint?3700:4300);return()=>{clearInterval(timer);clearTimeout(reopen)}},[mint,happy,impact,reduced]);
 const xml=useMemo(()=>characterSvg(mint,happy,blink,impact),[mint,happy,blink,impact]);
 useEffect(()=>{bob.setValue(0);if(reduced||!idle)return;const a=Animated.loop(Animated.sequence([Animated.timing(bob,{toValue:-8,duration:1100,useNativeDriver:true}),Animated.timing(bob,{toValue:0,duration:1100,useNativeDriver:true})]));a.start();return()=>a.stop()},[idle,reduced,bob]);
 return <Animated.View pointerEvents="none" accessible={false} style={{width:size,height:size,transform:[{translateY:bob},{rotate:idle&&!reduced?bob.interpolate({inputRange:[-8,0],outputRange:mint?['-5deg','5deg']:['5deg','-5deg']}):'0deg'}]}}><SvgXml xml={xml} width={size} height={size}/></Animated.View>
}
