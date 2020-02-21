import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Query } from '../../graph';
import { useLazyQuery } from '@apollo/react-hooks';
import { MapComponent, ClockComponent } from '../../components';
import Font from 'react-native-vector-icons/FontAwesome5'

export const DetailContainers = ({ navigation }) => {
  const [ history, { data, loading } ] = useLazyQuery( Query.GET_ATT_ID );
  const [ message, setMessage ] = useState( false );
  const [ getId, setId ] = useState( '' );

  useEffect(() => {
    (async() => {
      const { access, id } = navigation.state.params,
        { code, token } = access;
      setId( id );
      try {
        await history({ variables: { code, token, id } });
      }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message );  _onClear( setMessage ) }
    })()
  }, [])

  const _onClear = meth => setTimeout(() => meth( false ), 3500);
  
  return (
    <View style={{ flex: 1, backgroundColor: '#353941', justifyContent: loading ? 'center' : 'space-around', alignItems: 'center' }}>
      { loading
          && <ActivityIndicator color='white' size='large' /> }
      { message 
          && <Text style={{ fontSize: 20, color: 'red', fontWeight: 'bold' }}>{ message }</Text>  }
      {
        data && data.findAttId && !loading && !message
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
            <View style={{ flex: 0.1, width: '95%', alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => navigation.navigate( 'Form', { id: getId })}style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'white', height: 70, borderRadius: 10, shadowOpacity: 1, shadowColor: 'white', width: 100 }}>
                <Font name='crop-alt' size={ 25 } />
                <Text style={{ fontSize: Platform.OS === 'android' ? 15 : 18, color: 'white', fontWeight: 'bold' }}>Correction</Text>
              </TouchableOpacity>
            </View>
          </>
        : null
      }
    </View>
  )
}

//besok kelarin detail bagusin tampilannya waktunya istirahat