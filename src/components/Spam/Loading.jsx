import React from 'react';
import { ActivityIndicator, View, Text, Image } from 'react-native';

export const LoadingSimpleComponent = ({ color, t, r, s }) => <ActivityIndicator color={ color } size={ s ? s : 'small' } style={{ position: 'absolute', top: t && t, right: r && r }}  />

export const LoadingListComponent = ({ color, s, index, bg }) => (
  <>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: index && index, backgroundColor: bg ? bg : '#26282b' }}>
      <ActivityIndicator color={ color } size={ s ? s : 'large' } />
    </View>
  </>
)

export const LoadingCheckInOutComponent = ({ text, gif, bg }) => (
  <>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: bg && bg }}>
      <Image source={{ uri: gif.image && gif.image }} style={{ width: gif.w ? gif.w : 50, height: gif.h ? gif.h : 50 }} />
      <Text style={{ fontSize: 20, color: 'blue', letterSpacing: 2, marginTop: 30 }}> { text.first }</Text>
      <Text style={{ fontSize: 15, color: 'red', letterSpacing: 2, marginTop: 10 }}>{ text.second }</Text>
    </View>
  </>
)

export const LoadingFilterComponent = ({ text, color }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator color={ color } size={ 'large' } />
    <Text style={{ fontSize: 20, color: 'blue', letterSpacing: 2, marginTop: 30 }}> { text.first }</Text>
    <Text style={{ fontSize: 15, color: 'red', letterSpacing: 2, marginTop: 10 }}>{ text.second }</Text>
  </View>
)