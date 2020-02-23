import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Image, Text, Platform, TouchableOpacity } from 'react-native';
import { getAccess, checkConnection } from '../../service';
import { Query } from '../../graph';
import { useLazyQuery } from '@apollo/react-hooks'
import Font from 'react-native-vector-icons/FontAwesome5';
import { ContainerStyle } from './ContainerStyle';

const {
  prepare_container,
  prepare_content,
  prepare_logo,
  prepare_text_loading,
  font_medium,
  font_small,
  prepare_button_try,
  prepare_welcome,
  prepare_powered,
  prepare_footer
} = ContainerStyle

export const PrepareApplication = ({ navigation: { navigate: push }}) => {
  const [ getUser, { data: user, loading } ] = useLazyQuery( Query.CHECK_SIGN_IN );
  const [ isOnline, setOnline ] = useState( false );
  const [ userState, setUser ] = useState( false );
  const [ error, setError ] = useState( false );
  const [ message, setMessage ] = useState( false );

  useEffect(() => {
    fetchUser()
  }, [ isOnline ])

  const fetchUser = async () => {
    const { network } = await checkConnection();
    setOnline( network );
    if( network ) {
      const { token, code } = await getAccess()
      if( code && token ) {
        try {
          await getUser({ variables: { code, token } })
        }catch({ graphQlErrors,  }) { setError( graphQlErrors[0].message ); setTimeout(() => setError( false ), 2000); }
      }else {
        setTimeout(() => push( 'Signin' ), 3000)
      }
    }else{
      setTimeout(() => push( 'Signin' ), 3000)
    }
    setError( false )
  }

  useEffect(() => {
    if( user !== undefined ) {
      if( user.checkSignin ){
        setUser( user.checkSignin );
        setMessage( 'Welcome ' );
        setTimeout(() => push( 'DashBoard', { user: user.checkSignin } ), 3000)
      }
    }
  }, [ user ])

  return (
    <View style={ prepare_container }>
      <View style={ prepare_content }>
        <Image source={ require('../../../assets/Original.png') } style={ prepare_logo } />
        { loading && !message && !error
            ? <>
                <ActivityIndicator size='small' color='black' />
                <Text style={ prepare_text_loading }>Preparing...</Text>
              </> : null }
        { error && !loading && !message
            ? <>
                <Text style={{ ...font_medium, color: 'red', fontWeight: 'normal' }}>{ error }</Text>
                <TouchableOpacity style={ prepare_button_try }>
                  <Text style={{ fontWeight: 'bold', color: 'white' }}>Try Again</Text>
                </TouchableOpacity>
              </> : null }
        { message && !error && !loading && user
            ? <Text style={ prepare_welcome }>{ message } { userState.username.toUpperCase() }</Text>
            : null }
        { !user && !message && !loading ? <Text style={ prepare_welcome }>Hello Welcome to Presence</Text> : null } 
      </View>
      <View style={ prepare_powered }>
        <View style={ prepare_footer }>
          <Font name='copy' size={ 15 } />
          <Text style={{ letterSpacing: 1, fontWeight: 'bold' }}>
            Powered
          </Text>
          <Text style={ font_small }>by</Text>
          <Text style={ font_medium }>DreamcaOfficial</Text>
        </View>
      </View>
    </View>
  )
}