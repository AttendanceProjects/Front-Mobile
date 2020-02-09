import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { checkConnection, getAccess, uploadImage } from '../../service'
import { ProfileHeaderComponent, OfflieHeaderComponent } from '../../components';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Query, Mutation } from '../../graph';
import Font from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export const ProfileContainers = ({ navigation }) => {
  const [ isOnline, setIsOnline ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ success, setSuccess ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ uploadLoading, setUploadLoading ] = useState( false );
  const [ getUser, { data: user} ] = useLazyQuery( Query.CHECK_SIGN_IN );
  const [ updateProfile ] = useMutation( Mutation.UPDATE_PROFILE_IMAGE );


  useEffect(() => {
    (async () => {
      await _getPermissionAsync();
      setLoading( true )
      await checkConnection({ save: setIsOnline })
      try {
        const { code, token } = await getAccess();
        await getUser({ variables: { code, token } });
        setLoading( false );
      }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); setTimeout(() => setMessage( false ), 5000) }
    })()
  }, [])

  const _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.cancelled && result.uri) {
      setUploadLoading( true )
      const { code, token } =  await getAccess();
      let formData = new FormData();
      formData.append( 'image', { name: `profile/${ code }.jpg`, type: 'image/jpg', uri: result.uri })
      const { success, error } = await uploadImage({ code, token, formData })
      console.log( success, error );
      if( success ) {
        const { data } = await updateProfile({ variables: { code, token, image: success } });
        console.log( data );
        if( data ) {
          setSuccess( 'Success update profile' );
          setUploadLoading( false );
          setTimeout(() => setSuccess( false ), 5000);
        }
      }else{
        setUploadLoading( false )
        setMessage( error );
        setTimeout(() => setMessage( false ), 5000 );
      }
    }else {
      console.log( result );
      setMessage( 'OK try next time' );
      setTimeout(() => setMessage( false ), 5000);
    }
  };

  const _getPermissionAsync = async () => {
    if ( Platform.OS === 'ios' || Platform.OS === 'IOS' ) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        setLoading( false );
      }
    }
  }

  return (
    <>
      { !isOnline && <OfflieHeaderComponent /> }
      <ProfileHeaderComponent
        online={ isOnline }
        right={{ icon: 'sign-out-alt', size: 20, nav: navigation.navigate, top: Platform.OS === 'android' ? 6 : 2 }}
        mid={{ msg: 'Profile', ls: 2 }} />
      <View style={{ flex: 1, backgroundColor: '#353941' }}>
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
              <View style={{ flex: 1, padding: 15, alignItems: 'center', justifyContent: 'space-around' }}>
                <View style={{ flex: 0.2, width: '98%', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                  <Image source={{ uri: user.checkSignin.profile_image }} style={{ height: 100, width: 100, borderRadius: 30 }} />
                  { uploadLoading
                      ? <ActivityIndicator color='red' style={{ marginTop: 10, marginBottom: 5 }} />
                      :
                        <TouchableOpacity onPress={() => _pickImage()} style={{ marginBottom: 5, borderRadius: 10, marginTop: 10, backgroundColor: '#84142d', height: 30, width: 120, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 15, color: 'white', fontWeight: 'bold' }}>Change Profile</Text>
                        </TouchableOpacity> }
                  { message || success ? <Text style={{ fontSize: Platform.OS === 'android' ? 12 : 15, fontWeight: 'bold', color: success ? 'green' : 'red' }}>{ message || success }</Text> : null }
                </View>
                <TableComponent user={ user.checkSignin } />
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
            : <Text>Something error</Text>
        }
      </View>
    </>
  )
}

const TableComponent = ({ user }) => (
  <View style={{ flex: 0.55, width: '98%', padding: 10, justifyContent: 'center' }}>
    <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
      <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Username </Text>
      <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 12 : 14 }}>{ user.username ? user.username.toUpperCase() : ' - ' }</Text>
    </View>
    <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
      <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Email </Text>
      <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 12 : 14 }}>{ user.email ? user.email : ' - ' }</Text>
    </View>
    <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
      <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Position </Text>
      <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 12 : 14 }}>{ user.role ? user.role : ' - ' }</Text>
    </View>
    <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
      <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Gender </Text>
      <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 12 : 14 }}>{ user.gender ? user.gender.toUpperCase() : ' - ' }</Text>
    </View>
    <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
      <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Phone Number </Text>
      <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 12 : 14 }}>{ user.phone ? user.phone : ' - ' }</Text>
    </View>
    <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
      <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Religion </Text>
      <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 12 : 14 }}>{ user.religion ? user.religion.toUpperCase() : ' - ' }</Text>
    </View>
    <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
      <Text style={{ fontSize: Platform.OS === 'android' ? 10 : 12, borderBottomWidth: 1, borderBottomColor: 'black' }}> Identity Number </Text>
      <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 12 : 14 }}>{ user.identityNumber ? user.identityNumber : ' - ' }</Text>
    </View>
  </View>
)