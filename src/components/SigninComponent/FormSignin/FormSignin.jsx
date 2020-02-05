import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { TextInputSensitiveComponent, TextInputNormalComponent, IconComponent } from '../../Spam'

export default ({ code, setCode, req, setReq, pass, setPass, bindPass, seeComp, toggleBind }) => (
  <View style={ styles.backInput }>
    <View style={ styles.forInput }>
      <TextInputNormalComponent 
        text='Company Code'
        value={ code }
        setValue={ setCode }
        />
      <IconComponent name='searchengin' h={ 50 } w={ 50 } r={ -30 } t={ Platform.OS === 'android' ? 8 : 0 } press={ seeComp }/>
    </View>
    <View style={ styles.forInput }>
      <TextInputNormalComponent
        text='username / email'
        value={ req }
        setValue={ setReq }
        />
    </View>
    <View style={ styles.forInput }>
      <TextInputSensitiveComponent
        text='password'
        sensitive={ bindPass }
        value={ pass }
        setValue={ setPass }
        />
      <IconComponent name={ bindPass ? 'eye-slash' : 'eye' } h={ 50 } w={ 50 } r={ -30 } t={ Platform.OS === 'android' ? 8 : 0 } press={ toggleBind }/>
    </View>
  </View>
)


const styles = StyleSheet.create({
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
  }
});
