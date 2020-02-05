import React from 'react';
import { Image, View } from 'react-native';
import { LoadingSimpleComponent } from '../../components'

export const ImageContainers = ({ navigation }) => {

  return (
    <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'center' }}>
      {
        navigation.state.params.url
          ? <Image source={{ uri: navigation.state.params.url }} style={{ width: '99%', height: 680 }} />
          : <LoadingSimpleComponent t={ 0 } r={ 0 } color={ blue } />
      }
    </View>
  )
}