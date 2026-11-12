import {StyleSheet} from 'react-native';
import {NODE} from './mapLayout';
export default StyleSheet.create({
  node:{width:NODE,height:NODE,borderRadius:NODE/2,borderWidth:2.5,borderBottomWidth:5,borderColor:'#e6dac5',backgroundColor:'#fffcf4',alignItems:'center',justifyContent:'center'},
  done:{backgroundColor:'#dcecd3',borderColor:'#b9d1ab'},
  current:{backgroundColor:'#ffb9a6',borderColor:'#e08d79',transform:[{scale:1.12}]},
  pressed:{transform:[{translateY:2},{scale:.96}]},
  locked:{backgroundColor:'#efe8dc',borderColor:'#e2d8c6'},
  text:{fontSize:15,fontWeight:'800',color:'#9a8168'},
  currentText:{color:'#fff'},
});
