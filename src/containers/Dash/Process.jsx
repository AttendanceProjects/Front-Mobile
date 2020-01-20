import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { LoadingComponent } from '../../components/Spam';

export const Process = ({ navigation }) => {

  useEffect(() => {
    if( !Constants.isDevice ) navigation.navigate( 'Result', { error: 'Cant Run in Simulator Device' } );
    else _getCurrentLocation();
  }, [])

  const _getCurrentLocation = async () => {
    let { status } = await Permissions.askAsync( Permissions.LOCATION );
    if( status !== 'granted' ) navigation.navigate( 'Result', { error: 'Please set allow your Location Device to next process' });
    else if( Platform.OS === 'android' && status === 'granted' ){
      const { coords } = await Location.getCurrentPositionAsync({});
      if( coords.accuracy > 15 ) navigation.navigate( 'Result', { coords } )
      else navigation.navigate( 'Result', { error: 'Sorry, We suspect your location because it is less accurate' })
    } else {
      const { coords } = await Location.getCurrentPositionAsync({});
      if( coords.accuracy > 55 ) navigation.navigate( 'Result', { coords } )
      else navigation.navigate( 'Result', { error: 'Sorry, We suspect your location because it is less accurate' })
    }
  }

  return (
    <>
      <LoadingComponent text={{ first: 'Processing...', second: 'Checking Location' }} />
    </>
  )
}


/*

calculate time

if( clock > 7 && time === 'AM' && clock < 10 && time === 'AM' ) {
  console.log( 'waktu absen datang' );
} else if( clock > 10 && clock < 5 && time === 'PM' ) {
  console.log( 'waktu kerja dianggap alfa' );
} else if( clock > 5 && time === 'PM' && clock < 7 && time === 'PM' ) {
  console.log( 'waktu absen pulang' );
} else console.log( 'diluar waktu kerja' );


*/