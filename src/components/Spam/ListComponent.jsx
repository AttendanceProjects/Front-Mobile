import React from 'react';
import { View, Text, Image, Platform, ImageBackground } from 'react-native';
import { TouchComponent } from '../Spam'

export const ListComponent = ({ image, size, name, role, date, startTime, message, action, type, startIssues }) => (
  <View style={{ borderWidth: 1, width: '99%', borderColor: '#dff9fb', backgroundColor: '#dff9fb', height: 150, marginTop: 5, padding: 10, alignItems: 'center',justifyContent: 'space-around', borderRadius: 20 }}>
    <View style={{ borderBottomColor: '#f6e58d', borderBottomWidth: 1, width: '99%', height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      {
        image && name && role && startTime
          ?
            <>
              <View style={{ flex: 0.7, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                <Image source={{ uri: image && image }} style={{ height: 40, width: 40, borderRadius: 20, marginLeft: 20 }} />
                <View style={{ marginLeft: 35}}>
                  <Text style={{ fontSize: size.name, fontWeight: 'bold' }}>{ name }</Text>
                  <Text style={{ fontSize: size.role, fontWeight: 'bold' }}>{ role }</Text>
                </View>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: size.date, fontWeight: 'bold' }}>{ date }</Text>
              </View>
            </>
          : <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Text style={{ fontWeight: 'bold', letterSpacing: 2 }}> PRESENT NOW </Text>
            </View>
      }
    </View>
    <View style={{ width: '99%', borderColor: 'green', height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#c7ecee', borderColor: '#c7ecee', borderWidth: 1, borderRadius: 20, height: 55 }}>
        { name && <Text style={{ fontWeight: 'bold' }}>Check In</Text> }
        <Text style={{ fontWeight: 'bold', fontSize: size.time, color: 'blue' }}>{ startTime }</Text>
      </View>
      <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchComponent w={ 100 } h={ 35 } color={ '#c7ecee' } textColor='#e056fd' text={ message } bold={ 'bold' } fromDash={ action } type={ type }/>
        { startIssues && <Text style={{ fontSize: 8, marginTop: 5 }}>Issues: <Text style={{ color: startIssues === 'ok' ? 'green' : startIssues === 'warning' ? 'yellow' : 'red' }}>{ startIssues.toUpperCase() }</Text></Text> }
      </View>
    </View>
  </View>
)