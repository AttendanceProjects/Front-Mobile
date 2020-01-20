import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { ErrorComponent, LoadingComponent } from '../../components/Spam';
import * as FaceDetector from 'expo-face-detector';
import Font from 'react-native-vector-icons/FontAwesome5';
import { getAccess, uploadImage } from '../../service';
import { Mutation } from '../../graph';
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
    setLoading( true );
    setGif({ uri: 'https://media.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif', first: 'Please Wait...', second: 'We process your data' })
    if( this.camera ) {
      console.log( this.camera, '---' );
      const picture = await this.camera.takePictureAsync({quality: 0.5, base64: true, forceUpOrientation: true, fixOrientation: true });
      console.log( picture );
      const access = await getAccess();
      const { token, code } = access;
      console.log( code, token, 'get access' );
      if( picture ) {
        const formData = new FormData();
        await formData.append( 'image', { name: 'selfie.jpg', type: 'image/jpg', uri: picture.uri });
        console.log( 'form data', formData );
        const { success, error } = await uploadImage({ code, token, formData })
        console.log( success && success , 'if success' )
        if( success ) {
          try {
            const data = await attendance({ code, token, start_image: success });
            console.log( data );
            setLoading( false );
            setGif( {} );
            navigation.navigate( 'Result', { url: success } )
          } catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ) }
        } else if( error ) {
          setGif({ uri: 'https://media.giphy.com/media/TqiwHbFBaZ4ti/giphy.gif', first: 'woops something error', second: 'Please try again' })
        }
      } else {
        setLoading( false );
        setGif({ uri: 'https://media.giphy.com/media/TqiwHbFBaZ4ti/giphy.gif', first: 'sorry cant take a picture', second: 'please try again' })
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
      { loading && <LoadingComponent gif={{ uri: 'https://gph.is/2uMgL9D' }}/> }
      {
        !message 
          ?
          !loading
           ?
          <Camera
            style={{ flex: 1 }} 
            type={ type }
            // onFacesDetected={e => console.log(e)}
            // faceDetectorSettings={{
            //   mode: FaceDetector.Constants.Mode.fast,
            //   detectLandmarks: FaceDetector.Constants.Landmarks.none,
            //   runClassifications: FaceDetector.Constants.Classifications.none,
            //   minDetectionInterval: 100,
            //   tracking: true,
            // }}
            ref={res => { 
              // setTimeout(() => {
                this.camera = res
              // }, 2000);
            } }
            >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginBottom: 6,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  takePicture()
                }}>
                  <Font name={ 'camera' } size={ 50 } style={{ borderWidth: 1, borderRadius: 20, width: 100, textAlign: 'center', borderColor: 'green' }}/>
              </TouchableOpacity>
            </View>
          </Camera>
          : <LoadingComponent gif={{ image: gif.uri, w: 250, h: 250 }}  text={{ first: gif.first, second: gif.second }} bg={ '#18151A' }/>
          :
          <View style={{ flex: 1 }}>
            <ErrorComponent.ErrorGlobal text={ message }/>
          </View>
      }
    </View>
  );
}

/*

Object {
  "faces": Array [
    Object {
      "bounds": Object {
        "origin": Object {
          "x": -86.0952380952381,
          "y": 274.1388888888889,
        },
        "size": Object {
          "height": 492.56746031746036,
          "width": 276.57142857142856,
        },
      },
      "faceID": -1,
      "rollAngle": 359.3886431455612,
      "yawAngle": 333.8866672515869,
    },
  ],
  "target": 285,
  "type": "face",
}

*/