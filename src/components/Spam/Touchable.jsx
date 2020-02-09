import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { getServerTime, getAccess } from '../../service';

export const TouchComponent = ({ press, h, w, text, color, textColor, bold, fromDash, type, id , size, spacing, issues, isuMessage, setMsg }) => {

  const _onActionPressed = _ => press();

  return (
    <TouchableOpacity
      onPress={() => _onActionPressed()}
      style={{ height: h, width: w, justifyContent: 'center', alignItems: 'center', backgroundColor: color ? color : '#FFCC99', borderRadius: 20 }}
      >
      <Text style={{ color: textColor ? textColor : 'black', fontWeight: bold && 'bold', fontSize: size && size, letterSpacing: spacing ? spacing : 0 }}>{ text }</Text>
    </TouchableOpacity>
  )
}