import React from 'react'
import { TextInput } from 'react-native';

export const TextInputComponent = ({ value, setValue, text, sensitive, option }) => (
  <TextInput 
    secureTextEntry={ sensitive ? true : false }
    keyboardType='default'
    autoCapitalize='none'
    value={ value }
    onChangeText={ msg => setValue( msg )}
    placeholder={ text }
    placeholderTextColor={ 'white' }
    style={{ textAlign: 'center', marginBottom: 4, color: 'white', fontWeight: 'bold', letterSpacing: 2 }}
  />
)