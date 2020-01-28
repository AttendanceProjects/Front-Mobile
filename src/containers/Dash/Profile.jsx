import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { checkConnection, getAccess } from '../../service'
import { HeaderComponent, OfflieHeaderComponent } from '../../components';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../graph';
import Font from 'react-native-vector-icons/FontAwesome5'

export const ProfileContainers = ({ navigation }) => {
  const [ isOnline, setIsOnline ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ getUser, { data: user} ] = useLazyQuery( Query.CHECK_SIGN_IN );

  useEffect(() => {
    (async () => {
      setLoading( true )
      await checkConnection({ save: setIsOnline })
      try {
        const { code, token } = await getAccess();
        await getUser({ variables: { code, token } });
        setLoading( false );
      }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message )}
    })()
  }, [])

  console.log( user );

  return (
    <>
      { !isOnline && <OfflieHeaderComponent /> }
      <HeaderComponent
        online={ isOnline }
        right={{ icon: 'sign-out-alt', size: 20, nav: navigation.navigate, top: Platform.OS === 'android' ? 6 : 2 }}
        mid={{ msg: 'Profile', ls: 2 }}
        left={{ icon: Platform.OS === 'android' ? 'list-ol' : 'sliders-h', top: Platform.OS === 'android' ? 10 : 1, action: navigation.openDrawer }} />
      <View style={{ flex: 1 }}>
        {
          loading
            ? 
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={ 'blue' } size='large' />
                <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 20, fontSize: 20 }}>Loading...</Text>
              </View>
            :
          user && user.checkSignin
            ? 
              <View style={{ flex: 1, padding: 15, alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 0.2, width: '98%', alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={{ uri: user.checkSignin.profile_image }} style={{ height: 100, width: 100, borderRadius: 30 }} />
                </View>
                <View style={{ flex: 0.55, width: '98%', padding: 10, justifyContent: 'center' }}>
                  <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
                    <Text style={{ fontSize: 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Username </Text>
                    <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{ user.checkSignin.username.toUpperCase() }</Text>
                  </View>
                  <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
                    <Text style={{ fontSize: 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Email </Text>
                    <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{ user.checkSignin.email }</Text>
                  </View>
                  <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
                    <Text style={{ fontSize: 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Position </Text>
                    <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{ user.checkSignin.role }</Text>
                  </View>
                  <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
                    <Text style={{ fontSize: 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Gender </Text>
                    <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{ user.checkSignin.gender.toUpperCase() }</Text>
                  </View>
                  <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
                    <Text style={{ fontSize: 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Phone Number </Text>
                    <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{ user.checkSignin.phone }</Text>
                  </View>
                  <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
                    <Text style={{ fontSize: 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Religion </Text>
                    <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{ user.checkSignin.religion.toUpperCase() }</Text>
                  </View>
                  <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
                    <Text style={{ fontSize: 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Identity Number </Text>
                    <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{ user.checkSignin.identityNumber }</Text>
                  </View>
                </View>
                <View style={{ flex: 0.2, flexDirection: 'row', width: '98%', justifyContent: 'space-around', alignItems: 'center' }}>
                  <TouchableOpacity style={{ alignItems: 'center', backgroundColor: '#f0134d', height: 60, width: Platform.OS === 'android' ? 80 : 75, borderRadius: 20, justifyContent: 'center' }} onPress={() => navigation.navigate('Change')}>
                    <Font name={ 'key' } size={ 25 } />
                    <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 12, fontWeight: 'bold' }}>Change Pass</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: 60, width: 75, borderRadius: 20, backgroundColor: '#f0134d' }}>
                    <Font name={ 'calendar-check' } size={ 25 } />
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Approval</Text>
                  </TouchableOpacity>
                </View>
              </View>
            : message
                ? <Text>{ message }</Text>
                : <Text> No </Text>
        }
      </View>
    </>
  )
}