import React,{useEffect,useRef} from 'react';
import {Animated,StyleSheet,View} from 'react-native';
export function Character({mint=false,size=70,happy=false,idle=false,reduced=false}:{mint?:boolean;size?:number;happy?:boolean;idle?:boolean;reduced?:boolean}){
  const bob=useRef(new Animated.Value(0)).current,blink=useRef(new Animated.Value(1)).current;
  useEffect(()=>{if(reduced)return;const eye=Animated.loop(Animated.sequence([Animated.delay(mint?3300:4100),Animated.timing(blink,{toValue:.1,duration:70,useNativeDriver:true}),Animated.timing(blink,{toValue:1,duration:100,useNativeDriver:true})]));eye.start();let float:Animated.CompositeAnimation|undefined;if(idle){float=Animated.loop(Animated.sequence([Animated.timing(bob,{toValue:-8,duration:1100,useNativeDriver:true}),Animated.timing(bob,{toValue:0,duration:1100,useNativeDriver:true})]));float.start();}return()=>{eye.stop();float?.stop();blink.setValue(1);bob.setValue(0);};},[idle,reduced,mint,bob,blink]);
  const color=mint?'#9ed8ba':'#ffa696',edge=mint?'#77b698':'#dc8d7d';
  return <Animated.View style={{width:size,height:size,transform:[{translateY:bob}]}} accessible={false}>
    <View style={[s.body,{backgroundColor:color,borderColor:edge,borderRadius:size*.38,borderWidth:size>40?2.5:1.4}]}>
      <View style={{position:'absolute',top:-size*.13,left:size*.42,width:size*.17,height:size*.18,borderTopLeftRadius:10,borderBottomRightRadius:10,backgroundColor:mint?'#edc877':'#94b474',transform:[{rotate:'-20deg'}]}}/>
      {[.28,.65].map((x,i)=><Animated.View key={i} style={{position:'absolute',left:size*x,top:size*.37,width:size*.065,height:size*.09,borderRadius:5,backgroundColor:'#69554e',transform:[{scaleY:happy?.35:blink}]}}/>)}
      {[.1,.75].map(x=><View key={x} style={{position:'absolute',left:size*x,top:size*.53,width:size*.15,height:size*.07,borderRadius:10,backgroundColor:'#eb969080'}}/>)}
      <View style={{position:'absolute',left:size*.43,top:size*.52,width:size*.14,height:size*.08,borderBottomWidth:size>40?2:1,borderLeftWidth:1,borderRightWidth:1,borderColor:'#795d50',borderBottomLeftRadius:10,borderBottomRightRadius:10}}/>
    </View>
  </Animated.View>
}
const s=StyleSheet.create({body:{flex:1,borderTopWidth:3,shadowColor:'#a98e70',shadowOpacity:.15,shadowRadius:0,shadowOffset:{width:0,height:4},elevation:2}});
