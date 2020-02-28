import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ContainerStyle } from '../ContainerStyle';
import { Mutation } from '../../../graph';
import { getAccess } from '../../../service';
import { useMutation } from '@apollo/react-hooks';

const{
  signup_content,
  signup_main,
  signup_body,
  signup_input,
  signup_text_input,
  signup_touch_content,
  signup_touch_button,
  signup_text_button,
  signup_footer,
  signup_footer_button,
  signup_bold,
  signup_message
} = ContainerStyle;


export const CreateUserContainers = ({ navigation: { navigate: push }}) => {
  const [ payload, setPayload ] = useState({
    username: '',
    password: '',
    email: '',
    role: '',
    religion: '',
    phone: '',
    gender: ''
  })
  const [ success, setSuccess ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ submit, { loading } ] = useMutation( Mutation.SIGN_UP );

  const _onChangeGender = name => {
    setPayload({ ...payload, gender: name });
  }

  const _onClear = meth => setTimeout(() => meth( false ), 2000)

  const validateEmail = ( email ) => {
    var re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  const _onCreate = async _ => {
    if( !payload.religion || !payload.email || !payload.gender || !payload.phone || !payload.username || !payload.password || !payload.role ) {
      setMessage( 'All field is required!');
      _onClear( setMessage );
    }else if( payload.email && !validateEmail( payload.email ) ){
      setMessage( 'Invalid Email' );
      _onClear( setMessage );
    }else {
      try {
        const { code, token } = await getAccess();
        if( code, token ) {
          const { data } = await submit({ variables: { code, token, ...payload }})
          if( data ) {
            setSuccess( `successfully create new user with username ${ payload.username }` );
            setTimeout(() => {
              setSuccess( false );
              push("Profile")
            }, 5000);
          }
        }else {
          Alert.alert("Warning", "please signin again", [{text: 'yes', onPress: () => push('Signin')}])
        }
      }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); _onClear( setMEssage ) }
    }
  }

  return (
        <View style={ signup_content }>
          <View style={ signup_main }>
            <View style={ signup_body }>
              <Text style={ signup_bold }>Username: </Text>
            </View>
            <View style={ signup_input }>
              <TextInput onChangeText={msg => setPayload({ ...payload, username: msg })} style={ signup_text_input } placeholder='username' keyboardType='default' placeholderTextColor='black' autoCapitalize='none'/>
            </View>
          </View>
          <View style={ signup_main }>
            <View style={ signup_body }>
              <Text style={ signup_bold }>Email: </Text>
            </View>
            <View style={ signup_input }>
              <TextInput onChangeText={msg => setPayload({ ...payload, email: msg })} style={ signup_text_input } placeholder='username@example.com' keyboardType='default' placeholderTextColor='black' autoCapitalize='none'/>
            </View>
          </View>
          <View style={ signup_main }>
            <View style={ signup_body }>
              <Text style={ signup_bold }>Religion: </Text>
            </View>
            <View style={ signup_input }>
              <TextInput onChangeText={msg => setPayload({ ...payload, religion: msg })} style={ signup_text_input } placeholder='Religion' keyboardType='default' placeholderTextColor='black' autoCapitalize='none'/>
            </View>
          </View>
          <View style={ signup_main }>
            <View style={ signup_body }>
              <Text style={ signup_bold }>Password: </Text>
            </View>
            <View style={ signup_input }>
              <TextInput onChangeText={msg => setPayload({ ...payload, password: msg })} style={ signup_text_input } placeholder='password' secureTextEntry={ true } keyboardType='default' placeholderTextColor='black' autoCapitalize='none'/>
            </View>
          </View>
          <View style={ signup_main }>
            <View style={ signup_body }>
              <Text style={ signup_bold }>Role: </Text>
            </View>
            <View style={ signup_input }>
              <TextInput onChangeText={ msg => setPayload({ ...payload, role: msg })} style={ signup_text_input } placeholder='role' keyboardType='default' placeholderTextColor='black' autoCapitalize='none'/>
            </View>
          </View>
          <View style={ signup_main }>
            <View style={ signup_body }>
              <Text style={ signup_bold }>Phone: </Text>
            </View>
            <View style={ signup_input }>
              <TextInput onChangeText={ msg => setPayload({ ...payload, phone: msg })} style={ signup_text_input } placeholder='phone number' keyboardType='phone-pad' placeholderTextColor='black' autoCapitalize='none'/>
            </View>
          </View>
          <View style={ signup_main }>
            <View style={ signup_body }>
              <Text style={ signup_bold }>Gender: </Text>
            </View>
            <View style={ signup_touch_content }>
              <TouchableOpacity onPress={() => _onChangeGender( 'male' )} style={{ ...signup_touch_button, backgroundColor: payload.gender === 'male' ? '#beebe9' : '#fff', transform: payload.gender === 'male' ? [{ translateY: -10 }]: [] }}>
                <Text style={ signup_text_button }>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => _onChangeGender( 'female' )} style={{ ...signup_touch_button, backgroundColor: payload.gender === 'female' ? '#f688bb' : '#fff', marginLeft: 15, transform: payload.gender === 'female' ? [{ translateY: -10 }]: [] }}>
                <Text style={ signup_text_button }>Female</Text>
              </TouchableOpacity>
            </View>
          </View>
          { message || success
              ? <View style={ signup_message }>
                  <Text style={{ color: success ? 'green' : 'red' }}>{ message || success }</Text>
                </View>
              : null }
          { loading
              &&  <View style={ signup_message }>
                    <ActivityIndicator color='blue' />
                  </View>}
          <View style={ signup_footer }>
            <TouchableOpacity onPress={() => _onCreate()} style={{ ...signup_footer_button, backgroundColor: '#a0ffe6' }}>
              <Text style={ signup_text_button }>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => push('Profile')} style={{ ...signup_footer_button, backgroundColor: '#fd2eb3', marginLeft: 50 }}>
              <Text style={ signup_text_button }>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
  )
}