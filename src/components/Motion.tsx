import React,{useEffect,useRef} from 'react';
import {AppText as Text} from './AppText';
import {Icon} from './Icon';
import type {Direction} from '../game/types';
import {Animated,StyleSheet,View} from 'react-native';
import {t} from '../i18n';
const SWIPE_FROM=-25,SWIPE_TO=35;
/** direction: 0 위, 1 오른쪽, 2 아래, 3 왼쪽 — 첫 정답 방향으로 손이 움직임 */
export function SwipeGuide({reduced,direction}:{reduced:boolean;direction:Direction}){const p=useRef(new Animated.Value(0)).current;useEffect(()=>{if(reduced)return;const a=Animated.loop(Animated.sequence([Animated.timing(p,{toValue:1,duration:900,useNativeDriver:true}),Animated.delay(350),Animated.timing(p,{toValue:0,duration:0,useNativeDriver:true}),Animated.delay(200)]));a.start();return()=>a.stop()},[reduced,p]);const sign=direction===1||direction===2?1:-1,offset=p.interpolate({inputRange:[0,1],outputRange:[SWIPE_FROM*sign,SWIPE_TO*sign]}),move=direction%2===1?{translateX:offset}:{translateY:offset};return <View pointerEvents="none" style={s.guide}><Animated.View style={{transform:[move,{rotate:'-15deg'}]}}><Icon name="hand" size={54} color="#ad967b"/></Animated.View><Text style={s.bubble}>{t('game.swipeGuide')}</Text></View>}
const s=StyleSheet.create({guide:{position:'absolute',top:0,right:0,bottom:0,left:0,backgroundColor:'#fff8eb55',borderRadius:24,alignItems:'center',justifyContent:'center'},bubble:{backgroundColor:'#fffdf5',borderWidth:2,borderColor:'#e4d5c0',paddingHorizontal:16,paddingVertical:10,borderRadius:20,color:'#7b6754',fontSize:13,fontWeight:'700',marginTop:12}});

