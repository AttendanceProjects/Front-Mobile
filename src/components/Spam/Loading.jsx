import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

export default ({ color, t, r, s, text }) => <ActivityIndicator color={ color } size={ s ? s : 'small' } style={{ position: 'absolute', top: t, right: r }}  />