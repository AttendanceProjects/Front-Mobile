import React from 'react';
import { View, Button, AsyncStorage } from 'react-native';

export const Dash = ({ navigation }) => {

  const signout = async () => {
    await AsyncStorage.removeItem( 'access' )
    navigation.navigate( 'Signin' )
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title='Signout' onPress={ () => signout() }/>
    </View>
  )
}