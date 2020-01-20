import React from 'react';
import { View, Text, Image } from 'react-native';
import { TouchComponent } from '../Spam'

export const ListComponent = ({ image, size, name, role, date, startTime, message, action }) => (
  <View style={{ borderWidth: 1, width: '99%', borderColor: '#f6e58d', height: 100, marginTop: 5, padding: 10, alignItems: 'center',justifyContent: 'space-around', borderRadius: 20 }}>
    <View style={{ borderBottomColor: 'blue', borderBottomWidth: 1, width: '99%', height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flex: 0.5, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        <Image source={{ uri: image && image }} style={{ height: 32, width: 32, borderRadius: 20 }} />
        <View style={{ marginLeft: 15}}>
          <Text style={{ fontSize: size.name }}>{ name }</Text>
          <Text style={{ fontSize: size.role }}>{ role }</Text>
        </View>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: size.date }}>{ date }</Text>
      </View>
    </View>
    <View style={{ width: '99%', borderColor: 'green', height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', borderColor: 'black' }}>
        <Text style={{ fontWeight: 'bold', fontSize: size.time, color: 'blue' }}>{ startTime }</Text>
      </View>
      <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', borderColor: 'black' }}>
        <TouchComponent w={ 100 } h={ 28 } color={ '#686de0' } textColor='#e056fd' text={ message } bold={ 'bold' } fromDash={ action }/>
      </View>
    </View>
  </View>
)