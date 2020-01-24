import React from 'react';
import { View, Text, Platform } from 'react-native'; 

export const OfflieHeaderComponent = () => (
  <View style={{ height: Platform.OS === 'android' ? 55 : 40, backgroundColor: 'red', alignItems: 'center', justifyContent: 'flex-end' }}>
    <Text style={{ color: 'white', fontWeight: 'bold', letterSpacing: Platform.OS === 'android' ? 1 : 2 }}>No Internet - Offline Mode</Text>
  </View>
)