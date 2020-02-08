import React, { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { CameraComponent, ErrorCheckInOutComponent, ErrorCameraComponent, LoadingCheckInOutComponent, SuccessCheckInOutComponent } from '../../components';
import { getAccess, uploadImage } from '../../service';
import { takeAPicture, _checkLocation } from '../../helpers';
import { Mutation, Query } from '../../graph';
import { useMutation } from '@apollo/react-hooks';

export const CheckOutComponent = ({ navigation }) => {
  const [ hasPermission, setHasPermission ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ success, setSuccess ] = useState( false );
  const [ camera, setCamera ] = useState( false );
  const [ gif, setGif ] = useState( {} );
  const [ type ] = useState(Camera.Constants.Type.front);

  const [ checkout ] = useMutation( Mutation.CHECK_OUT_ATT );
  const [ checkoutLocation ] = useMutation( Mutation.UPDATE_LOCATION );
  const [ failed ] = useMutation( Mutation.FAIL_PROCESS );

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      if( status === 'granted' ) setHasPermission(status === 'granted');
      else if( status !== 'granted' && !loading ) setMessage( 'Please set allow your camera to access this application');
    })();
  }, []);


  const takePicture = async () => {
    const { code, token } = await getAccess();
    const { id: attId, issues } = navigation.state.params;
    if( camera ) {
      try {
        const { message } = await takeAPicture({ access: { code, token }, upload: uploadImage, camera, loading: setLoading, message: setMessage, action: { mutation: checkout }, gifLoad: setGif, type: { msg: 'checkout', id: attId, query: Query.USER_ATT, daily: Query.GET_DAILY_USER } });
        if( message ) {
          setGif({ uri: 'https://media.giphy.com/media/VseXvvxwowwCc/giphy.gif', first: 'Please Wait...', second: "Checking Location..." })
          await _checkLocation({ nav: navigation.navigate, id: attId, osPlatform: Platform.OS, action: { upFailed: failed, updateLocation: checkoutLocation, query: Query.USER_ATT, daily: Query.GET_DAILY_USER,  history: Query.GET_HISTORY }, type: 'checkout', notif: { gif: setGif, msg: setSuccess }, access: { code, token }, reason: issues })
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
    return <View />
  }
  if (hasPermission === false) {
    return <ErrorCameraComponent text={ 'Please Allow your Camera' } type={ 'nocamera' } />
  }


  return (
    <View style={{ flex: 1 }}>
      {
        message 
          ? 
            <View style={{ flex: 1 }}>
              <ErrorCheckInOutComponent text={ message }/>
            </View>
          : !message && success
            ? <View style={{ flex: 1 }}>
                <SuccessCheckInOutComponent text={ 'checkout' } />
              </View>
          : loading
              ? <LoadingCheckInOutComponent gif={{ image: gif.uri, w: 250, h: 250 }}  text={{ first: gif.first, second: gif.second }} bg={ 'black' }/>
              : <CameraComponent setCamera={ setCamera } takePicture={ takePicture } type={ type } />
      }
    </View>
  )
}