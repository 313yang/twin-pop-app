import React from 'react';
import {StyleSheet,View} from 'react-native';
import {AppText as Text} from './AppText';
import {Icon,type IconName} from './Icon';
import {t} from '../i18n';

type Rule={icon:IconName;key:1|2|3|4|5};

const RULES:Rule[]=[{icon:'hand',key:1},{icon:'block',key:2},{icon:'seedling',key:3},{icon:'swap',key:4},{icon:'star',key:5}];

/** 게임 방법 안내 */
export function HelpContent(){
  return <View style={s.list}>
    {RULES.map(r=><View key={r.key} style={s.row}>
      <View style={s.badge}><Icon name={r.icon} size={15} color="#c98a76"/></View>
      <View style={s.textBox}><Text style={s.title}>{t(`help.r${r.key}.title`)}</Text><Text style={s.body} lineBreakStrategyIOS="hangul-word" textBreakStrategy="simple">{t(`help.r${r.key}.body`)}</Text></View>
    </View>)}
  </View>;
}

const s=StyleSheet.create({
  list:{gap:14,marginBottom:22},
  row:{flexDirection:'row',gap:12,alignItems:'flex-start'},
  badge:{width:32,height:32,borderRadius:12,backgroundColor:'#ffe6dc',alignItems:'center',justifyContent:'center'},
  textBox:{flex:1},
  title:{fontSize:14,fontWeight:'800',color:'#8e765e',marginBottom:2},
  body:{fontSize:12,lineHeight:18,color:'#a7977f'},
});
