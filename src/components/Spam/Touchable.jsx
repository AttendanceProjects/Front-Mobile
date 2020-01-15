import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default ({ press, h, w, text }) => (
  <TouchableOpacity
    onPress={ () => press() }
    style={{ height: h, width: w, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFCC99', borderRadius: 20 }}
    >
    <Text>{ text }</Text>
  </TouchableOpacity>
)