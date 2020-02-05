import React, { useState } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { LogoComponent, TextInputNormalComponent, TextInputSensitiveComponent, TouchComponent, IconComponent, LoadingSimpleComponent, SimpleError } from '../../components/Spam';
import { Mutation } from '../../graph';
import { useMutation } from '@apollo/react-hooks';

export const Forgot = ({ navigation }) => {
  const [ code, setCode ] = useState( '' );
  const [ email, setEmail ] = useState( '' );
  const [ secretCode, setSecretCode ] = useState( '' );
  const [ newPass, setNewPass ] = useState( '' );
  const [ bindSecret, setBindSecret ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ sendCode ] = useMutation( Mutation.FORGOT );
  const [ confrimCode ] = useMutation( Mutation.CONFIRM );

  const sendCodeTrigger = async () => {
    setLoading( true );
    setMessage( false );
    if( validateEmail( email ) ) {
      try {
          const { data }  = await sendCode({ variables: { code, email } });
          setMessage( data.forgot.msg );
          setBindSecret( true );
          setLoading( false );
          setTimeout(() => setMessage( false ), 2000)
      } catch({ graphQLErrors }) { 
        if( graphQLErrors[0].message === 'Internal Server Error' ) {
          setMessage( `Something Error,
please contact us dcar.developer@gmail.com`)
        } else {
          setMessage( graphQLErrors[0].message ); 
          setTimeout(() => setMessage( false ), 2000)
        }
        setLoading( false );
      }
    } else {
      setLoading( false );
      setMessage( 'Invalid Email Format' );
      setTimeout(() => setMessage( false ), 2000)
    }
  }

  const validateEmail = ( testing ) => {
    let er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return er.test( testing )
  }

  const watchCompany = () => {
    Alert.alert('Company List', `
0001 - PT.Lim Digital Asia
    `)
  }

  const changePassword = async () => {
    setLoading( true );
    try {
      await confrimCode({ variables: { code, newPass, secretCode } })
      setLoading( false );
      setMessage( 'Password successfully change');
      setTimeout(() => setMessage( false ), 2000);
      navigation.navigate( 'Signin' );
    } catch({ graphQLErrors }) {
      setLoading( false );
      setMessage( graphQLErrors[0].message );
      setTimeout(() => setMessage( false ), 2000)
    }
  }

  return (
    <View style={ styles.container }>
      <LogoComponent
        w={ 350 }
        h={ 350 }
        t={ Platform.OS === 'android' ? -10 : 10 }
        />
        <View style={ styles.bodyContainer }>
          <View style={ styles.emailText }>
            <TextInputNormalComponent
              text='Input Company Code'
              value={ code }
              setValue={ setCode }
              />
            <IconComponent name='searchengin' h={ 50 } w={ 50 } r={ -30 } t={ Platform.OS === 'android' ? 8 : 0 } press={ watchCompany }/>
          </View>
          <View style={ styles.emailText }>
            <TextInputNormalComponent
              text='Input Registered Email'
              value={ email }
              setValue={ setEmail }
              />
          </View>
          {
            bindSecret
              &&
              <>
                <View style={ styles.emailText }>
                  <TextInputNormalComponent
                    text='Secret Code'
                    value={ secretCode }
                    setValue={ setSecretCode }
                    />
                </View>
                <View style={ styles.emailText }>
                  <TextInputSensitiveComponent
                    text='New Password'
                    value={ newPass }
                    setValue={ setNewPass }
                    sensitive={ true }
                    />
                </View>
              </>
          }
          <TouchComponent
            text={ bindSecret ? 'Change Password' : 'Send Code'}
            w={ '65%' }
            h={ Platform.OS === 'android' ? 35 : 30 }
            press={ bindSecret ? changePassword : sendCodeTrigger }
            color={ '#5f85db' }
            size={ Platform.OS === 'android' ? 15 : 20 }
            bold={ true }
            spacing={ 2 }
            />
            { loading ? Platform.OS === 'android'
                    ? <LoadingSimpleComponent color='blue' t={ bindSecret ? 210 : 123 }/>
                    : <LoadingSimpleComponent color='blue' t={ bindSecret ? 165 : 100 }/> : null }
            { message ? Platform.OS === 'android'
                    ? <SimpleError text={ message } t={ bindSecret ? 210 : 123 } co={ 'red' } size={ 15 }/>
                    : <SimpleError text={ message } t={ bindSecret ? 165 : 100 } co={ 'red' } size={ 15 }/> : null }
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bodyContainer: {
    width: '100%',
    alignItems: 'center'
  },
  emailText: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    width: '65%',
    marginBottom: 10
  }
})