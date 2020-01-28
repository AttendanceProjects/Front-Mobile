import React from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import { IconComponent } from './../../Spam';

export const TopListComponent = ({ typeParent, size, justy, nav, data }) => (
  <>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: justy ? justy : 'space-around', marginBottom: Platform.OS === 'android' ? 0 : 0 }}>
      <View style={{ marginLeft: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: size.name, fontWeight: 'bold' }}>{ typeParent.username.toUpperCase() }</Text>
        <Text style={{ fontSize: size.role, fontWeight: 'bold' }}>{ typeParent.role }</Text>
      </View>
    </View>
    <View style={{ marginBottom: 5 }}>
      <Text style={{ fontSize: size.date, fontWeight: 'bold' }}>{ typeParent.date }</Text>
    </View>
  </>
)