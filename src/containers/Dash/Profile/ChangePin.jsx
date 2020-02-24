import React, { useState } from 'react';
import { View, Text, Platform, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PoweredDreamCar } from '../../../components';
import { useMutation } from '@apollo/react-hooks';
import { getAccess } from '../../../service';
import { Mutation } from '../../../graph';
import { ContainerStyle } from '../ContainerStyle';

const {
  pin_content,
  pin_header_content,
  pin_large,
  pin_small,
  pin_body,
  pin_body_top,
  pin_loop_content,
  pin_text,
  pin_input,
  pin_button_content,
  pin_button_save,
  pin_button_text
} = ContainerStyle;

export const ChangePinContainers = ({ navigation: { navigate: push } }) => {
  const [ submit ] = useMutation( Mutation.CHANGE_PIN );
  const [ old, setOld ] = useState( '' );
  const [ newPin, setNew ] = useState( '' );
  const [ confirm, setConfirm ] = useState( '' );
  const [ success, setSuccess ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ loading, setLoading ] = useState( false );


  const _onChangeText = (msg, params) => {
    const num = Number( msg );
    if( params === 'old' && num <= 999999 ) setOld( msg );
    else if( params === 'new' && num <= 999999 ) setNew( msg );
    else if( params === 'confirm' && num <= 999999 ) setConfirm( msg );
  }

  const _onClear = meth => setTimeout(() => meth( false ), 2000)

  const _onSubmit = async _ => {
    if( newPin !== confirm ) setMessage( 'invalid new pin and confirm' );
    else if( Number( newPin ) < 100000 ) setMessage( 'min pin 100000' );
    else{
      setLoading( true );
      const new_pin = Number( newPin );
      const old_pin = Number( old );
      try{
        const { code, token } = await getAccess();
        const { data: { changePin } } = await submit({ variables: { code, token, old_pin, new_pin }});
        if( changePin ) {
          setSuccess( 'Pin success updated' );
          setLoading( false );
          setTimeout(() => {
            push( 'Profile' );
            setSuccess( false );
          }, 3000)
        }
      }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); setLoading( false ); _onClear( setMessage ); }
    }
  }

  return (
    <View style={ pin_content }>
      <View style={ pin_header_content }>
        <Text style={ pin_large }>Pin Security</Text>
        <Text style={ pin_small }>Don't tell anyone the secret</Text>
      </View>
      <View style={ pin_body }>
        <View style={ pin_body_top }>
          { ['old', 'new', 'confirm'].map((el, i) => (
              <View key={ i } style={{ ...pin_loop_content, marginTop: i !== 0 ? 10 : 0 }}>
                <Text style={ pin_text }>
                  { el === 'old' ? 'Input Old Pin' : el === 'new' ? 'Input New Pin' : 'Input Confirm Pin' }
                </Text>
                <TextInput value={ el === 'old' ? old : el === 'new' ? newPin : confirm } onChangeText={msg => _onChangeText(msg, el)} secureTextEntry={ true } keyboardType='number-pad' style={ pin_input } placeholderTextColor='white' placeholder='....' />
              </View>
          ))}
          <View style={ pin_button_content }>
            <View style={ pin_button_save }>
              <TouchableOpacity onPress={() => _onSubmit()} style={ pin_button_text }>
                <Text style={{ fontWeight: 'bold', color: 'black' }}>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={ pin_button_save }>
              <TouchableOpacity onPress={() => push('Profile')} style={{ ...pin_button_text, backgroundColor: '#81f5ff' }}>
                <Text style={{ fontWeight: 'bold', color: 'black' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width: '100%', alignItems: 'center', paddingTop: 20 }}>
            { message && !loading
                ? <Text style={{ color: 'red', fontSize: Platform.OS === 'android' ? 12 : 16 }}>{ message }</Text>
                : loading && !message
                    ? <ActivityIndicator size="small" color='black' />
                    : success && !message && !loading 
                        ? <Text style={{ color: 'green', fontSize: Platform.OS === 'android' ? 12 : 16 }}>{ success }</Text>
                        : null }
          </View>
        </View>
        <PoweredDreamCar />
      </View>
    </View>
  )
}