import React from 'react';
import {View} from 'react-native';
import Svg,{Circle,Path} from 'react-native-svg';
/** The original board label is a face-only pill, not a player sprite. */
export function FaceBadge({mint=false}:{mint?:boolean}){const color=mint?'#78a688':'#cb8c7c';return <View style={{width:36,height:19,borderRadius:8,alignItems:'center',justifyContent:'center',backgroundColor:mint?'#cce6d5':'#ffd7ca'}}><Svg width={24} height={15} viewBox="0 0 24 15"><Circle cx={6} cy={6} r={1.5} fill={color}/><Circle cx={18} cy={6} r={1.5} fill={color}/><Path d="M9 8Q12 13 15 8" fill="none" stroke={color} strokeWidth={1.3} strokeLinecap="round"/></Svg></View>}
