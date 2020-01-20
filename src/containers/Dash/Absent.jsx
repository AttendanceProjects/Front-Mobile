import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { ErrorGlobal, LoadingComponent, CameraComponent } from '../../components/Spam';
import { Camera } from 'expo-camera';
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


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      if( status === 'granted' ) setHasPermission(status === 'granted');
      else if( status !== 'granted' && !loading ) setMessage( 'Please set allow your camera to access this application');
    })();
  }, []);

  const takePicture = async () => {
    if( camera ) {
      const { uri } = await camera.takePictureAsync()
      const { code, token } = await getAccess();
      if( uri ) {
        setLoading( true );
        setGif({ uri: 'https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif', first: 'Please Wait...', second: 'We process your data' })
        const formData = new FormData();
        await formData.append( 'image', { name: 'selfie.jpg', type: 'image/jpg', uri });
        const { success, error } = await uploadImage({ code, token, formData })
        if( success ) {
          try {
            const { data } = await attendance({ variables: { code, token, start_image: success }, refetchQueries: [ { query: Query.USER_ATT, variables: { code, token } } ] });
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
        } else if( error ) {
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
              ? <LoadingComponent gif={{ image: gif.uri, w: 250, h: 250 }}  text={{ first: gif.first, second: gif.second }} bg={ '#18151A' }/>
              : <CameraComponent setCamera={ setCamera } takePicture={ takePicture } type={ type }/>
      }
    </View>
  );
}