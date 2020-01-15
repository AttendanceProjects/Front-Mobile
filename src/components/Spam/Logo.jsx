import React from 'react';
import { Image } from 'react-native';

export default ({ w, h, t, r }) => (
  <Image source={ require('../../../assets/Original.png' ) } style={{ width: w, height: h, top: t, right: r, position: 'absolute' }} />
)