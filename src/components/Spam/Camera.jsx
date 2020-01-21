import React from 'react';
import { Camera } from 'expo-camera';
import Font from 'react-native-vector-icons/FontAwesome5';
import * as FaceDetector from 'expo-face-detector';
import { View, TouchableOpacity, Text, Platform } from 'react-native';

export const CameraComponent = ({ setCamera, takePicture, type, channel }) => (
  <Camera
    style={{ flex: 1 }} 
    type={ type }
    faceDetectorSettings={{
      mode: FaceDetector.Constants.Mode.fast,
      detectLandmarks: FaceDetector.Constants.Landmarks.none,
      runClassifications: FaceDetector.Constants.Classifications.none,
      minDetectionInterval: 100,
      tracking: true,
    }}
    ref={ref => setCamera( ref )}
    >
    {
      channel
        && <TouchableOpacity style={{ position: 'absolute', top: Platform.OS === 'android' ? 40 : 30, left: 10, width: 50, height: 50 }} onPress={ () => channel.back() }><Font name={ 'backward' } size={ 30 }/></TouchableOpacity>
    }
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
        onPress={() => takePicture()}>
          <Font name={ 'camera' } size={ 50 } style={{ textAlign: 'center' }}/>
      </TouchableOpacity>
    </View>
  </Camera>
)