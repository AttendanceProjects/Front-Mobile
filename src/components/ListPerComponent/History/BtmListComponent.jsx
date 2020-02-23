import React from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { HistoryStyle } from './HistoryStyle';

const {
  container_bottom,
  font_medium,
  font_small,
  font_clock,
  message_reason,
  content_reason
} = HistoryStyle

export const BtmListComponent = ({ typeParent, size }) => {

  const _alertResponse = type =>  {
    if( type === 'start' ) Alert.alert('Reason', typeParent.reason.start ? typeParent.reason.start : 'You not give a reason');
    else Alert.alert( 'Reason', typeParent.reason.end ? typeParent.reason.end : 'You not give a reason' );
  }

  return (
    <>
      <View style={{ ...container_bottom, backgroundColor: typeParent.startIssues === 'ok' ? '#deff8b' : typeParent.startIssues === 'warning' ? '#f6eec7' : '#ec7373' }}>
        <Text style={ font_medium }>Check In</Text>
        <Text style={{ ...font_clock, fontSize: size.time ? size.time : 18, }}>{ typeParent.startTime }</Text>
        <Text style={ font_small }>{ typeParent.startIssues.toUpperCase() }</Text>
        {
          typeParent && typeParent.reason && typeParent.type === 'date'
            &&  <TouchableOpacity onPress={() => _alertResponse( 'start' )}>
                  <Text style={{ ...font_small, color: 'red' }}>Reason</Text>    
                </TouchableOpacity>
        }
      </View>
      <View style={{ ...container_bottom, backgroundColor: typeParent.endIssues === 'ok' ? '#deff8b' : typeParent.endIssues === 'warning' ? '#f6eec7' : '#ec7373', borderColor: '#c7ecee' }}>
        <Text style={ font_medium }>Check Out</Text>
        {
          typeParent && typeParent.endTime
            ?  <Text style={{ ...font_clock, fontSize: size.time ? size.time : 18 }}>{ typeParent.endTime }</Text>
            : typeParent.date !== new Date().toDateString()
                ? <Text style={ message_reason }>Absent</Text> : null 
        }
        <View style={ content_reason }>
          <Text style={ font_small }>{ typeParent.endIssues.toUpperCase() }</Text>
          { typeParent && typeParent.reason.end  && typeParent.type === 'date'
            ? <TouchableOpacity
                onPress={() => _alertResponse( 'end' )}
                >
                <Text style={{ ...font_small, color: 'red' }}>Reason</Text>
              </TouchableOpacity>
            : null }
        </View>
      </View>
    </>
  )
}