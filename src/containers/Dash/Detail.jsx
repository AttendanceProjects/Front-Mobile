import React, { useState, useEffect } from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { Query } from '../../graph';
import { useLazyQuery } from '@apollo/react-hooks';
import { MapComponent, LoadingComponent } from '../../components';

export const DetailContainers = ({ navigation }) => {
  const [ history, { data } ] = useLazyQuery( Query.GET_ATT_ID );
  const [ loading, setLoading ] = useState( false );
  const [ message, setMessage ] = useState( false );

  useEffect(() => {
    (async() => {
      const { access, id } = navigation.state.params,
        { code, token } = access;
      try {
        await history({ variables: { code, token, id } });
      }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ) }
    })()
  }, [])
  console.log( data);

  return (
    <View style={{ flex: 1, backgroundColor: '#353941', justifyContent: 'space-around', alignItems: 'center' }}>
      {
        data && data.findAttId
          ?
          <>
            <View style={{ flex: 0.85, padding: 10 , justifyContent: 'space-around', width: '95%', alignItems: 'center' }}>
              <View style={{ flex: 0.28, borderRadius: 20, width: '99%' }}>
                <View style={{ flex: 0.5, alignItems: 'center', flexDirection: 'row', padding: 10 }}>
                  <Image source={{ uri: data.findAttId.start_image }} style={{ width: 60, height: 60, borderRadius: 10 }} />
                  <View>
                    <Text style={{ fontSize: Platform.OS === 'android' ? 10: 15, marginLeft: 10, color: 'white', fontWeight: 'bold' }}>Check In</Text>
                    <Text style={{ fontSize: Platform.OS === 'android' ? 20 : 25, marginLeft: 10, fontWeight: 'bold', color: data.findAttId.start_issues === 'ok' ? '#a7e9af' : data.findAttId.start_issues === 'warning' ? '#fdd365' : '#ce0f3d' }}>{ data.findAttId.start }</Text>
                  </View>
                </View>
                <View style={{ flex: 0.5, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row', padding: 10 }}>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 15, marginRight: 10, color: 'white', fontWeight: 'bold' }}>Checkout</Text>
                    <Text style={{ fontSize: Platform.OS === 'android' ? 20 : 25, marginRight: 10, fontWeight: 'bold', color: data.findAttId.end_issues === 'ok' ? '#a7e9af' : data.findAttId.end_issues === 'warning' ? '#fdd365' : '#ce0f3d' }}>{ data.findAttId.end }</Text>
                  </View>
                  <Image source={{ uri: data.findAttId.end_image }} style={{ width: 60, height: 60, borderRadius: 10 }} />
                </View>
              </View>
              <View style={{ flex: 0.7, width: '99%' }}>
                <MapComponent 
                  param={{
                    start: data.findAttId.start_location,
                    end: data.findAttId.end_location
                  }}
                />
              </View>
            </View>
            <View style={{ flex: 0.1, backgroundColor: 'blue', width: '95%' }}>
              <Text>Bottom</Text>
            </View>
          </>
        : <LoadingComponent />
      }
    </View>
  )
}

//besok kelarin detail bagusin tampilannya waktunya istirahat