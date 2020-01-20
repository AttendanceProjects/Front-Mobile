import React from 'react';
import { ActivityIndicator, View, Text, Image } from 'react-native';

export const LoadingComponent = ({ color, t, r, s, text, index, gif, bg }) => (
  <>
    {
      text
        ?
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: index && index, backgroundColor: bg && bg }}>
          {
            gif && <Image source={{ uri: gif.image && gif.image }} style={{ width: gif.w ? gif.w : 50, height: gif.h ? gif.h : 50 }} />
          }
          {
            !gif && <ActivityIndicator color={ color } size={ s ? s : 'large' } />
          }
          <Text style={{ fontSize: 20, color: 'blue', letterSpacing: 2, marginTop: 30 }}> { text.first }</Text>
          <Text style={{ fontSize: 15, color: 'red', letterSpacing: 2, marginTop: 10 }}>{ text.second }</Text>
        </View>
        : <ActivityIndicator color={ color } size={ s ? s : 'small' } style={{ position: 'absolute', top: t, right: r }}  />
    }
  </>
)