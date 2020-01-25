import React, { useState, useEffect } from 'react';
import { Text, View, Platform } from 'react-native';
import { ErrorGlobal, LoadingComponent, CameraComponent } from '../../components/Spam';
import { Camera } from 'expo-camera';
import { takeAPicture, _checkLocation } from '../../helpers';
import { getAccess, uploadImage } from '../../service';
import { Mutation, Query } from '../../graph';
import { useMutation } from '@apollo/react-hooks';

export const Absent = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type] = useState(Camera.Constants.Type.front);
  const [ message, setMessage ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ gif, setGif ] = useState( {} );
  const [ camera, setCamera ] = useState( '' );

  const [ attendance ] = useMutation( Mutation.CREATE_ATT );
  const [ location ] = useMutation( Mutation.UPDATE_LOCATION );
  const [ failed ] = useMutation( Mutation.FAIL_PROCESS );


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      if( status === 'granted' ) setHasPermission(status === 'granted');
      else if( status !== 'granted' && !loading ) setMessage( 'Please set allow your camera to access this application');
    })();
  }, []);

  const takePicture = async () => {
    const { code, token } = await getAccess()
    let id
    if( camera ) {
      try {
        const { message, id } = await takeAPicture({ access: { code, token }, upload: uploadImage, camera, loading: setLoading, message: setMessage, action: { mutation: attendance }, gifLoad: setGif, type: { msg: 'checkin' } });
        if( message ) {
          setGif({ uri: 'https://media.giphy.com/media/WiIuC6fAOoXD2/giphy.gif', first: 'Please Wait...', second: "Checking Location..." })
          await _checkLocation({ nav: navigation.navigate, id, osPlatform: Platform.OS, action: { upFailed: failed, updateLocation: location, query: Query.USER_ATT, daily: Query.GET_DAILY_USER,  history: Query.GET_HISTORY }, type: 'checkin', notif: { gif: setGif, msg: setMessage }, access: { code, token } })
        }
      } catch(err) {
        setMessage( err );
        await failed({ code, token, id })
        setTimeout(() => {
          navigation.navigate( 'Home' );
          setLoading( false );
        }, 6000)
      }
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
              <ErrorGlobal text={ message } type={ 'checkin' }/>
            </View>
          : loading
              ? <LoadingComponent gif={{ image: gif.uri, w: 250, h: 250 }}  text={{ first: gif.first, second: gif.second }} bg={ 'black' }/>
              : <CameraComponent setCamera={ setCamera } takePicture={ takePicture } type={ type }/>
      }
    </View>
  );
}