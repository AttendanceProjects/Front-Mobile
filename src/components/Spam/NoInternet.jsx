import React from 'react';
import { View, Text, Platform } from 'react-native'; 

export default () => (
  <View style={{ height: 50, backgroundColor: 'red', alignItems: 'center', justifyContent: 'flex-end' }}>
    <Text style={{ color: 'white', fontWeight: 'bold', letterSpacing: Platform.OS === 'android' ? 2 : 1 }}>No Internet - Offline Mode</Text>
  </View>
)