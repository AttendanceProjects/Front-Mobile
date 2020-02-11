import React from 'react';
import { View, Text, Alert, TouchableOpacity, Platform } from 'react-native';

export const BtmListComponent = ({ typeParent, size }) => {

  const _alertResponse = type =>  {
    if( type === 'start' ) Alert.alert('Reason', typeParent.reason.start ? typeParent.reason.start : 'You not give a reason');
    else Alert.alert( 'Reason', typeParent.reason.end ? typeParent.reason.end : 'You not give a reason' );
  }

  return (
    <>
      <View style={{ flex: 0.42, alignItems: 'center', justifyContent: 'center', backgroundColor: typeParent.startIssues === 'ok' ? '#deff8b' : typeParent.startIssues === 'warning' ? '#f6eec7' : '#ec7373', borderColor: '#c7ecee', borderWidth: 1, borderRadius: 20, height: Platform.OS === 'android' ? 65 : 70 }}>
        <Text style={{ fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 10 : 15 }}>Check In</Text>
        <Text style={{ fontWeight: 'bold', fontSize: size.time ? size.time : 18, color: 'blue' }}>{ typeParent.startTime }</Text>
        <Text style={{ fontSize: Platform.OS === 'android' ? 8 : 10, color: 'black', fontWeight: 'bold', letterSpacing: 1 }}>{ typeParent.startIssues.toUpperCase() }</Text>
        {
          typeParent && typeParent.reason && typeParent.type === 'date'
            &&  <TouchableOpacity onPress={() => _alertResponse( 'start' )}>
                  <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 10 }}>Reason</Text>    
                </TouchableOpacity>
        }
      </View>
      <View style={{ flex: 0.42, alignItems: 'center', justifyContent: 'center', backgroundColor: typeParent.endIssues === 'ok' ? '#deff8b' : typeParent.endIssues === 'warning' ? '#f6eec7' : '#ec7373', borderColor: '#c7ecee', borderWidth: 1, borderRadius: 20, height: Platform.OS === 'android' ? 65 : 70 }}>
        <Text style={{ fontWeight: 'bold', fontSize: Platform.OS === 'android' && 10 }}>Check Out</Text>
        {
          typeParent && typeParent.endTime
            ?  <Text style={{ fontWeight: 'bold', fontSize: size.time ? size.time : 18, color: 'blue' }}>{ typeParent.endTime }</Text>
            : typeParent.date !== new Date().toDateString()
                ? <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#7fcd91', marginTop: 10 }}>Absent</Text> : null 
        }
        <View style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', width: '100%' }}>
          <Text style={{ fontSize: Platform.OS === 'android' ? 8 : 10, color: 'black', fontWeight: 'bold' }}>{ typeParent.endIssues.toUpperCase() }</Text>
          { typeParent && typeParent.reason.end  && typeParent.type === 'date'
            ? <TouchableOpacity
                onPress={() => _alertResponse( 'end' )}
                >
                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 10 }}>Reason</Text>
              </TouchableOpacity>
            : null }
        </View>
      </View>
    </>
  )
}