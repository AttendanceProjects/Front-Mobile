import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Image, View, Dimensions } from 'react-native';


export const MapCorrections = ({ start, end }) => (
  <View style={{ height: '100%', width: '80%', marginLeft: 20, alignItems: 'flex-end' }}>
      <MapView style={{ height: '100%', width: '90%' }}
        camera={{
          center: {
            // latitude: location ? location.latitude : -6.2607917,
            // longitude: location ? location.longitude : 106.7810557
            latitude: -6.157798, // company location
            longitude: 106.819318 //company location
          },
          pitch: 0,
          heading: 0,
          altitude: 10000,
          zoom: 14
        }}
      >
        { start && start.longitude && start.latitude
            ?
              <Marker
                coordinate={{
                  latitude: Number( start.latitude ),
                  longitude: Number( start.longitude )
                }}
                title={ 'Check In'}
                // onPress={() => navigation.navigate('Detail')}
                // onPress={() => setDestination({
                //   latitude: Number(start.latitude),
                //   longitude: Number(start.longitude)
                // })}
              >
                <Image 
                  source={ require('../../../assets/checkin.png') }
                  style={{ width: 15, height: 30 }}
                />
              </Marker> : null }
        { end && end.longitude && end.latitude
            ?
              <Marker
                coordinate={{
                  latitude: Number( end.latitude ),
                  longitude: Number( end.longitude )
                }}
                title={ 'Check Out' }
              >
                <Image 
                  source={ require('../../../assets/people.png') }
                  style={{ width: 15, height: 30 }}
                />
              </Marker> : null }
      </MapView>
    </View>
)

export const MapComponent = ({ param }) => {
  const [ start, setStart ] = useState( {} );
  const [ end, setEnd ] = useState( {} );

  useEffect(() => {
    const { start, end } = param;
    setStart( start );
    setEnd( end );
  }, [])

  return (
    <View style={styles.container}>
      <MapView style={styles.mapStyle}
        camera={{
          center: {
            // latitude: location ? location.latitude : -6.2607917,
            // longitude: location ? location.longitude : 106.7810557
            latitude: -6.157798, // company location
            longitude: 106.819318 //company location
          },
          pitch: 0,
          heading: 0,
          altitude: 10000,
          zoom: 14
        }}
      >
        { start && start.longitude && start.latitude
            ?
              <Marker
                coordinate={{
                  latitude: Number( start.latitude ),
                  longitude: Number( start.longitude )
                }}
                title={ 'Check In'}
                // onPress={() => navigation.navigate('Detail')}
                // onPress={() => setDestination({
                //   latitude: Number(start.latitude),
                //   longitude: Number(start.longitude)
                // })}
              >
                <Image 
                  source={ require('../../../assets/checkin.png') }
                  style={{ width: 15, height: 30 }}
                />
              </Marker> : null }
        { end && end.longitude && end.latitude
            ?
              <Marker
                coordinate={{
                  latitude: Number( end.latitude ),
                  longitude: Number( end.longitude )
                }}
                title={ 'Check Out' }
              >
                <Image 
                  source={ require('../../../assets/people.png') }
                  style={{ width: 15, height: 30 }}
                />
              </Marker> : null }
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: '100%',
    height: Platform.OS === 'android' ? 410 : 350,
    borderRadius: 20
  },
});
