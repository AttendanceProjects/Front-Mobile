import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Alert, TouchableHighlight, AsyncStorage } from 'react-native';
import { TouchComponent, LogoComponent, LoadingSimpleComponent, SimpleError, OfflieHeaderComponent, FormSigninComponent } from '../../components'
import { checkConnection } from '../../service'
import { Mutation } from '../../graph';
import { useMutation } from '@apollo/react-hooks'

export const Signin = ({ navigation }) => {
  const [ isOnline, setOnline ] = useState( false );
  const [ companyCode, setCompanyCode ] = useState( '' );
  const [ request, setRequest ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const [ watchPassword, setWatchPassword ] = useState( true );
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( false );
  const [ submitSignin ] = useMutation( Mutation.SIGN_IN );

  const toggleWatcher = () => { setWatchPassword( false ); setTimeout(() => setWatchPassword( true ),2000) }

  const showCompany = () => {
    Alert.alert('Company List', `
0001 - PT.Lim Digital Asia
    `)
  }

  useEffect(() => {
    (async () => { 
      const { network } = await checkConnection();
      setOnline( network );
    })()
  }, [])



  const signin = async () => {
    const { network } = await checkConnection();
    setOnline( network );
    setError( false )
    setLoading( true )
    if( network ) {
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

  const _onPageChange = _ => navigation.navigate( 'Forgot' );

  return (
    <>
      { !isOnline && <OfflieHeaderComponent /> }
      <View style={ styles.container }>
        <LogoComponent w={ 350 } h={ 350 } t={ Platform.OS === 'android' ? 120 : 80 }/>
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
          {/* <TouchableHighlight style={ styles.highlightForgot } onPress={() => _onPageChange()}>
            <Text style={ styles.textForgot }> Forgot Password ? </Text>
          </TouchableHighlight> */}
          <View style={ styles.btnBtm }>
            <TouchComponent
              h={ 30 }
              w={ '80%' }
              text='SIGN IN'
              spacing={ 2 }
              press={ signin }
              color={ '#5f85db' }
              bold={ true }
              textColor={ '#353941' }
              size={ Platform.OS === 'android' ? 15 : 20}
              />
          </View>
            { loading && <LoadingSimpleComponent color='blue' t={ 225 } /> }
            { error && <SimpleError text={ error } t={ 249 } co={ 'red' } size={ 15 }/> }
        </View>
          { !isOnline && <TouchComponent h={ 30 } w={ '80%' } text='Presence Offline' press={() => alert('comming soon')} />}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
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
