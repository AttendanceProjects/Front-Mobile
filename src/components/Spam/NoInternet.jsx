import React from 'react';
import { View, Text, Platform } from 'react-native'; 

export const OfflieHeaderComponent = () => (
  <View style={{ height: Platform.OS === 'android' ? 50 : 35, backgroundColor: 'red', alignItems: 'center', justifyContent: 'flex-end' }}>
    <Text style={{ color: 'white', fontWeight: 'bold', letterSpacing: Platform.OS === 'android' ? 2 : 1 }}>No Internet - Offline Mode</Text>
  </View>
)