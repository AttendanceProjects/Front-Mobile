import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Alert, TouchableHighlight, AsyncStorage } from 'react-native';
import { TouchComponent, LogoComponent, LoadingComponent, SimpleError, OfflieHeaderComponent } from '../../components/Spam'
import { FormSigninComponent } from '../../components/SigninComponent'
import { checkConnection, getAccess } from '../../service'
import { Mutation, Query } from '../../graph';
import { useMutation, useLazyQuery } from '@apollo/react-hooks'

export const Signin = ({ navigation }) => {
  const [ isOnline, setOnline ] = useState( true );
  const [ companyCode, setCompanyCode ] = useState( '' );
  const [ request, setRequest ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const [ watchPassword, setWatchPassword ] = useState( true );
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( false );
  const [ access, setAccess ] = useState( {} );
  const [ submitSignin ] = useMutation( Mutation.SIGN_IN );
  const [ getUser, { data: CheckUser } ] = useLazyQuery( Query.CHECK_SIGN_IN, { variables: { code: access.code, token: access.token } } );

  const toggleWatcher = () => { setWatchPassword( false ); setTimeout(() => setWatchPassword( true ),2000) }

  const showCompany = () => {
    Alert.alert('Company List', `
0001 - PT.Lim Digital Asia
    `)
  }
  
  const CheckSignin = async ( access ) => {
    setError( false )
    const parse = await access,
      { code, token } = await parse;
    await setAccess({ code, token })
    try {
      if( code && token ) {
        getUser()
      }
    } catch({ graphQLErrors }) { setError( graphQLErrors[0].message ); setTimeout(() => setError( false ), 2000) }
  }

  useEffect(() => {
    const getAccessApp = async () => { 
      await checkConnection({ save: setOnline })
      await getAccess()
    }
    if( getAccessApp() && isOnline ) {
      setError( false )
      try {
        CheckSignin( getAccess() )
      }catch({ graphQlErrors }) { setError( graphQlErrors[0].message ); setTimeout(() => setError( false ), 2000) }
    }
  }, [])


  const signin = async () => {
    await checkConnection({ save: setOnline })
    setError( false )
    setLoading( true )
    if( isOnline ) {
      if( request, password ) {
        try {
          const { data } = await submitSignin({ variables: { code: companyCode, request, password } });
          await AsyncStorage.setItem('access', JSON.stringify({ token: data.signin.token, code: companyCode }))
          navigation.navigate('DashBoard')
          setLoading( false )
        } catch ({ graphQLErrors }) {
          setError( graphQLErrors[0].message )
          setLoading( false )
          setTimeout(() => setError( false ), 2000)
        }
      } else {
        setError( 'cannot send empty value' )
        setLoading( false )
        setTimeout(() => setError( false ), 2000)
      }
    } else setLoading( false )
  }

  CheckUser 
    && CheckUser.checkSignin && navigation.navigate('DashBoard')

  return (
    <>
      { !isOnline && <OfflieHeaderComponent /> }
      <View style={ styles.container }>
        <LogoComponent w={ 250 } h={ 250 } t={ Platform.OS === 'android' ? 60 : 120 }/>
        <View style={ styles.outer }>
          <FormSigninComponent
            code={ companyCode }
            setCode={ setCompanyCode }
            req={ request }
            setReq={ setRequest }
            pass={ password }
            setPass={ setPassword }
            bindPass={ watchPassword }
            seeComp={ showCompany }
            toggleBind={ toggleWatcher }
            />
          <TouchableHighlight style={ styles.highlightForgot } onPress={() => navigation.navigate( 'Forgot' )}>
            <Text style={ styles.textForgot }> Forgot Password ? </Text>
          </TouchableHighlight>
          <View style={ styles.btnBtm }>
            <TouchComponent
              h={ 30 }
              w={ '80%' }
              text='Sign In'
              press={ () => signin() }
              />
          </View>
            { loading && <LoadingComponent color='blue' t={ 225 } /> }
            { error && <SimpleError text={ error } t={ 249 }/> }
        </View>
          { !isOnline && <TouchComponent h={ 30 } w={ '80%' } text='Presence Offline' />}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 250
  },
  textInput: {
    textAlign: 'center'
  },
  btnBtm: {
    top: 25,
    width: '70%',
    alignItems: 'center'
  },
  highlightForgot: {
    position: 'absolute',
    top: 169,
    right: 65,
  },
  textForgot: {
    fontSize: 11,
    color: 'blue'
  }
});
