import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export const TouchComponent = ({ press, h, w, text, color, textColor, bold, fromDash, type }) => (
  <TouchableOpacity
    onPress={() => {
      if( type === 'checkin' ) fromDash( 'Absent' );
      else if( type === 'checkout' ) fromDash( 'Checkout' );
      else press();
    }}
    style={{ height: h, width: w, justifyContent: 'center', alignItems: 'center', backgroundColor: color ? color : '#FFCC99', borderRadius: 20 }}
    >
    <Text style={{ color: textColor ? textColor : 'black', fontWeight: bold && bold }}>{ text }</Text>
  </TouchableOpacity>
)