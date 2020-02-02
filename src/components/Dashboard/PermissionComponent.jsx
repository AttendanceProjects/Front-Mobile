import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Font from 'react-native-vector-icons/FontAwesome5';

export const PermissionComponent = ({ type, action }) => (
  <TouchableOpacity style={{ backgroundColor: 'white', height: 50, width: Platform.OS === 'android' ? 120 : 110, borderRadius: 20, alignItems: 'center', flexDirection: 'row', marginLeft: 10 }}>
    <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
      <Font name={ type && type.icon ? type.icon : 'null' } size={ 20 } />
    </View>
    <View style={{ marginLeft: 15 }}>
      <Text style={{ color: 'grey', fontSize: Platform.OS === 'android' ? 7 : 10 }}>Submit</Text>
      <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 13 }}>{ type && type.name ? type.name : null }</Text>
    </View>
  </TouchableOpacity>
)