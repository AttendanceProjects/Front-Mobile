import React from 'react';
import Font from 'react-native-vector-icons/FontAwesome5';

export default ({ name, w, h, t = 0, r = 0, press }) => (
  <Font
    name={ name }
    style={{ height: h, width: w, top: t, right: r, position: 'absolute' }}
    onPress={() => press() }
    />
)