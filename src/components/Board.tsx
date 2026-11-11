import React,{useEffect,useRef,useState} from 'react';
import {Animated,StyleSheet,View} from 'react-native';
import {Character} from './Character';
import {Icon} from './Icon';
import type {Direction,Level} from '../game/types';
export function Board({level,board,position,height,revision,direction,won,reduced}:{level:Level;board:0|1;position:number;height:number;revision:number;direction:Direction|null;won:boolean;reduced:boolean}){
 const [width,setWidth]=useState(0),travel=useRef(new Animated.ValueXY()).current,bounce=useRef(new Animated.Value(0)).current;
 const last=useRef<{pos:number;width:number;height:number}|null>(null),gap=4,cw=(width-gap*(level.n-1))/level.n,ch=(height-gap*(level.n-1))/level.n,size=Math.max(15,Math.min(34,cw*.75,ch*.96)),mint=board===1;
 useEffect(()=>{if(!width)return;const target={x:(position%level.n)*(cw+gap)+(cw-size)/2,y:Math.floor(position/level.n)*(ch+gap)+(ch-size)/2};let animation:Animated.CompositeAnimation;
 if(!last.current||last.current.width!==width||last.current.height!==height||reduced){travel.setValue(target);}
 else if(last.current.pos===position&&direction!==null){const d=mint&&level.reverse?(direction+2)%4:direction,offset=[[0,-4],[4,0],[0,4],[-4,0]][d];animation=Animated.sequence([Animated.timing(travel,{toValue:{x:target.x+offset[0],y:target.y+offset[1]},duration:75,useNativeDriver:true}),Animated.spring(travel,{toValue:target,speed:30,bounciness:7,useNativeDriver:true})]);animation.start();}
 else{animation=Animated.spring(travel,{toValue:target,speed:30,bounciness:5,useNativeDriver:true});animation.start();}
 last.current={pos:position,width,height};return()=>animation?.stop();
 },[position,revision,width,height,level.n,level.reverse,direction,reduced,travel,cw,ch,size,mint]);
 useEffect(()=>{bounce.setValue(0);if(!won||reduced)return;const a=Animated.loop(Animated.sequence([Animated.timing(bounce,{toValue:-8,duration:140,useNativeDriver:true}),Animated.timing(bounce,{toValue:0,duration:160,useNativeDriver:true})]),{iterations:3});a.start();return()=>a.stop();},[won,reduced,bounce]);
 return <View style={[s.wrap,{backgroundColor:mint?'#edf3e3':'#ffede5',borderColor:mint?'#d5dfc1':'#efd5c5'}]}>
  <View style={s.label}><Character mint={mint} size={23} reduced/><Icon name={mint&&level.reverse?'swap':'heart'} color={mint?'#80a68b':'#d79380'} size={17}/></View>
  <View onLayout={e=>setWidth(e.nativeEvent.layout.width)} style={{height,position:'relative'}} accessibilityLabel={mint?'민트 미로':'복숭아 미로'}>
   {width>0&&level.boards[board].map((wall,i)=><View key={i} style={[s.cell,{left:(i%level.n)*(cw+gap),top:Math.floor(i/level.n)*(ch+gap),width:cw,height:ch,backgroundColor:wall?(mint?'#c8d8b0':'#e8c9b1'):(mint?'#fbfcef':'#fff8ef'),borderBottomColor:wall?(mint?'#afc097':'#d6b89f'):(mint?'#e3e8d5':'#f0e5d7')}]}>{i===level.goals[board]&&<View style={[s.goal,{borderColor:mint?'#84ad92':'#d99583',width:Math.min(cw*.7,ch*.8),height:Math.min(cw*.7,ch*.8)}]}><Icon name="heart" color={mint?'#84ad92':'#d99583'} size={Math.min(ch*.55,19)}/></View>}</View>)}
   {width>0&&<Animated.View pointerEvents="none" style={{position:'absolute',left:0,top:0,transform:travel.getTranslateTransform()}}><Animated.View style={{transform:[{translateY:bounce}]}}><Character size={size} mint={mint} happy={position===level.goals[board]} reduced={reduced}/></Animated.View></Animated.View>}
  </View>
 </View>
}
const s=StyleSheet.create({wrap:{padding:10,borderWidth:2,borderRadius:23,borderBottomWidth:5},label:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:23,marginBottom:6},face:{fontSize:12,fontWeight:'700',paddingHorizontal:9,borderRadius:8},cell:{position:'absolute',borderRadius:6,borderBottomWidth:2,alignItems:'center',justifyContent:'center'},goal:{borderWidth:1.5,borderStyle:'dashed',borderRadius:20,alignItems:'center',justifyContent:'center'}});
