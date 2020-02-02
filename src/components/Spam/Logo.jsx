import React from 'react';
import { Image } from 'react-native';

export const LogoComponent = ({ w, h, t, r, uri }) => (
  <Image source={ require(`../../../assets/whiteOnBlack.png` ) } style={{ width: w, height: h, top: t, right: r, position: 'absolute' }} />
)