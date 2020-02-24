import React from 'react';
import { View, Text } from 'react-native';
import Font from 'react-native-vector-icons/FontAwesome5';
import { ContainerStyle } from '../../containers/Dash/ContainerStyle';

const {
  prepare_powered,
  prepare_footer,
  font_small,
  font_medium
} = ContainerStyle

export const PoweredDreamCar = _ => (
  <View style={ prepare_powered }>
    <View style={ prepare_footer }>
      <Font name='copy' size={ 15 } />
      <Text style={{ letterSpacing: 1, fontWeight: 'bold' }}>
        Powered
      </Text>
      <Text style={ font_small }>by</Text>
      <Text style={ font_medium }>DreamcaOfficial</Text>
    </View>
  </View>
)