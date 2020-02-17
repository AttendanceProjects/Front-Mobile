import React from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator} from 'react-native';

export const ListCorrectionComponent = ({ item, checkAvailable, loadingCheck, message }) => (
  <TouchableOpacity style={{ height: 60, width: '100%', marginTop: 15, paddingLeft: 10, paddingRight: 10 }} onPress={_ => checkAvailable( item._id )}>
    <View style={{ width: '100%', backgroundColor: '#90b8f8', borderRadius: 5, height: '100%' }}>
      <View style={{ width: '100%',  flexDirection: 'row', justifyContent: 'space-around', height: message ? '80%' : '100%' }} >
        <View style={{ width: '45%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14 }}>{ item.date }</Text>
        </View>
        <View style={{ width: '55%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontWeight: 'bold', color: 'white', fontSize: Platform.OS === 'android' ? 10 : 12, letterSpacing: 2 }}>Check In : <Text style={{ color: 'green', fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 12 : 15 }}>{ item.start }</Text></Text>
          <Text style={{ fontWeight: 'bold', color: 'white', fontSize: Platform.OS === 'android' ? 10 : 12, letterSpacing: 2 }}>Check Out : <Text style={{ color: 'green', fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 12 : 15 }}>{ item.end }</Text></Text>
        </View>
        { loadingCheck
          &&  <View style={{ width: '15%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={ 'red' } />
              </View> }
      </View>
    </View>
  </TouchableOpacity>
)