import React from 'react';
import {StyleSheet,Switch,View} from 'react-native';
import Constants from 'expo-constants';
import {AppText as Text} from './AppText';
import {Icon,type IconName} from './Icon';
import {t as tr} from '../i18n';
import {cloudAvailable} from '../sync/useCloudProgress';
import {updateSettings,useSettings} from '../settings/settingsStore';
import {VolumeRow} from './VolumeRow';

const ON='#ffa593',OFF='#e3d8c6';


/** 설정 창 내용: 효과음·배경음 볼륨, 진동, iCloud 상태, 버전 */
export function SettingsContent(){
  const settings=useSettings(),cloud=cloudAvailable();
  return <View style={s.wrap}>
    <VolumeRow icon="volume" label={tr('settings.sfx')} value={settings.sfxVolume} onChange={v=>updateSettings({sfxVolume:v})}/>
    <VolumeRow icon="music" label={tr('settings.bgm')} value={settings.bgmVolume} onChange={v=>updateSettings({bgmVolume:v})}/>
    <View style={s.row}>
      <View style={s.badge}><Icon name="vibrate" size={14} color="#c98a76"/></View>
      <Text style={s.label}>{tr('settings.haptics')}</Text>
      <Switch accessibilityLabel={tr('settings.haptics')} value={settings.haptics} onValueChange={v=>updateSettings({haptics:v})} trackColor={{true:ON,false:OFF}} thumbColor="#fff" ios_backgroundColor={OFF}/>
    </View>
    <View style={s.divider}/>
    <View style={s.row}>
      <View style={s.badge}><Icon name="cloud" size={14} color="#c98a76"/></View>
      <Text style={s.label}>{tr('settings.cloud')}</Text>
      <Text style={s.value}>{cloud?tr('settings.cloudOn'):tr('settings.cloudOff')}</Text>
    </View>
    <View style={s.row}>
      <View style={s.badge}><Icon name="info" size={14} color="#c98a76"/></View>
      <Text style={s.label}>{tr('settings.version')}</Text>
      <Text style={s.value}>{Constants.expoConfig?.version??'-'}</Text>
    </View>
  </View>;
}

const s=StyleSheet.create({
  wrap:{gap:14,marginBottom:22},
  row:{flexDirection:'row',alignItems:'center',gap:12,minHeight:36},
  badge:{width:32,height:32,borderRadius:12,backgroundColor:'#ffe6dc',alignItems:'center',justifyContent:'center'},
  label:{flex:1,fontSize:15,fontWeight:'800',color:'#8e765e'},
  value:{fontSize:14,color:'#a7977f'},
  divider:{height:1,backgroundColor:'#efe3cf',marginVertical:2},
});
