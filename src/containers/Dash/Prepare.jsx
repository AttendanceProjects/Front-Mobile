import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Image, Text, Platform, TouchableOpacity } from 'react-native';
import { getAccess } from '../../service'
import { Query } from '../../graph';
import { useLazyQuery } from '@apollo/react-hooks'
import Font from 'react-native-vector-icons/FontAwesome5';

export const PrepareApplication = ({ navigation }) => {
  const [ getUser, { data: user } ] = useLazyQuery( Query.CHECK_SIGN_IN );
  const [ isOnline, setOnline ] = useState( false );
  const [ error, setError ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ loading, setLoading ] = useState( false );

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => { 
    setLoading( true );
    const { token, code } = await getAccess()
    setError( false )
    try {
      await getUser({ variables: { code, token } })
      setMessage( 'Welcome ')
      setLoading( false );
    }catch({ graphQlErrors }) { setError( graphQlErrors[0].message ); setTimeout(() => setError( false ), 2000); setLoading( false ) }
  }

  useEffect(() => {
    if( user && user.checkSignin ) {
      setTimeout(() => navigation.navigate( 'DashBoard' ), 2000)
    }else {
      setLoading( false );
      setTimeout(() => navigation.navigate( 'Signin' ), 2000)
    }
  }, [ user ])
  console.log( user )

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ height: '70%', justifyContent: 'flex-end' }}>
        <Image source={ require('../../../assets/Original.png') } style={{ height: 200, width: 200 }} />
        { loading && !message && !error
            ? <>
                <ActivityIndicator size='small' color='black' />
                <Text style={{ marginTop: 10, fontWeight: "bold", letterSpacing: 2 }}>Preparing...</Text>
              </> : null }
        { error && !loading && !message
            ? <>
                <Text style={{ fontSize: Platform.OS === 'android' ? 13 : 16, color: 'red' }}>{ error }</Text>
                <TouchableOpacity style={{ height: 30, marginTop: 10, borderRadius: 10, shadowOpacity: 0.6, shadowRadius: 2, backgroundColor: '#C1C1C1', width: 100, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: 'white' }}>Try Again</Text>
                </TouchableOpacity>
              </> : null }
        { message && !error && !loading && user && user.checkSignin
            ? <Text style={{ fontSize: Platform.OS === 'android' ? 13 : 16, color: 'green' }}>{ message } { user.checkSignin.username }</Text>
            : null }
        { !user ? <Text style={{ fontSize: Platform.OS === 'android' ? 13 : 16, color: 'green' }}>Hello Welcome to Presence</Text> : null } 
      </View>
      <View style={{ height: '30%', justifyContent: 'flex-end' }}>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Font name='copy' size={ 15 } />
          <Text style={{ letterSpacing: 1, fontWeight: 'bold' }}>
            Powered
          </Text>
          <Text style={{ fontSize: 10, color: 'grey' }}>by</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>DreamcaOfficial</Text>
        </View>
      </View>
    </View>
  )
}