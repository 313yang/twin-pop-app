import React from 'react';
import {Pressable,StyleSheet,View} from 'react-native';
import {AppText as Text} from './AppText';
import {Icon,type IconName} from './Icon';
import {VOLUME_LEVELS,type VolumeLevel} from '../settings/settingsStore';

type Props={icon:IconName;label:string;value:VolumeLevel;onChange:(v:VolumeLevel)=>void};

/** 볼륨 0~5 단계 버튼 */
export function VolumeRow({icon,label,value,onChange}:Props){
  return <View style={s.wrap}>
    <View style={s.head}>
      <View style={s.badge}><Icon name={icon} size={14} color="#c98a76"/></View>
      <Text style={s.label}>{label}</Text>
    </View>
    <View style={s.levels} accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{min:0,max:5,now:value}}>
      {VOLUME_LEVELS.map(v=><Pressable key={v} accessibilityRole="button" accessibilityLabel={`${label} ${v}`} accessibilityState={{selected:v===value}} onPress={()=>onChange(v)}
        style={({pressed})=>[s.level,v<=value&&v>0&&s.filled,v===value&&s.selected,pressed&&s.pressed]}>
        <Text style={[s.levelText,v<=value&&v>0&&s.filledText,v===value&&s.selectedText]}>{v}</Text>
      </Pressable>)}
    </View>
  </View>;
}

const s=StyleSheet.create({
  wrap:{gap:8},
  head:{flexDirection:'row',alignItems:'center',gap:12},
  badge:{width:32,height:32,borderRadius:12,backgroundColor:'#ffe6dc',alignItems:'center',justifyContent:'center'},
  label:{flex:1,fontSize:15,fontWeight:'800',color:'#8e765e'},
  levels:{flexDirection:'row',gap:6},
  level:{flex:1,height:32,borderRadius:10,borderWidth:2,borderBottomWidth:3,borderColor:'#e9dfcd',backgroundColor:'#fffcf4',alignItems:'center',justifyContent:'center'},
  filled:{backgroundColor:'#ffe1d7',borderColor:'#f3bfae'},
  selected:{backgroundColor:'#ffa593',borderColor:'#e08d79'},
  pressed:{transform:[{translateY:1}]},
  levelText:{fontSize:13,fontWeight:'800',color:'#b8a68e'},
  filledText:{color:'#c98a76'},
  selectedText:{color:'#fff'},
});
