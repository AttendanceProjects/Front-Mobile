import React from 'react'
import { TextInput } from 'react-native';

export default ({ value, setValue, text, sensitive, option }) => (
  <TextInput 
    secureTextEntry={ sensitive ? true : false }
    keyboardType='default'
    autoCapitalize='none'
    value={ value }
    onChangeText={ msg => setValue( msg )}
    placeholder={ text }
    style={{ textAlign: 'center', marginBottom: 4 }}
  />
)