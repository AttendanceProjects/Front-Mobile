import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, Alert, TouchableHighlight } from 'react-native';
import { TextInputComponent, IconComponent, TouchComponent, LogoComponent } from '../../components/Spam'

export const Signin = ({ navigation }) => {
  const [ companyCode, setCompanyCode ] = useState( '' );
  const [ request, setRequest ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const [ watchPassword, setWatchPassword ] = useState( true );

  const toggleWatcher = () => { setWatchPassword( false ); setTimeout(() => setWatchPassword( true ),2000) }

  const showCompany = () => {
    Alert.alert('Company List', `
0001 - PT.Lim Digital Asia
    `)
  }

  return (
    <>
    <View style={ styles.container }>
      <LogoComponent w={ 250 } h={ 250 } t={ Platform.OS === 'android' ? 60 : 120 }/>
      <View style={ styles.outer }>
        <View style={ styles.backInput }>
          <View style={ styles.forInput }>
            <TextInputComponent 
              text='Company Code'
              value={ companyCode }
              setValue={ setCompanyCode }
              />
            <IconComponent name='searchengin' h={ 50 } w={ 50 } r={ -30 } t={ Platform.OS === 'android' ? 8 : 0 } press={ showCompany }/>
          </View>
          <View style={ styles.forInput }>
            <TextInputComponent
              text='username / email'
              value={ request }
              setValue={ setRequest }
              />
          </View>
          <View style={ styles.forInput }>
            <TextInputComponent
              text='password'
              sensitive={ watchPassword }
              value={ password }
              setValue={ setPassword }
              />
            <IconComponent name={ watchPassword ? 'eye-slash' : 'eye' } h={ 50 } w={ 50 } r={ -30 } t={ Platform.OS === 'android' ? 8 : 0 } press={ toggleWatcher }/>
          </View>
        </View>
        <TouchableHighlight style={ styles.highlightForgot } onPress={() => navigation.navigate( 'Forgot' )}>
          <Text style={ styles.textForgot }> Forgot Password ? </Text>
        </TouchableHighlight>
        <View style={ styles.btnBtm }>
          <TouchComponent
            h={ 30 }
            w={ '80%' }
            text='Sign In'
            />
        </View>
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
  forInput: {
    marginTop: Platform.OS === 'android' ? 5 : 15,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    width: '80%'
  },
  backInput: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-around'
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
