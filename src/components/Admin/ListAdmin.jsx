import React from 'react';
import { View, Text, TouchableOpacity , ActivityIndicator } from 'react-native';

export const ListComponentAdmin = ({ item, loading, action }) => (
  <TouchableOpacity onPress={ () => action( true, item._id ) } style={{ marginTop: 10, height: 100, width: '97%', borderRadius: 10, padding: 10, backgroundColor: '#F1F1F1' }}>
    <View style={{ height: '30%', flexDirection: 'row' }}>
      <Text style={{ width: '50%' }}>
        <Text style={{ fontSize: Platform.OS === 'android' ? 8 : 12, color: 'grey' }}>
          Created At: &nbsp;
        </Text>
        <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 14, color: 'black', fontWeight: 'bold' }}>
          {item.createdAt && !loading
            ? new Date( item.createdAt ).toDateString('en-US', {timeZone: 'Asia/Jakarta'})
            : ' - ' }
        </Text>
      </Text>
      <Text style={{ textAlign: 'right', width: '50%' }}>
        <Text style={{ fontSize: Platform.OS === 'android' ? 8 : 12, color: 'grey' }}>
          Reason &nbsp; 
        </Text>
        <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 14 , color: 'black', fontWeight: 'bold' }}>
          {item.reason && !loading
            ? item.reason
            : loading
                ? <LoadingLocal />
                : ' - '}
        </Text>
      </Text>
    </View>
    <View style={{ flexDirection: 'row', width: '100%', height: '70%' }}>
      <View style={{ width: '55%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        { ['Username', 'email', 'phone'].map((li, i) => <ListDataComponent loading={ loading } item={ li } key={ i } data={ item.UserId } />)}
      </View>
      <View style={{ width: '45%', height: '100%', alignItems: 'center' }}>
        <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 13, color: 'grey' }}>Request</Text>
        <View style={{ wdith: '100%', flexDirection: 'row', alignItems: 'center', height: '80%' }}>
          <Text style={{ width: '50%', fontSize: Platform.OS === 'android' ? 12: 14, fontWeight: 'bold', textAlign: 'center' }}>
            { item.start_time && !loading
                ? item.start_time
                : ' - '}
          </Text>
          <Text style={{ width: '50%', fontSize: Platform.OS === 'android' ? 12 : 14, fontWeight: 'bold', textAlign: 'center' }}>
            { item.end_time && !loading
                ? item.end_time
                : ' - '}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
)


const ListDataComponent = ({ item, data, loading }) => (
  <View style={{ flexDirection: 'row', width: '100%' }}>
    <Text style={{ width: '30%', fontSize: Platform.OS === 'android' ? 10 : 12, color: 'grey' }}>{ item }: &nbsp; </Text>
    <Text style={{ width: '70%', fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 10 : 13 }}>
      { item === 'Username' && data && data.username && !loading
          ? data.username.toUpperCase()
          : item === 'email' && data && data.email && !loading
              ? (data.email.length > 21 ? `${ data.email.slice(0, 21) }...` : data.email )
              : item === 'phone' && data && data.phone && !loading
                  ? data.phone
                  : loading
                      ? <LoadingLocal />
                      : ' - '}
    </Text>
  </View>
)

const LoadingLocal = _ => <ActivityIndicator color='black' size='small' />
