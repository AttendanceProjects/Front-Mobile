import React from 'react';
import { View, Image, Text } from 'react-native';

export const ErrorGlobal = ({ size, color, text }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Image source={ require('../../../assets/sadforerror.png') } style={{ width: 200, height: 200 }} />
    <Text style={{ fontSize: size ? size : 20, color: color ? color : 'red', textAlign: 'center' }}>
      { text ? text : `Whopss!! Sorry, 
Something Error. Please try again later`}
    </Text>
  </View>
)

export const SimpleError = ({ t, co, size, text }) => <Text style={{ color: co ? co : 'red', fontSize: size ? size : 15, position: 'absolute', top: t }}>{ text ? text : 'Something error' }</Text>