import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Image, StyleSheet } from 'react-native';

export const MapCheck = ({ name, location }) => (
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
      altitude: 1000,
      zoom: 1
    }}
  >
    <Marker
      coordinate={{
        latitude: Number( location.latitude ),
        longitude: Number( location.longitude )
      }}
      title={ 'What\'s up' }
    >
      {
        name === 'checkin'
          ?
          <Image 
            source={ require('../../../assets/checkin.png') }
            style={{ width: 15, height: 30 }}
          />
          :
          <Image 
            source={ require('../../../assets/people.png') }
            style={{ width: 15, height: 30 }}
          />
      }
    </Marker>
  </MapView>
)

const styles = StyleSheet.create({
  mapStyle: {
    width: '100%',
    height: Platform.OS === 'android' ? 360 : 300,
  },
});
