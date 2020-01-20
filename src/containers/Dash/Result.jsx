import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { View, Text } from 'react-native';
import { ErrorComponent, HeaderComponent } from '../../components/Spam';

export const Result = ({ navigation }) => {
  const [ message, setMessage ] = useState( false );
  const [ location, setLocation ] = useState({});

  useEffect(() => {
    console.log( navigation.state.params );
    if( navigation.state.params.coords ) {
      const { latitude, longitude } = navigation.state.params.coords;
      setLocation({ latitude, longitude })
    } else if( navigation.state.params.error ) {
      setMessage( navigation.state.params.error );
    }
  }, [])
  return (
    <>
      {
        message
          ?
            <ErrorComponent.ErrorGlobal text={ message } />
          :
        location
          && 
            <>
              <HeaderComponent />
              <View>

              </View>
            </>
      }
    </>
  )
}