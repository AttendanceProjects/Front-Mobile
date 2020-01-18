import React, { useState } from 'react';
import { HeaderComponent } from '../../components/Spam'
import { View, Button, AsyncStorage, Platform } from 'react-native';

export const Dash = ({ navigation }) => {

  const signout = async () => {
    await AsyncStorage.removeItem( 'access' )
    navigation.navigate( 'Signin' )
  }

  return (
    <>
      <HeaderComponent
        right={{ icon: 'sign-out-alt', size: 30, action: signout, top: Platform.OS === 'android' ? 5 : 0 }}
        mid={{ msg: 'Presence', ls: 2 }}
        left={{ icon: Platform.OS === 'android' ? 'list-ol' : 'sliders-h', top: Platform.OS === 'android' ? 10 : 1, action: navigation.openDrawer }} />
    </>
  )
}