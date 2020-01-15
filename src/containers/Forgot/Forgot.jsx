import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LogoComponent, TextInputComponent, TouchComponent } from '../../components/Spam';

export const Forgot = () => {
  const [ email, setEmail ] = useState( '' );
  const [ secretCode, setSecretCode ] = useState( '' );
  const [ newPass, setNewPass ] = useState( '' );
  const [ bindSecret, setBindSecret ] = useState( false );

  const sendCode = () => {
    // tembak server send email => response true else false
    setBindSecret( true )
  }

  const changePassword = () => {
    // tembak server change password
  }
  return (
    <View style={ styles.container }>
      <LogoComponent
        w={ 250 }
        h={ 250 }
        t={ Platform.OS === 'android' ? 10 : 50 }
        />
        <View style={ styles.bodyContainer }>
          <View style={ styles.emailText }>
            <TextInputComponent
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
                  <TextInputComponent
                    text='Secret Code'
                    value={ secretCode }
                    setValue={ setSecretCode }
                    />
                </View>
                <View style={ styles.emailText }>
                  <TextInputComponent
                    text='New Password'
                    value={ newPass }
                    setValue={ setNewPass }
                    />
                </View>
              </>
          }
          <TouchComponent
            text={ bindSecret ? 'Change Password' : 'Send Code'}
            w={ '65%' }
            h={ Platform.OS === 'android' ? 30 : 26 }
            press={ bindSecret ? changePassword : sendCode }
            />
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