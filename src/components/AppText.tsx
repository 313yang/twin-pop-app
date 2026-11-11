import React from 'react';
import {Text as NativeText,StyleSheet,type TextProps} from 'react-native';
/** All app copy uses KccSign; Font Awesome manages its own icon fonts. */
export function AppText({style,...props}:TextProps){return <NativeText {...props} style={[style,styles.font]}/>;}
const styles=StyleSheet.create({font:{fontFamily:'KccSign',fontWeight:'normal',fontStyle:'normal'}});
