import React, { useState, useEffect } from 'react';
import { CheckLocation } from '../../helpers';
import { MapCheck } from '../../components';
import { View, Platform, ActivityIndicator, Text, Button } from 'react-native';


//tidak di pakai

export const CheckContainers = ({ navigation }) => {
  const [ location, setLocation ] = useState( {} );
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( false );

  useEffect(() => {
    (async () => {
        console.log( 'trigger get location' )
        try{
          console.log( 'triger terus ')
          setLoading( true );
          console.log( click );
          const { coords: { latitude, longitude } } = await CheckLocation({ os: Platform.OS });
          console.log( latitude )
          await setLocation({ latitude, longitude })
          if( latitude && longitude ) setLoading( false );
        }catch({ error }) { setError( error ) }
    })()
  }, [])


  return (
    <View style={{ flex: 1, backgroundColor: '#5b5656', alignItems: loading ? 'center' : '', justifyContent: loading ? 'center' : '' }}>
      {
        loading && !location
          ? <ActivityIndicator color={ 'red' }/>
          :
        location && location.longitude && location.latitude && !loading
              &&  
                <>
                  <MapCheck name={ navigation.state.params.name } location={ location } />
                  <View style={{ flex: 1, backgroundColor: 'white', width: '100%' }}>
                    <View style={{ height: 135, padding: 10, borderBottomColor: '#f1f1f6', borderBottomWidth: 1 }}>
                      <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', alignItems: 'center', padding: 20 }}>
                        <View style={{ width: '10%' }}>
                          <Text>Font</Text>
                        </View>
                        <View style={{ marginLeft: 20, justifyContent: 'space-between', height: 60, backgroundColor: 'red', width: '85%' }}>
                          <Text>Notes</Text>
                          <Text>Input</Text>
                        </View>
                      </View>
                      <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                        <Text>2</Text>
                      </View>
                    </View>
                    <Button style={{ marginLeft: 50 }} title='CLICK ME' onPress={() => setClick( false )} />
                  </View>
                </>
      }
    </View>
  )
}

