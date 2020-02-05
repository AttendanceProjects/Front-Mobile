import React from 'react'
import { TextInput } from 'react-native';

export const TextInputSensitiveComponent = ({ value, setValue, text, sensitive }) => (
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

export const TextInputNormalComponent = ({ value, text, setValue }) => (
  <TextInput
    keyboardType='default'
    autoCapitalize='none'
    value={ value }
    onChangeText={ msg => setValue( msg ) }
    placeholder={ text }
    placeholderTextColor={ 'white' }
    style={{ textAlign: 'center', marginBottom: 4, color: 'white', fontWeight: 'bold', letterSpacing: 2 }}
  />
)