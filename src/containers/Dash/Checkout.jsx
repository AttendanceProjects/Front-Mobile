import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { CameraComponent, ErrorGlobal, LoadingComponent } from '../../components/Spam';
import { getAccess, uploadImage, takeAPicture } from '../../service';
import { Mutation, Query } from '../../graph';
import { useMutation } from '@apollo/react-hooks';

export const CheckOutComponent = ({ navigation }) => {
  const [ hasPermission, setHasPermission ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ camera, setCamera ] = useState( false );
  const [ gif, setGif ] = useState( {} );
  const [ type ] = useState(Camera.Constants.Type.front);
  const [ checkout ] = useMutation( Mutation.CHECK_OUT_ATT );


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      if( status === 'granted' ) setHasPermission(status === 'granted');
      else if( status !== 'granted' && !loading ) setMessage( 'Please set allow your camera to access this application');
    })();
  }, []);


  const takePicture = async (id) => {
    if( camera ) {
      try {
        const { message, data } = await takeAPicture({ access: getAccess, upload: uploadImage, camera, loading: setLoading, message: setMessage, action: { mutation: checkout }, gifLoad: setGif, type: { msg: 'checkout', id } });
        console.log( message, data );
      } catch(err) {
        setMessage( err );
        setLoading( false );
      }
    }
  }


  if (hasPermission === null) {
    return <View />
  }
  if (hasPermission === false) {
    return <ErrorGlobal text={ 'Please Allow your Camera' } type={ 'nocamera' } />
  }


  return (
    <View style={{ flex: 1 }}>
      {
        message 
          ? 
            <View style={{ flex: 1 }}>
              <ErrorGlobal text={ message }/>
            </View>
          : loading
              ? <LoadingComponent gif={{ image: gif.uri, w: 250, h: 250 }}  text={{ first: gif.first, second: gif.second }} bg={ 'white' }/>
              : <CameraComponent setCamera={ setCamera } takePicture={ takePicture } type={ type } channel={{ name: 'eric sudhartio', back: navigation.goBack}}/>
      }
    </View>
  )
}