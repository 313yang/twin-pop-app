import React,{useEffect,useMemo,useReducer,useRef,useState} from 'react';
import {AccessibilityInfo,ActivityIndicator,AppState,BackHandler,Modal,PanResponder,Pressable,ScrollView,StyleSheet,View,useWindowDimensions} from 'react-native';
import {SafeAreaProvider,SafeAreaView,useSafeAreaInsets} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {useFonts} from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppText as Text} from './src/components/AppText';
import {Board} from './src/components/Board';
import {HomeScreen} from './src/components/HomeScreen';
import {Icon,type IconName} from './src/components/Icon';
import {SwipeGuide} from './src/components/Motion';
import {ClearStars} from './src/components/ClearStars';
import {HelpContent} from './src/components/HelpContent';
import {SettingsContent} from './src/components/SettingsContent';
import {t} from './src/i18n';
import {useCloudProgress} from './src/sync/useCloudProgress';
import {initBgm,setBgmTrack} from './src/feedback/bgm';
import {useMoveFeedback} from './src/feedback/useMoveFeedback';
import {loadSettings} from './src/settings/settingsStore';
import {StageMap} from './src/components/stage-map/StageMap';
import {starsFor} from './src/game/stars';
import {Celebration} from './src/components/Celebration';
import {getLevel,koreaDate,solve} from './src/game/engine';
import {initialState,parseProgress,reducer} from './src/game/state';
import type {Direction,Mode} from './src/game/types';
import {initAds,showStageClearAd} from './src/ads/interstitial';
import {useHintQuota} from './src/hooks/useHintQuota';
const STORAGE='twinpop.native.v1';
const HEADER_ICON_SIZE=17;
const PAUSE_ICON_SIZE=13;
const TOOL_ICON_SIZE=19;
const TOOL_ICON_SMALL_SIZE=16;
/** 이 스테이지까지는 광고 없음 (전면광고·힌트 광고 모두) */
const AD_FREE_UNTIL_STAGE=10;
/** CLEAR 창이 뜬 뒤 전면광고까지의 간격 */
const CLEAR_AD_DELAY_MS=1000;
/** 클리어 후 꽃 반짝임을 보여준 뒤 결과창 */
const RESULT_DELAY_MS=1400;
const STAGES_PER_CHAPTER=40;
const TOTAL_STAGES=240;
const CHAPTER_COUNT=Math.ceil(TOTAL_STAGES/STAGES_PER_CHAPTER);
type Dialog='pause'|'help'|'settings'|'result'|null;
function Button({children,onPress,secondary=false,disabled=false,label}:{children:React.ReactNode;onPress:()=>void;secondary?:boolean;disabled?:boolean;label?:string}){return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress} style={({pressed})=>[s.button,secondary&&s.secondary,pressed&&s.pressed,disabled&&{opacity:.35}]}><Text style={[s.buttonText,secondary&&{fontSize:14,color:'#91806b'}]}>{children}</Text></Pressable>}
function Round({icon,label,onPress}:{icon:IconName;label:string;onPress:()=>void}){return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({pressed})=>[s.round,pressed&&s.pressed]}><Icon name={icon} size={icon==='pause'?PAUSE_ICON_SIZE:HEADER_ICON_SIZE} color="#93816c"/></Pressable>}
function GameApp(){
 const [fontsLoaded,fontError]=useFonts({...FontAwesome5.font,KccSign:require('./assets/fonts/KccSign.otf')});
 const [state,dispatch]=useReducer(reducer,initialState),[dialog,setDialog]=useState<Dialog>(null),[chapter,setChapter]=useState(0),[hint,setHint]=useState<Direction[]>([]),[reduced,setReduced]=useState(false),[storageError,setStorageError]=useState(false),[today,setToday]=useState(koreaDate);
 const insets=useSafeAreaInsets(),{width,height}=useWindowDimensions(),contentWidth=Math.min(width,440),writeQueue=useRef(Promise.resolve()),mounted=useRef(true);
 const session=state.session,level=session?getLevel(session.mode,session.index,session.date):null;
 const adFree=session?.mode==='campaign'&&session.index<=AD_FREE_UNTIL_STAGE;
 const hintQuota=useHintQuota(today,adFree);
 useEffect(()=>{mounted.current=true;AsyncStorage.getItem(STORAGE).then(raw=>{if(mounted.current)dispatch({type:'hydrate',progress:parseProgress(raw)})}).catch(()=>{if(mounted.current){setStorageError(true);dispatch({type:'hydrate',progress:parseProgress(null)})}});AccessibilityInfo.isReduceMotionEnabled().then(setReduced);const motion=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduced);const app=AppState.addEventListener('change',v=>{if(v==='active')setToday(koreaDate())});return()=>{mounted.current=false;motion.remove();app.remove()}},[]);
 useEffect(()=>{if(!state.ready||(!fontsLoaded&&!fontError))return;const payload=JSON.stringify(state.progress);writeQueue.current=writeQueue.current.then(()=>AsyncStorage.setItem(STORAGE,payload)).then(()=>{if(mounted.current)setStorageError(false)}).catch(()=>{if(mounted.current)setStorageError(true)});},[state.ready,state.progress]);
 useEffect(()=>{setHint([])},[state.revision]);
 useEffect(()=>{if(!state.won||state.screen!=='game')return;const timer=setTimeout(()=>setDialog('result'),reduced?0:RESULT_DELAY_MS);return()=>clearTimeout(timer)},[state.won,state.screen,reduced]);
 useEffect(()=>{if(dialog!=='result'||adFree)return;const timer=setTimeout(()=>showStageClearAd(()=>{}),CLEAR_AD_DELAY_MS);return()=>clearTimeout(timer)},[dialog,adFree]);
 useEffect(()=>{initAds();void loadSettings().then(initBgm)},[]);
 useEffect(()=>{setBgmTrack(state.screen==='game'?'stage':'home')},[state.screen]);
 useMoveFeedback(state,level);
 useCloudProgress(state,dispatch);
 useEffect(()=>{if(state.screen==='levels')setChapter(Math.floor((continueStage-1)/STAGES_PER_CHAPTER))},[state.screen]);
 useEffect(()=>{const sub=BackHandler.addEventListener('hardwareBackPress',()=>{if(dialog==='result'){setDialog(null);dispatch({type:'home'});return true}if(dialog){setDialog(null);return true}if(state.screen==='game'){if(!state.won)setDialog('pause');else dispatch({type:'home'});return true}if(state.screen==='levels'){dispatch({type:'home'});return true}return false});return()=>sub.remove()},[dialog,state.screen,state.won]);
 const input=useRef<(d:Direction)=>void>(()=>{});input.current=d=>{if(state.screen!=='game'||state.won||dialog)return;dispatch({type:'learned'});dispatch({type:'move',direction:d})};
 const pan=useMemo(()=>PanResponder.create({onStartShouldSetPanResponder:()=>false,onMoveShouldSetPanResponderCapture:(_,g)=>Math.max(Math.abs(g.dx),Math.abs(g.dy))>10,onMoveShouldSetPanResponder:(_,g)=>Math.max(Math.abs(g.dx),Math.abs(g.dy))>10,onPanResponderRelease:(_,g)=>{if(Math.max(Math.abs(g.dx),Math.abs(g.dy))<18)return;input.current(Math.abs(g.dx)>Math.abs(g.dy)?g.dx>0?1:3:g.dy>0?2:0)},onPanResponderTerminationRequest:()=>true}),[]);
 const start=(mode:Mode,index:number)=>{setDialog(null);setHint([]);dispatch({type:'start',mode,index,date:koreaDate()})};
 const home=()=>{setDialog(null);dispatch({type:'home'})};
 const continueStage=state.progress.resume?.mode==='campaign'?state.progress.resume.index:state.progress.nextStage;
 const boardHeight=Math.max(level?level.n*20+4*(level.n-1):96,Math.min(185,(height-insets.top-insets.bottom-360-(level?.reverse?28:0))/2));
 if(!state.ready||(!fontsLoaded&&!fontError))return <View style={[s.shell,{justifyContent:'center',alignItems:'center'}]}><ActivityIndicator color="#dc8d7d"/></View>;
 return <SafeAreaView style={s.safe}><StatusBar style="dark"/><View style={[s.shell,{width:contentWidth}]}>
 {state.screen==='home'&&<HomeScreen reduced={reduced} dailyDone={!!state.progress.wins['daily-'+today]} storageError={storageError} actions={{help:()=>setDialog('help'),settings:()=>setDialog('settings'),start:()=>start('campaign',continueStage),stages:()=>{setChapter(Math.floor((continueStage-1)/STAGES_PER_CHAPTER));dispatch({type:'levels'})},daily:()=>start('daily',1)}}/>}
 {state.screen==='levels'&&<><View style={s.header}><Round icon="back" label={t('common.home')} onPress={home}/><Text style={s.stageTitle}>STAGE</Text><View style={{width:44}}/></View><View style={s.levelsBody}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chapters}>{Array.from({length:CHAPTER_COUNT},(_,i)=><Pressable accessibilityRole="button" accessibilityState={{selected:i===chapter}} key={i} onPress={()=>setChapter(i)} style={[s.chapter,i===chapter&&{backgroundColor:'#ffd4bd'}]}><Text style={s.chapterText}>{t('map.chapter',{n:i+1})}</Text></Pressable>)}</ScrollView></View><StageMap key={chapter} width={contentWidth} current={continueStage} onSelect={n=>start('campaign',n)} stages={Array.from({length:Math.min(STAGES_PER_CHAPTER,TOTAL_STAGES-chapter*STAGES_PER_CHAPTER)},(_,i)=>{const n=chapter*STAGES_PER_CHAPTER+i+1,best=state.progress.wins['campaign-'+n];return {stage:n,stars:best===undefined?null:starsFor(best,getLevel('campaign',n,today).par),locked:best===undefined&&n>state.progress.nextStage&&n!==continueStage}})}/></>}
 {state.screen==='game'&&session&&level&&<><View style={s.header}><Round icon="back" label={t('common.home')} onPress={home}/><Text style={s.stageTitle}>{session.mode==='daily'?t('game.daily'):t('game.stage',{n:String(session.index).padStart(2,'0')})}</Text><Round icon="pause" label={t('game.pause')} onPress={()=>{if(!state.won)setDialog('pause')}}/></View>
  <ScrollView bounces={false} contentContainerStyle={s.gameBody}><View style={s.stats}><Text style={s.statText}>{t('game.moves')} <Text style={s.statValue}>{session.history.length}</Text></Text><Text style={s.statText}>{t('game.par')} <Text style={s.statValue}>{level.par}</Text></Text></View>
  {level.reverse&&<Text style={s.reverse}>{t('game.reverse')}</Text>}
  <View {...pan.panHandlers} accessibilityLabel={t('game.swipeArea')} accessibilityActions={[{name:'up',label:t('dir.moveUp')},{name:'right',label:t('dir.moveRight')},{name:'down',label:t('dir.moveDown')},{name:'left',label:t('dir.moveLeft')}]} onAccessibilityAction={e=>{const d=['up','right','down','left'].indexOf(e.nativeEvent.actionName);if(d>=0)input.current(d as Direction)}} accessible>
   <Board level={level} board={0} position={session.position[0]} height={boardHeight} revision={state.revision} direction={state.direction} won={state.won} reduced={reduced}/><View style={{height:28,alignItems:'center',justifyContent:'center'}}><View style={{width:4,height:4,borderRadius:2,backgroundColor:'#d6c7b0'}}/></View><Board level={level} board={1} position={session.position[1]} height={boardHeight} revision={state.revision} direction={state.direction} won={state.won} reduced={reduced}/>
   {session.mode==='campaign'&&session.index===1&&!state.progress.swipeLearned&&<SwipeGuide reduced={reduced} direction={(solve(level,session.position)??[3])[0]??3}/>} 
  </View><View accessibilityLiveRegion="polite" accessibilityLabel={hint.map(d=>[t('dir.up'),t('dir.right'),t('dir.down'),t('dir.left')][d]).join(', ')} style={{height:30,marginTop:8,flexDirection:'row',justifyContent:'center',gap:12}}>{hint.map((d,i)=><Icon key={i} name={(['up','right','down','left'] as IconName[])[d]} color="#b19669" size={22}/>)}</View><View style={s.tools}>{[{icon:'undo' as IconName,label:t('tool.undo'),disabled:!session.history.length||state.won,action:()=>dispatch({type:'undo'})},{icon:'reset' as IconName,label:t('tool.reset'),disabled:state.won,action:()=>dispatch({type:'reset'})},{icon:'hint' as IconName,label:hintQuota.remaining>0?t('tool.hintFree',{n:hintQuota.remaining}):t('tool.hintAd'),disabled:state.won||(hintQuota.remaining===0&&!hintQuota.adReady),action:()=>hintQuota.requestHint(()=>setHint((solve(level,session.position)||[]).slice(0,3)))}].map((tool,i)=><Pressable accessibilityRole="button" accessibilityLabel={tool.label} key={tool.label} onPress={tool.action} disabled={tool.disabled} style={({pressed})=>[s.tool,i===2&&{backgroundColor:'#ffe9ac',borderColor:'#e8ce91'},tool.disabled&&{opacity:.35},pressed&&s.pressed]}><Icon name={tool.icon} color="#a18d6d" size={tool.icon==='hint'?TOOL_ICON_SIZE:TOOL_ICON_SMALL_SIZE}/><Text style={s.toolLabel}>{i===2?t('tool.hint'):tool.label}</Text>{i===2&&!hintQuota.unlimited&&<View style={s.badge}><Text style={s.badgeText}>{hintQuota.remaining>0?hintQuota.remaining:'AD'}</Text></View>}</Pressable>)}</View></ScrollView>
 </>}
 <Modal visible={dialog!==null} transparent animationType={reduced?'none':'fade'} onRequestClose={()=>dialog==='result'?home():setDialog(null)} statusBarTranslucent>
  <View style={s.modalBackdrop}><View style={s.modalCard} accessibilityViewIsModal>
   {dialog==='help'&&<><Text style={s.modalTitle}>{t('common.help')}</Text><HelpContent/><Button onPress={()=>setDialog(null)}>{t('help.ok')}</Button></>}
   {dialog==='settings'&&<><Text style={s.modalTitle}>{t('common.settings')}</Text><SettingsContent/><Button onPress={()=>setDialog(null)}>{t('common.close')}</Button></>}
   {dialog==='pause'&&<><Text style={s.modalTitle}>{t('pause.title')}</Text><Button onPress={()=>setDialog(null)}>{t('pause.resume')}</Button><Button secondary onPress={()=>setDialog('help')}>{t('common.help')}</Button><Button secondary onPress={()=>setDialog('settings')}>{t('common.settings')}</Button><Button secondary onPress={home}>{t('common.home')}</Button></>}
   {dialog==='result'&&session&&level&&<><ClearStars stars={starsFor(session.history.length,level.par)} reduced={reduced}/><Text style={s.modalTitle}>{session.mode==='campaign'&&session.index===240?'ALL CLEAR!':'CLEAR!'}</Text><View style={s.resultStats}><Text style={s.resultLabel}>{t('result.myMoves')}{`\n`}<Text style={s.resultValue}>{session.history.length}</Text></Text><Text style={s.resultLabel}>{t('game.par')}{`\n`}<Text style={s.resultValue}>{level.par}</Text></Text></View><Button onPress={()=>{if(session.mode==='daily'||session.index===240)home();else start('campaign',session.index+1)}}>{session.mode==='daily'||session.index===240?t('common.home'):t('result.next')}</Button><Button secondary onPress={()=>{setDialog(null);dispatch({type:'reset'})}}>{t('result.again')}</Button></>}
  </View>{dialog==='result'&&<Celebration reduced={reduced}/>}</View>
 </Modal>
 </View></SafeAreaView>
}
export default function App(){return <SafeAreaProvider><GameApp/></SafeAreaProvider>}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#fff8eb'},shell:{flex:1,alignSelf:'center',backgroundColor:'#fff8eb'},header:{height:60,paddingHorizontal:23,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},round:{width:44,height:44,backgroundColor:'#fffdf5',borderWidth:2,borderBottomWidth:4,borderColor:'#e8decd',borderRadius:16,alignItems:'center',justifyContent:'center'},roundText:{fontSize:24,color:'#93816c',fontWeight:'700'},stageTitle:{fontSize:18,fontWeight:'800',color:'#927761'},homeScroll:{flexGrow:1,paddingBottom:28},homeBody:{paddingHorizontal:36},title:{alignItems:'center',marginTop:12,transform:[{rotate:'-5deg'}]},twin:{fontSize:65,lineHeight:67,fontWeight:'900',letterSpacing:-3,color:'#f39b88',textShadowColor:'#e8c6a8',textShadowOffset:{width:0,height:4},textShadowRadius:0},pop:{fontSize:65,lineHeight:67,fontWeight:'900',letterSpacing:-3,color:'#8dc4a4',textShadowColor:'#c9dfb8',textShadowOffset:{width:0,height:4},textShadowRadius:0},spark:{position:'absolute',fontSize:28,color:'#edc779'},hero:{height:185},garden:{position:'absolute',bottom:18,left:0,right:0,height:75,borderRadius:100,backgroundColor:'#e5edce'},flower:{position:'absolute',fontSize:27,color:'#f1b5a7'},button:{borderRadius:19,borderWidth:2,borderBottomWidth:6,borderColor:'#df8b7c',backgroundColor:'#ffa593',paddingVertical:15,paddingHorizontal:18,alignItems:'center',marginTop:7,minHeight:54},secondary:{backgroundColor:'#fffdf6',borderColor:'#e8ddcb',borderBottomWidth:5,marginTop:14},buttonText:{fontSize:17,fontWeight:'800',color:'#754d42'},pressed:{transform:[{translateY:2},{scale:.98}],opacity:.85},daily:{backgroundColor:'#fff0ca',borderWidth:1,borderColor:'#efdfb9',borderRadius:16,padding:14,flexDirection:'row',alignItems:'center',gap:14,marginTop:23},progressText:{textAlign:'center',fontSize:10,color:'#ac9e89',marginTop:21},track:{width:110,height:5,backgroundColor:'#ece5d5',borderRadius:8,alignSelf:'center',marginTop:9,overflow:'hidden'},error:{fontSize:11,color:'#a35e53',textAlign:'center',marginTop:18},levelsBody:{paddingHorizontal:24,paddingTop:4,paddingBottom:2},chapters:{flexDirection:'row',gap:7,paddingRight:24},chapter:{backgroundColor:'#f0eadc',paddingHorizontal:12,paddingVertical:14,borderRadius:13,minHeight:44},chapterText:{fontSize:11,color:'#998870',fontWeight:'600'},levelGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},gameBody:{paddingHorizontal:22,paddingBottom:10},stats:{flexDirection:'row',justifyContent:'center',gap:26,alignItems:'center',paddingTop:4,paddingBottom:13},statText:{fontSize:10,color:'#a4927b'},statValue:{fontSize:18,color:'#927761',fontWeight:'700'},reverse:{color:'#a48b60',backgroundColor:'#fff0cb',padding:6,textAlign:'center',fontSize:11,marginBottom:8,borderRadius:8},link:{textAlign:'center',fontSize:17,color:'#c1af96',height:28,lineHeight:28},hint:{height:30,marginTop:8,textAlign:'center',fontSize:18,color:'#b19669',letterSpacing:6},tools:{flexDirection:'row',justifyContent:'center',gap:22},tool:{width:62,height:61,backgroundColor:'#fffcf3',borderWidth:2,borderBottomWidth:5,borderColor:'#e5dac7',borderRadius:18,alignItems:'center',justifyContent:'center'},toolIcon:{fontSize:27,color:'#a18d6d',lineHeight:30},toolLabel:{fontSize:9,color:'#a18d6d'},badge:{position:'absolute',top:-7,right:-7,minWidth:22,height:22,paddingHorizontal:5,borderRadius:11,backgroundColor:'#ffa593',borderWidth:2,borderColor:'#fffcf3',alignItems:'center',justifyContent:'center'},badgeText:{fontSize:10,fontWeight:'800',color:'#fff'},modalBackdrop:{flex:1,backgroundColor:'#5a534866',justifyContent:'center',alignItems:'center',padding:26},modalCard:{width:'100%',maxWidth:360,backgroundColor:'#fff9ec',borderColor:'#e3d3ba',borderWidth:3,borderRadius:29,padding:25},modalTitle:{fontSize:27,fontWeight:'800',color:'#927258',textAlign:'center',marginBottom:20,marginTop:8},help:{fontSize:13,color:'#9d8c75',lineHeight:25,textAlign:'center',marginBottom:20},stars:{fontSize:38,color:'#e7bd62',textAlign:'center',marginBottom:12},resultStats:{flexDirection:'row',justifyContent:'center',gap:40,marginBottom:20},resultLabel:{fontSize:11,color:'#a7977f',textAlign:'center',lineHeight:30},resultValue:{fontSize:27,fontWeight:'800',color:'#8e765e'}});
