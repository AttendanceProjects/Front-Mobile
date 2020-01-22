import React, { useState, useEffect } from 'react';
import { Text, View, Platform } from 'react-native';
import { ErrorGlobal, LoadingComponent, CameraComponent } from '../../components/Spam';
import { Camera } from 'expo-camera';
import { _getCurrentLocation, takeAPicture } from '../../helpers';
import { getAccess, uploadImage } from '../../service';
import { Mutation, Query } from '../../graph';
import { useMutation } from '@apollo/react-hooks';

export const Absent = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type] = useState(Camera.Constants.Type.front);
  const [ message, setMessage ] = useState( false );
  const [ typeMessage, setType ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ gif, setGif ] = useState( {} );
  const [ camera, setCamera ] = useState( '' );

  const [ attendance ] = useMutation( Mutation.CREATE_ATT );
  const [ location ] = useMutation( Mutation.UPDATE_LOCATION );


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      if( status === 'granted' ) setHasPermission(status === 'granted');
      else if( status !== 'granted' && !loading ) setMessage( 'Please set allow your camera to access this application');

      if( !Constants.isDevice ) navigation.navigate( 'Result', { error: 'Cant Run in Simulator Device' } );
    })();
  }, []);




  const takePicture = async () => {
    if( camera ) {
      try {
        const { message, id } = await takeAPicture({ access: getAccess, upload: uploadImage, camera, loading: setLoading, message: setMessage, action: { mutation: attendance }, gifLoad: setGif, type: { msg: 'checkin' } });
        console.log( 'success dari take picture ke database', message, id );
        if( message ) {
          setType( 'checkin' );
          setMessage( 'Checking Location...' );
          await _checkLocation( id )
        }
        // console.log( message, data );
      } catch(err) {
        setMessage( err );
        setTimeout(() => {
          navigation.navigate( 'Home' );
          setLoading( false );
        }, 5000)
      }
    }
  }

  const _checkLocation = async ( dataId ) => {
    try {
      const { coords } = await _getCurrentLocation({ os: Platform.OS });
      const { code, token } = await getAccess();
      console.log( 'dapat coordinat', coords )
      if( coords ) {
        const { longitude, latitude, accuracy } = coords,
          type = 'checkin';
        let os;
        if( Platform.OS === 'android' ) os = 'android';
        else os = 'IOS';
        if( longitude && latitude && accuracy && type && os ) {
          const { data } = await location({ variables: { code, token, os, type, latitude, accuracy: String(accuracy), longitude, id: dataId }, refetchQueries: [ {query: Query.USER_ATT, variables: { code, token }} ] })
          console.log( data, 'success' );
          if( data ) {
          } else setMessage( 'Something Error please try again')
        }else console.log( 'masuk else' );
      }
    }catch(err){
      setGif( {} )
      setMessage( err.error )
    }
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {
        message 
          ? 
            <View style={{ flex: 1 }}>
              <ErrorGlobal text={ message } type={ typeMessage }/>
            </View>
          : loading
              ? <LoadingComponent gif={{ image: gif.uri, w: 250, h: 250 }}  text={{ first: gif.first, second: gif.second }} bg={ 'white' }/>
              : <CameraComponent setCamera={ setCamera } takePicture={ takePicture } type={ type }/>
      }
    </View>
  );
}