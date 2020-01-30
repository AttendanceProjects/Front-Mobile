import React from 'react';
import { View, Image, TouchableOpacity, Platform, Text } from 'react-native';

export const ClockComponent = ({ nav, image, issues, time }) => (
  <>
    <View style={{ flex: 0.5, alignItems: 'center', flexDirection: 'row', padding: 10 }}>
      { image && image.start
          ? <TouchableOpacity onPress={() => nav( 'Image', { url: image.start } )}>
              <Image source={{ uri: image.start }} style={{ width: 60, height: 60, borderRadius: 10 }} />
            </TouchableOpacity> : null}
      <View>
        <Text style={{ fontSize: Platform.OS === 'android' ? 10: 15, marginLeft: 10, color: 'white', fontWeight: 'bold' }}>Check In</Text>
        {  issues && issues.start
            ? <Text style={{ fontSize: Platform.OS === 'android' ? 20 : 25, marginLeft: 10, fontWeight: 'bold', color: issues.start === 'ok' ? '#a7e9af' : issues.start === 'warning' ? '#fdd365' : '#ce0f3d' }}>{ time.start && time.start }</Text> : null}
      </View>
    </View>
    <View style={{ flex: 0.5, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row', padding: 10 }}>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 15, marginRight: 10, color: 'white', fontWeight: 'bold' }}>Checkout</Text>
        {  issues && issues.end
            ? <Text style={{ fontSize: Platform.OS === 'android' ? 20 : 25, marginRight: 10, fontWeight: 'bold', color: issues.end === 'ok' ? '#a7e9af' : issues.end === 'warning' ? '#fdd365' : '#ce0f3d' }}>{ time.end && time.end }</Text> : null}
      </View>
      { image && image.end
          ? <TouchableOpacity onPress={() => nav( 'Image', { url: image.end } )}>
              <Image source={{ uri: image.end }} style={{ width: 60, height: 60, borderRadius: 10 }} />
            </TouchableOpacity> : null }
    </View>
  </>
)