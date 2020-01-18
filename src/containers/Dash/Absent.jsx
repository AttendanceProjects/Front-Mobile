import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { ErrorComponent } from '../../components/Spam';
import * as FaceDetector from 'expo-face-detector';
import Font from 'react-native-vector-icons/FontAwesome5';

export const Absent = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type] = useState(Camera.Constants.Type.front);
  const [ message, setMessage ] = useState( false );
  const [ camera, setCamera ] = useState( '' );

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      if( status === 'granted' ) setHasPermission(status === 'granted');
      else {
        console.log('masuk else kondisi', status)
        setMessage( 'Please set allow your camera to access this application')
      }
    })();
  }, []);

  const takePicture = async () => {
    if( camera ) {
      const picture = await camera.takePictureAsync();
      if( picture ) navigation.navigate( 'Process', { data: picture } );
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
        !message
          ?
          <Camera
            style={{ flex: 1 }} 
            type={ type }
            // onFacesDetected={e => console.log(e)}
            faceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.fast,
              detectLandmarks: FaceDetector.Constants.Landmarks.none,
              runClassifications: FaceDetector.Constants.Classifications.none,
              minDetectionInterval: 100,
              tracking: true,
            }}
            ref={ ref => setCamera( ref ) }
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