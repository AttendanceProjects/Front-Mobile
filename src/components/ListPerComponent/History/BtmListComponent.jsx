import React from 'react';
import Font from 'react-native-vector-icons/FontAwesome5';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';

export const BtmListComponent = ({ typeParent, size, nav }) => (
  <>
    <View style={{ flex: 0.42, alignItems: 'center', justifyContent: 'center', backgroundColor: typeParent.startIssues === 'ok' ? '#deff8b' : typeParent.startIssues === 'warning' ? '#f6eec7' : '#ec7373', borderColor: '#c7ecee', borderWidth: 1, borderRadius: 20, height: Platform.OS === 'android' ? 75 : 80 }}>
      <Text style={{ fontWeight: 'bold', fontSize: Platform.OS === 'android' && 12 }}>Check In</Text>
      <Text style={{ fontWeight: 'bold', fontSize: size.time ? size.time : 18, color: 'blue' }}>{ typeParent.startTime }</Text>
      <Text style={{ fontSize: Platform.OS === 'android' ? 8 : 10, color: 'black', fontWeight: 'bold', letterSpacing: 1 }}>{ typeParent.startIssues.toUpperCase() }</Text>
    </View>
    <View style={{ flex: 0.42, alignItems: 'center', justifyContent: 'center', backgroundColor: typeParent.endIssues === 'ok' ? '#deff8b' : typeParent.endIssues === 'warning' ? '#f6eec7' : '#ec7373', borderColor: '#c7ecee', borderWidth: 1, borderRadius: 20, height: Platform.OS === 'android' ? 75 : 80 }}>
      <Text style={{ fontWeight: 'bold', fontSize: Platform.OS === 'android' && 12 }}>Check Out</Text>
      <Text style={{ fontWeight: 'bold', fontSize: size.time ? size.time : 18, color: 'blue' }}>{ typeParent.endTime }</Text>
      <Text style={{ fontSize: Platform.OS === 'android' ? 8 : 10, color: 'black', fontWeight: 'bold' }}>{ typeParent.endIssues.toUpperCase() }</Text>
      {
        typeParent.reason && typeParent.reason.end
          ?  <Text style={{ fontSize: Platform.OS === 'android' ? 5 : 7, color: 'red', fontWeight: 'bold', marginTop: Platform.OS === 'android' ? 0 : 5 }}>
                { typeParent.reason.end.toUpperCase() }
              </Text> : null
      }
    </View>
    <TouchableOpacity
      style={{ flex: 0.12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#26282b', borderColor: '#26282b', borderWidth: 1, borderRadius: 20, height: 50 }}
      onPress={() => { typeParent.action() }}
    >
      <Font name='map' size={ 20 } color={ 'white' }/>
    </TouchableOpacity>
  </>
)