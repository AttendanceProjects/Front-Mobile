import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Alert, TouchableHighlight, AsyncStorage } from 'react-native';
import { TouchComponent, LogoComponent, LoadingComponent } from '../../components/Spam'
import { FormSigninComponent } from '../../components/SigninComponent'
import { Mutation, Query } from '../../graph';
import { useMutation, useLazyQuery } from '@apollo/react-hooks'

export const Signin = ({ navigation }) => {
  const [ companyCode, setCompanyCode ] = useState( '' );
  const [ request, setRequest ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const [ watchPassword, setWatchPassword ] = useState( true );
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( false );
  // const [ access, setAccess ] = useState( {} );
  const [ submitSignin ] = useMutation( Mutation.SIGN_IN );
  // const [ getUser, { data: CheckUser } ] = useLazyQuery( Query.CHECK_SIGN_IN, { variables: { code: access.code, token: access.token } } );

  const toggleWatcher = () => { setWatchPassword( false ); setTimeout(() => setWatchPassword( true ),2000) }

  const showCompany = () => {
    Alert.alert('Company List', `
0001 - PT.Lim Digital Asia
    `)
  }
  
  // const CheckSignin = async ( access ) => {
  //   const parse = await access,
  //     { code, token } = await parse;
  //   await setAccess({ code, token })
  //   try {
  //     if( code && token ) {
  //       getUser()
  //     }
  //   } catch(err) { console.log(err.graphQLErrors[0].message) }
  // }
  // useEffect(() => {
  //   const getAccess = async () => { return ( JSON.parse( await AsyncStorage.getItem('access')) ) }
  //   if( getAccess() ) {
  //     try {
  //       CheckSignin( getAccess() )
  //     }catch(err) { console.log(err) }
  //   }
  // }, [])

  const signin = async () => {
    setLoading( true )
    setError( false )
    console.log( code, request, password, 'trigger signin' );
    if( request, password ) {
      try {
        const { data } = await submitSignin({ variables: { code: companyCode, request, password } });
        console.log('dapat data', data)
        await AsyncStorage.setItem('access', JSON.stringify({ token: data.signin.token, code: companyCode }))
        navigation.navigate('DashBoard')
        setLoading( false )
      } catch (err) {
        console.log('-----------', err);
        console.log( err.graphQLErrors[0].message )
        setError( err.graphQLErrors[0].message )
        setLoading( false )
      }
    } else {
      setError( 'cannot send empty value' )
      setLoading( false )
    }
  }

  // CheckUser 
  //   && CheckUser.checkSignin && navigation.navigate('DashBoard')

  return (
    <>
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
            { error && <Text style={{ top: 249, position: 'absolute' }}>{ error }</Text> }
        </View>
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
