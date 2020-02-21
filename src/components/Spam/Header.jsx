import React from 'react';
import { View, Text, Platform, AsyncStorage } from 'react-native';
import Font from 'react-native-vector-icons/FontAwesome5';


export const ProfileHeaderComponent = ({ online, right, mid }) => {

  const _onSignOut = async _ => {
    if( right ) {
      await AsyncStorage.removeItem( 'access' );
      right.nav( 'Signin' );
    }
  }

  return (
    <View style={{ height: !online ? 35 : Platform.OS === 'android' ? 80 : 70, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#90b8f8' }}>
      <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
        {
          mid
            &&
              <View style={{ marginBottom: Platform.OS === 'android' ? 5 : 2, width: '100%', alignItems: 'center' }}>
                {
                  mid.msg
                    &&
                    <Text style={{ fontSize: 25, color: '#26282b', fontWeight: 'bold', letterSpacing: mid.ls ? mid.ls : 1 }}>{ mid.msg }</Text>
                }
              </View>
        }
        {
          right
            &&
              <View style={{ marginBottom: Platform.OS === 'android' ? 5 : 2, width: !mid ? '100%' : null }}>
                {
                  right.icon
                      &&
                        <Font
                          name={ right.icon && right.icon }
                          size={ right.size ? right.size : 20 }
                          onPress={() => _onSignOut()}
                          style={{ position: 'absolute', right: 10, top: right.top ? right.top : mid ? -2 : -25 }}
                          />
                }
              </View>
        }
      </View>
    </View>
  )
}