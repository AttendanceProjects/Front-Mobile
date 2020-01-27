import React from 'react';
import Font from 'react-native-vector-icons/FontAwesome5';

export const IconComponent = ({ name, w, h, t = 0, r = 0, press, color, l, size }) => (
  <Font
    name={ name }
    color={ color ? color : 'black' }
    size={ size && size }
    style={{ height: h, width: w, top: t && t, right: r && r, left: l && l, position: 'absolute', color: 'white' }}
    onPress={() => press ? press() : null }
    />
)