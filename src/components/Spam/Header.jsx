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

export const HeaderComponent = ({ left, mid, right, online }) => {

  const _onPageChange = async type => {
    if( type === 'left' && left ) left.action( 'Home' );
    else if( type === 'mid' && mid ) mid.action();
    else if( type === 'right' && right ) {
      await AsyncStorage.removeItem( 'access' );
      right.nav( 'Home' )
    }
  }

  return (
    <View style={{ height: !online ? 35 : Platform.OS === 'android' ? 80 : 70, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#90b8f8' }}>
      <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
        {
          left
            &&
              <View style={{ marginBottom: Platform.OS === 'android' ? 5 : 2 }}>
                {
                  left.icon
                    &&
                      <Font
                        name={ left.icon }
                        size={ left.size ? left.size : 20 }
                        onPress={() => _onPageChange( 'left' )}
                        style={{ position: 'absolute', top: left.top ? left.top : mid ? -2 : -25, left: 20 }}
                        />  
                }
              </View>
        }
        {
          mid
            &&
              <View style={{ marginBottom: Platform.OS === 'android' ? 5 : 2, width: '100%', alignItems: 'center' }}>
                {
                  mid.msg
                    ?
                    <Text style={{ fontSize: mid.size ? mid.size : 25, color: mid.color ? mid.color : '#26282b', fontWeight: 'bold', letterSpacing: mid.ls ? mid.ls : 1 }}>{ mid.msg }</Text>
                    : mid.icon
                        && 
                          <Font
                            name={ mid.icon && mid.icon }
                            size={ mid.size ? mid.size : 20 }
                            onPress={() => _onPageChange( 'mid' )}
                            />
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
                          onPress={() => _onPageChange( 'right' )}
                          style={{ position: 'absolute', right: right.right ? right.right : 10, top: right.top ? right.top : mid ? -2 : -25 }}
                          />
                }
              </View>
        }
      </View>
    </View>
  )
}