import React,{useEffect,useRef,useState} from 'react';
import {Animated,Easing,Pressable,ScrollView,StyleSheet,View,useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg,{Path,Ellipse,Circle} from 'react-native-svg';
import {SvgXml} from 'react-native-svg';
import {AppText as Text} from './AppText';
import {Character} from './Character';
import {Icon} from './Icon';
import {homeLogoSvg,homeLogoAspect} from '../art/homeLogo';

function Sparkle({size=23}:{size?:number}){return <Svg width={size} height={size} viewBox="0 0 40 40"><Path d="M20 1Q24 15 39 20Q24 25 20 39Q16 25 1 20Q16 15 20 1Z" fill="#f4c878"/></Svg>}
function Flower({size=24,color='#f1d381'}:{size?:number;color?:string}){return <Svg width={size} height={size} viewBox="0 0 40 40">{[0,72,144,216,288].map(angle=><Ellipse key={angle} cx={20} cy={10} rx={4.5} ry={10} fill={color} transform={`rotate(${angle} 20 20)`}/>)}<Circle cx={20} cy={20} r={3} fill="#fff4d5"/></Svg>}
function Cloud(){return <Svg width={74} height={35} viewBox="0 0 90 40"><Path d="M14 37C-3 37 0 17 16 18C14 0 42-5 48 13C62 5 77 15 74 24C94 23 94 37 78 37Z" fill="#ffffff" opacity={.8}/></Svg>}
function Ambient({reduced}:{reduced:boolean}){
 const drift=useRef(new Animated.Value(0)).current,glow=useRef(new Animated.Value(0)).current;
 useEffect(()=>{drift.setValue(0);glow.setValue(0);if(reduced)return;const clouds=Animated.loop(Animated.sequence([Animated.timing(drift,{toValue:1,duration:3600,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),Animated.timing(drift,{toValue:0,duration:3600,easing:Easing.inOut(Easing.sin),useNativeDriver:true})]));const stars=Animated.loop(Animated.sequence([Animated.timing(glow,{toValue:1,duration:1350,useNativeDriver:true}),Animated.timing(glow,{toValue:0,duration:1350,useNativeDriver:true})]));clouds.start();stars.start();return()=>{clouds.stop();stars.stop()}},[reduced,drift,glow]);
 const starStyle={opacity:glow.interpolate({inputRange:[0,1],outputRange:[.5,1]}),transform:[{scale:glow.interpolate({inputRange:[0,1],outputRange:[.75,1.1]})}]};
 return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
  <Animated.View style={{position:'absolute',left:-9,top:125,transform:[{translateX:drift.interpolate({inputRange:[0,1],outputRange:[0,16]})}]}}><Cloud/></Animated.View>
  <Animated.View style={{position:'absolute',right:-14,top:255,transform:[{translateX:drift.interpolate({inputRange:[0,1],outputRange:[10,-6]})},{scale:.8}]}}><Cloud/></Animated.View>
  <Animated.View style={[{position:'absolute',left:23,top:70},starStyle]}><Sparkle size={21}/></Animated.View>
  <Animated.View style={[{position:'absolute',right:17,top:200},starStyle]}><Sparkle size={27}/></Animated.View>
 </View>
}
export function HomeScreen({reduced,dailyDone,storageError,onHelp,onStart,onStages,onDaily}:{reduced:boolean;dailyDone:boolean;storageError:boolean;onHelp:()=>void;onStart:()=>void;onStages:()=>void;onDaily:()=>void}){
 const insets=useSafeAreaInsets();
 const {width,height}=useWindowDimensions(),sceneWidth=Math.min(width,440)-48,characterSize=Math.min(100,sceneWidth*.28),travelDistance=(sceneWidth-2*characterSize)/2+characterSize*.1;
 const logoWidth=Math.min(224,sceneWidth*.76),settledCollision=Math.max(0,1-10/travelDistance);
 const collision=useRef(new Animated.Value(0)).current,recoil=useRef(new Animated.Value(0)).current,title=useRef(new Animated.Value(reduced?1:0)).current;
 const [impact,setImpact]=useState(false);
 useEffect(()=>{collision.setValue(reduced?settledCollision:0);recoil.setValue(0);title.setValue(reduced?1:0);setImpact(false);if(reduced)return;
 let active=true;const meet=Animated.sequence([Animated.delay(350),Animated.timing(collision,{toValue:1,duration:620,easing:Easing.in(Easing.quad),useNativeDriver:true})]);
 let finish:Animated.CompositeAnimation|undefined;
 meet.start(({finished})=>{if(!finished||!active)return;setImpact(true);finish=Animated.parallel([Animated.sequence([Animated.timing(recoil,{toValue:1,duration:120,useNativeDriver:true}),Animated.spring(recoil,{toValue:0,friction:5,tension:120,useNativeDriver:true})]),Animated.spring(collision,{toValue:settledCollision,damping:18,stiffness:160,mass:1,overshootClamping:true,useNativeDriver:true}),Animated.sequence([Animated.delay(90),Animated.spring(title,{toValue:1,friction:5,tension:75,useNativeDriver:true})])]);finish.start(()=>{if(active)setImpact(false)});});
 return()=>{active=false;meet.stop();finish?.stop()};
 },[reduced,collision,recoil,title,settledCollision]);
 const heroStyle=(mint:boolean)=>({transform:[{translateX:collision.interpolate({inputRange:[0,1],outputRange:[0,mint?-travelDistance:travelDistance]})},{translateY:recoil.interpolate({inputRange:[0,1],outputRange:[0,-6]})},{rotate:collision.interpolate({inputRange:[0,1],outputRange:[mint?'7deg':'-7deg',mint?'-9deg':'9deg']})},{scaleX:recoil.interpolate({inputRange:[0,1],outputRange:[1,.9]})},{scaleY:recoil.interpolate({inputRange:[0,1],outputRange:[1,1.08]})}]});
 return <ScrollView contentContainerStyle={[s.content,{minHeight:height-insets.top-insets.bottom}]} showsVerticalScrollIndicator={false}>
  <View style={s.header}><Pressable accessibilityRole="button" accessibilityLabel="게임 방법" onPress={onHelp} style={({pressed})=>[s.help,pressed&&s.pressed]}><Icon name="help" size={17} color="#9a846d"/></Pressable></View>
  <View style={[s.body,{width:sceneWidth}]}>
   <Ambient reduced={reduced}/>
   <View style={{height:height<720?180:220,justifyContent:'center',paddingTop:height<720?8:25}}>
    <Animated.View accessibilityLabel="트윈팝! TWIN POP" accessible style={{alignSelf:'center',opacity:title,transform:[{translateY:title.interpolate({inputRange:[0,1],outputRange:[55,0]})},{scale:title.interpolate({inputRange:[0,1],outputRange:[.8,1]})}]}}><SvgXml xml={homeLogoSvg} width={logoWidth} height={logoWidth/homeLogoAspect}/></Animated.View>
   </View>
   <View style={[s.hero,{height:height<720?120:155}]}>
    <View style={s.garden}/>
    <View pointerEvents="none" style={{position:'absolute',right:3,bottom:18,transform:[{rotate:'18deg'}]}}><Flower size={26}/></View>
    <View pointerEvents="none" style={{position:'absolute',left:8,bottom:31,transform:[{rotate:'-12deg'}]}}><Flower size={16} color="#e8bcb0"/></View>
    <Animated.View style={[{position:'absolute',left:0,bottom:19},heroStyle(false)]}><Character size={characterSize} impact={impact} idle={!impact} reduced={reduced}/></Animated.View>
    <Animated.View style={[{position:'absolute',right:0,bottom:33},heroStyle(true)]}><Character mint size={characterSize} impact={impact} idle={!impact} reduced={reduced}/></Animated.View>
   </View>
   <View style={s.actions}>
    <Pressable accessibilityRole="button" onPress={onStart} style={({pressed})=>[s.start,pressed&&s.pressed]}><Text style={s.startText}>시작하기</Text></Pressable>
    <Pressable accessibilityRole="button" onPress={onStages} style={({pressed})=>[s.stages,pressed&&s.pressed]}><Text style={s.stagesText}>스테이지</Text></Pressable>
    <Pressable accessibilityRole="button" onPress={onDaily} style={({pressed})=>[s.daily,pressed&&s.pressed]}><Icon name="calendar" size={14} color="#c99d4d"/><Text style={s.dailyText}>오늘의 퍼즐</Text><View style={{marginLeft:'auto'}}><Icon name={dailyDone?'check':'right'} size={14} color="#c99d4d"/></View></Pressable>
   </View>
   {storageError&&<Text accessibilityRole="alert" style={s.error}>진행 기록을 저장하지 못했어요.</Text>}
  </View>
 </ScrollView>
}
const s=StyleSheet.create({content:{paddingBottom:30},header:{height:64,paddingHorizontal:23,justifyContent:'center',alignItems:'flex-end'},help:{width:40,height:42,borderRadius:14,backgroundColor:'#fffdf6',borderColor:'#e9deca',borderWidth:2,borderBottomWidth:5,alignItems:'center',justifyContent:'center'},body:{alignSelf:'center'},hero:{position:'relative',marginTop:0},garden:{position:'absolute',bottom:7,left:4,right:4,height:65,backgroundColor:'#e7edce',borderTopLeftRadius:150,borderTopRightRadius:150},actions:{gap:28,marginTop:38,marginBottom:8},start:{height:52,borderRadius:18,backgroundColor:'#ffa28f',borderWidth:2,borderBottomWidth:7,borderColor:'#ed887b',alignItems:'center',justifyContent:'center'},startText:{fontSize:19,color:'#875744'},stages:{height:50,borderRadius:18,backgroundColor:'#fffdf5',borderWidth:2,borderBottomWidth:5,borderColor:'#e8ddc8',alignItems:'center',justifyContent:'center'},stagesText:{fontSize:19,color:'#98816b'},daily:{height:48,borderRadius:16,backgroundColor:'#fff1c4',borderWidth:2,borderColor:'#cfa354',flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:18,marginTop:8},dailyText:{fontSize:15,color:'#c99d4d'},pressed:{transform:[{translateY:2},{scale:.985}]},error:{fontSize:11,color:'#a35e53',textAlign:'center',marginTop:16}});
