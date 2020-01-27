import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export const DetailContainers = ({ navigation }) => {

  useEffect(() => {
    console.log( navigation.state.params );
  }, [])
 
  return (
    <View>
      <Text>Detail Containers</Text>
    </View>
  )
}