import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Query } from '../../graph';
import { useLazyQuery } from '@apollo/react-hooks';
import { MapComponent, LoadingComponent, ClockComponent } from '../../components';

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
  
  return (
    <View style={{ flex: 1, backgroundColor: '#353941', justifyContent: 'space-around', alignItems: 'center' }}>
      {
        data && data.findAttId
          ?
          <>
            <View style={{ flex: 0.85, padding: 10 , justifyContent: 'space-around', width: '95%', alignItems: 'center' }}>
              <View style={{ flex: 0.28, borderRadius: 20, width: '99%' }}>
                <ClockComponent nav={ navigation.navigate } image={{ start: data.findAttId.start_image, end: data.findAttId.end_image }} issues={{ start: data.findAttId.start_issues, end: data.findAttId.end_issues }} time={{ start: data.findAttId.start, end: data.findAttId.end }}/>
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