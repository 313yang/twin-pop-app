import React,{useEffect,useMemo,useRef,useState} from 'react';
import {ScrollView,StyleSheet,View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg,{Defs,LinearGradient,Path,Rect,Stop} from 'react-native-svg';
import {StageNode} from './StageNode';
import {mapHeight,nodePoints,pathD} from './mapLayout';
import type {StarCount} from '../../game/stars';

export type StageInfo={stage:number;stars:StarCount|null;locked:boolean};
type Props={stages:StageInfo[];current:number;width:number;onSelect:(stage:number)=>void};


/** 아래에서 위로 올라가는 스테이지 지도. 열면 현재 스테이지로 자동 스크롤 */
export function StageMap({stages,current,width,onSelect}:Props){
  const scroll=useRef<React.ComponentRef<typeof ScrollView>>(null),[viewH,setViewH]=useState(0);
  const count=stages.length,height=mapHeight(count);
  const seed=stages[0]?.stage??1;
  const points=useMemo(()=>nodePoints(count,width,seed),[count,width,seed]);
  const d=useMemo(()=>pathD(points),[points]);
  const currentIdx=stages.findIndex(s=>s.stage===current);
  useEffect(()=>{
    if(!viewH)return;
    const target=currentIdx>=0?points[currentIdx].y-viewH/2:height;
    scroll.current?.scrollTo({y:Math.max(0,Math.min(target,height-viewH)),animated:false});
  },[viewH,currentIdx,points,height]);
  // 지도를 화면 맨 아래(홈 인디케이터 영역)까지 내려서 아래 페이드가 화면 끝에 오도록
  const {bottom:safeBottom}=useSafeAreaInsets();
  return <View style={[s.root,{marginBottom:-safeBottom}]}><ScrollView ref={scroll} contentContainerStyle={{paddingBottom:safeBottom}} onLayout={e=>setViewH(e.nativeEvent.layout.height)} showsVerticalScrollIndicator={false}>
    <View style={{width,height}}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Path d={d} stroke="#efe3cf" strokeWidth={20} fill="none" strokeLinecap="round"/>
        <Path d={d} stroke="#fff6e6" strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="2 14"/>
      </Svg>
      {points.map((p,i)=>i%4===2&&<View key={`f${i}`} pointerEvents="none" style={[s.flower,{top:p.y-10,left:p.x<width/2?width-42:18}]}><Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M12 4a3 3 0 0 1 3 3 3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3-3Z" fill={i%2?'#f6c3b6':'#cfe6c0'}/></Svg></View>)}
      {/* 위 노드부터 그려서, 아래 노드의 별이 위 노드에 가리지 않게 */}
      {stages.map((st,i)=>({st,i})).reverse().map(({st,i})=><StageNode key={st.stage} stage={st.stage} point={points[i]} stars={st.stars} locked={st.locked} current={st.stage===current} onPress={()=>onSelect(st.stage)}/>)}
    </View>
  </ScrollView><Fade/><Fade bottom/></View>;
}

const BG='#fff8eb',FADE_H=18;

/** 지도 위(챕터 탭 아래)·아래 끝이 자연스럽게 사라지도록 하는 페이드 */
function Fade({bottom=false}:{bottom?:boolean}){
  const id=bottom?'mapFadeBottom':'mapFade';
  return <View pointerEvents="none" style={[s.fade,bottom?{bottom:0}:{top:0}]}><Svg width="100%" height={FADE_H}>
    <Defs><LinearGradient id={id} x1="0" y1={bottom?1:0} x2="0" y2={bottom?0:1}><Stop offset="0" stopColor={BG} stopOpacity={1}/><Stop offset="1" stopColor={BG} stopOpacity={0}/></LinearGradient></Defs>
    <Rect width="100%" height={FADE_H} fill={`url(#${id})`}/>
  </Svg></View>;
}

const s=StyleSheet.create({
  root:{flex:1},
  fade:{position:'absolute',left:0,right:0,height:FADE_H},
  flower:{position:'absolute',opacity:.8},
});
