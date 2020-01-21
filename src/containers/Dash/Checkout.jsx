import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { CameraComponent, ErrorGlobal, LoadingComponent } from '../../components/Spam';
import { getAccess, uploadImage } from '../../service';
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


  const takePicture = async () => {
    if( camera ) {
      const { uri } = await camera.takePictureAsync();
      const { code, token } = await getAccess();
      if( uri ) {
        setLoading( true );
        setGif({ uri: 'https://media.giphy.com/media/xT9DPldJHzZKtOnEn6/giphy.gif', first: 'Please Wait...', second: 'Process Check Out' })
        const formData = new FormData();
        formData.append( 'image', { name: 'checkout.jpg', type: 'image/jpg', uri })
        const { success, error } = await uploadImage({ code, token, formData });
        if( success ) {
          try {
            const { data } = await checkout({ variables: { code, token, end_image: success }, refetchQueries: [ { query: Query.USER_ATT, variables: { code, token } } ] });
            setLoading( false );
            setMessage( false );
            setGif( {} );
            navigation.navigate( 'Result', { url: success, attendance: data.createAtt } )
          } catch({ graphQLErrors }) {
            setMessage( graphQLErrors[0].message );
            setTimeout(() => {
              navigation.navigate( 'Home' );
              setLoading( false );
              setMessage( false );
              setGif( {} );
            }, 10000)
          }
        } else if( error ){
          setGif({ uri: 'https://media.giphy.com/media/TqiwHbFBaZ4ti/giphy.gif', first: 'woops something error', second: 'Please try again in 5 Second' })
          setTimeout(() => {
            setLoading( false );
            setMessage( false );
            setGif( {} )
          }, 5000)
        }
      } else {
        setLoading( false );
        setGif({ uri: 'https://media.giphy.com/media/TqiwHbFBaZ4ti/giphy.gif', first: 'sorry cant take a picture', second: 'please try again' })
        setTimeout(() => {
          setGif( {} );
        }, 2000);
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
              <ErrorGlobal text={ message }/>
            </View>
          : loading
              ? <LoadingComponent gif={{ image: gif.uri, w: 250, h: 250 }}  text={{ first: gif.first, second: gif.second }} bg={ 'white' }/>
              : <CameraComponent setCamera={ setCamera } takePicture={ takePicture } type={ type } channel={{ name: 'eric sudhartio', back: navigation.goBack}}/>
      }
    </View>
  )
}