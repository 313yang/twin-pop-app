import React from 'react';
import {Pressable,StyleSheet,View} from 'react-native';
import nodeStyle from './nodeStyle';
import {AppText as Text} from '../AppText';
import {Icon} from '../Icon';
import {NODE,type Point} from './mapLayout';
import type {StarCount} from '../../game/stars';
import {t} from '../../i18n';

type Props={stage:number;point:Point;stars:StarCount|null;locked:boolean;current:boolean;onPress:()=>void};

const GOLD='#e7bd62',EMPTY='#e3d6c0',STAR_SIZE=10,LOCK_SIZE=15;

/** 지도 위 스테이지 동그라미 + 위쪽 별 */
export function StageNode({stage,point,stars,locked,current,onPress}:Props){
  const done=stars!==null;
  return <View style={[s.wrap,{left:point.x-NODE/2,top:point.y-NODE/2}]}>
    {done&&<View style={s.stars}>{[0,1,2].map(i=><View key={i} style={i===1&&{marginTop:-4}}><Icon name={i<stars?'star':'starEmpty'} size={STAR_SIZE} color={i<stars?GOLD:EMPTY}/></View>)}</View>}
    <Pressable accessibilityRole="button" accessibilityLabel={[t('map.stageLabel',{n:stage}),locked?t('map.locked'):done?t('map.stars',{n:stars}):''].filter(Boolean).join(', ')} accessibilityState={{disabled:locked}} disabled={locked} onPress={onPress}
      style={({pressed})=>[nodeStyle.node,done&&nodeStyle.done,current&&nodeStyle.current,locked&&nodeStyle.locked,pressed&&nodeStyle.pressed]}>
      {locked?<Icon name="lock" size={LOCK_SIZE} color="#c9bca7"/>:<Text style={[nodeStyle.text,current&&nodeStyle.currentText]}>{stage}</Text>}
    </Pressable>
  </View>;
}

const s=StyleSheet.create({
  wrap:{position:'absolute',width:NODE,height:NODE,alignItems:'center'},
  stars:{position:'absolute',top:-14,flexDirection:'row',gap:1},
});
