import React from 'react';
import { View, Text } from 'react-native';
import { HeaderComponent } from '../../components/Spam'

export const History = ({ navigation }) => {
  return (
    <>
      <HeaderComponent
        mid={{ msg: 'History', ls: 2, color: 'green' }}
        left={{ icon: Platform.OS === 'android' ? 'list-ol' : 'sliders-h', top: Platform.OS === 'android' ? 10 : 1, action: navigation.openDrawer }} 
        />
    </>
  )
}