import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Image, Text, Platform, TouchableOpacity } from 'react-native';
import { getAccess } from '../../service'
import { Query } from '../../graph';
import { useLazyQuery } from '@apollo/react-hooks'
import Font from 'react-native-vector-icons/FontAwesome5';

export const PrepareApplication = ({ navigation: { navigate: push }}) => {
  const [ getUser, { data: user } ] = useLazyQuery( Query.CHECK_SIGN_IN );
  const [ isOnline, setOnline ] = useState( false );
  const [ userState, setUser ] = useState( false );
  const [ error, setError ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ loading, setLoading ] = useState( false );

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => { 
    setLoading( true );
    const { token, code } = await getAccess()
    console.log( token, code, 'get access' );
    if( code && token ) {
      console.log( 'masuk ada token dan code' )
      try {
        await getUser({ variables: { code, token } })
      }catch({ graphQlErrors,  }) { setError( graphQlErrors[0].message ); setTimeout(() => setError( false ), 2000); setLoading( false ) }
    }else {
      setLoading( false );
      setTimeout(() => push( 'Signin' ), 3000)
    }
    setError( false )
  }

  useEffect(() => {
    if( user !== undefined ) {
      if( user.checkSignin ){
        setUser( user.checkSignin );
        setLoading( false );
        setMessage( 'Welcome ' );
        setTimeout(() => push( 'DashBoard', { user: user.checkSignin } ), 3000)
      }
    }
  }, [ user ])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ height: '60%', justifyContent: 'flex-end' }}>
        <Image source={ require('../../../assets/Original.png') } style={{ height: 200, width: 200 }} />
        { loading && !message && !error
            ? <>
                <ActivityIndicator size='small' color='black' />
                <Text style={{ marginTop: 10, textAlign: 'center', fontWeight: "bold", letterSpacing: 2 }}>Preparing...</Text>
              </> : null }
        { error && !loading && !message
            ? <>
                <Text style={{ fontSize: Platform.OS === 'android' ? 13 : 16, color: 'red' }}>{ error }</Text>
                <TouchableOpacity style={{ height: 30, marginTop: 10, borderRadius: 10, shadowOpacity: 0.6, shadowRadius: 2, backgroundColor: '#C1C1C1', width: 100, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: 'white' }}>Try Again</Text>
                </TouchableOpacity>
              </> : null }
        { message && !error && !loading && user
            ? <Text style={{ fontSize: Platform.OS === 'android' ? 14 : 17, fontWeight: 'bold', color: 'green', textAlign: 'center' }}>{ message } { userState.username.toUpperCase() }</Text>
            : null }
        { !user && !message && !loading ? <Text style={{ fontSize: Platform.OS === 'android' ? 14 : 17, fontWeight: 'bold', color: 'green', textAlign: 'center' }}>Hello Welcome to Presence</Text> : null } 
      </View>
      <View style={{ height: '40%', justifyContent: 'flex-end' }}>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Font name='copy' size={ 15 } />
          <Text style={{ letterSpacing: 1, fontWeight: 'bold' }}>
            Powered
          </Text>
          <Text style={{ fontSize: 10, color: 'grey', textAlign: 'justify' }}>by</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>DreamcaOfficial</Text>
        </View>
      </View>
    </View>
  )
}