import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

export const StartReasonComponent = ({ err, set, reason, action }) => (
  <View style={{ width: '80%', height: err ? 100 : 80, backgroundColor: '#5b5656', borderRadius: 20, alignItems: 'center', justifyContent: 'space-around', marginTop: 20 }}>
    <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Reason</Text>
    <View style={{ width: '80%', height: 20, justifyContent: 'center' }}>
      <TextInput onChangeText={msg => set( msg )} value={ reason } keyboardType='default' autoCapitalize={ false } autoCorrect={ false } style={{ borderRadius: 20, color: 'black', marginTop: -5, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white' }} placeholder={ 'Input your reason' } placeholderTextColor={ 'black' }/>
    </View>
    <TouchableOpacity onPress={ () => action() } style={{ height: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0134d', width: '50%', borderRadius: 20 }}>
      <Text>Input</Text>
    </TouchableOpacity>
    <Text style={{ color: 'red', fontSize: 15, fontWeight: 'bold' }}>{ err }</Text>
  </View>
)