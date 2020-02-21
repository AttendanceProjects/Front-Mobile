import React from 'react';
import { View, Image, Text } from 'react-native';


export const ErrorFilterComponent = ({ text, size }) => (
  <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
    <Image source={ require('../../../assets/sadforerror.png') } style={{ width: 200, height: 200 }} />
    <Text style={{ fontSize: size ? size : 20, color: 'red', textAlign: 'center' }}>
      { text ? text : `Whopss!! Sorry, 
Something Error. Please try again later`}
    </Text>
  </View>
)

export const ErrorCameraComponent = ({ text }) => (
  <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
    <Image source={ require('../../../assets/NoCamera.png' ) } style={{ width: 200, height: 200 }} />
    <Text style={{ fontSize: 20, color: 'red', textAlign: 'center' }}>
      { text ? text : `Whopss!! Sorry, 
Something Error. Please try again later`}
    </Text>
  </View>
)

export const ErrorCheckInOutComponent = ({ text }) => (
  <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
    <Image source={ require('../../../assets/sadforerror.png') } style={{ width: 200, height: 200 }} />
    <Text style={{ fontSize: 20, color: 'red', textAlign: 'center' }}>
      { text ? text : `Whopss!! Sorry, 
Something Error. Please try again later`}
    </Text>
  </View>
)

export const SimpleError = ({ t, co, size, text }) => <Text style={{ color: co ? co : 'red', fontSize: size ? size : 15, position: 'absolute', top: t ? t : 0 }}>{ text ? text : 'Something error' }</Text>