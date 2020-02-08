import React from 'react';
import Font from 'react-native-vector-icons/FontAwesome5';

export const IconComponent = ({ name, w, h, t = 0, r = 0, press }) => {

  const _onIconPress = _ => {
    if( press ) press();
  }

  return (
    <Font
      name={ name }
      color={ 'black' }
      size={ 15 }
      style={{ height: h, width: w, top: t && t, right: r && r, position: 'absolute', color: 'white' }}
      onPress={() => _onIconPress() }
      />
  )
}