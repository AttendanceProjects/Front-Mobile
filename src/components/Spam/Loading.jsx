import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

export default ({ color, t, r, s, text }) => (
  <>
    {
      text
        ?
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={ color } size={ s ? s : 'large' } />
          <Text style={{ fontSize: 20, color: 'blue', letterSpacing: 2, marginTop: 30 }}> { text.first }</Text>
          <Text style={{ fontSize: 15, color: 'red', letterSpacing: 2, marginTop: 10 }}>{ text.second }</Text>
        </View>
        : <ActivityIndicator color={ color } size={ s ? s : 'small' } style={{ position: 'absolute', top: t, right: r }}  />
    }
  </>
)