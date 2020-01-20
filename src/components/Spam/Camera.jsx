import React from 'react';
import { Camera } from 'expo-camera';
import Font from 'react-native-vector-icons/FontAwesome5';
import * as FaceDetector from 'expo-face-detector';
import { View, TouchableOpacity } from 'react-native';

export const CameraComponent = ({ setCamera, takePicture, type }) => (
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
          <Font name={ 'camera' } size={ 50 } style={{ borderWidth: 1, borderRadius: 20, width: 100, textAlign: 'center', borderColor: 'green' }}/>
      </TouchableOpacity>
    </View>
  </Camera>
)