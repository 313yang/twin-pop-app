import React from 'react';
import {StyleSheet,View} from 'react-native';

type Props={mint:boolean};

const PALETTE={
  peach:{base:'#cdb196',face:'#e6d1bc',rim:'#f2e3d3',shine:'#fbf3ea'},
  mint:{base:'#a9bd91',face:'#cfdcb9',rim:'#e2ebd1',shine:'#f4f8ea'},
};

/** 살짝 솟은 돌 블록: 어두운 받침 + 밝은 윗면 + 하이라이트 */
export function WallBlock({mint}:Props){
  const c=mint?PALETTE.mint:PALETTE.peach;
  return <View style={[StyleSheet.absoluteFill,s.base,{backgroundColor:c.base}]}>
    <View style={[s.face,{backgroundColor:c.face,borderColor:c.rim}]}>
      <View style={[s.shine,{backgroundColor:c.shine}]}/>
    </View>
  </View>;
}

const s=StyleSheet.create({
  base:{borderRadius:8},
  face:{position:'absolute',left:1,right:1,top:1,bottom:5,borderRadius:7,borderWidth:1.5},
  shine:{position:'absolute',left:'14%',top:'16%',width:'16%',height:4,borderRadius:2,opacity:.85,transform:[{rotate:'-12deg'}]},
});
