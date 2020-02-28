import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { checkConnection, getAccess, uploadImage } from '../../../service'
import { ProfileHeaderComponent, OfflieHeaderComponent, SimpleLoadingNew } from '../../../components';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Query, Mutation } from '../../../graph';
import Font from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';


import { ContainerStyle } from '../ContainerStyle';

const {
  profile_container,
  profile_header,
  profile_image,
  profile_up_loading,
  profile_button_upload,
  font_medium,
  profile_footer,
  profile_button_change,
  font_small,
  profile_table,
  profile_per_row,
  profile_table_lable,
  profile_table_span
} = ContainerStyle

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
      const { network } = await checkConnection();
      setIsOnline( network );
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
      if( success ) {
        const { data } = await updateProfile({ variables: { code, token, image: success } });
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
            ? <SimpleLoadingNew />
            :
          user && user.checkSignin
            ? 
              <View style={ profile_container }>
                <View style={ profile_header }>
                  <Image source={{ uri: user.checkSignin.profile_image }} style={ profile_image } />
                  { uploadLoading
                      ? <ActivityIndicator color='red' style={ profile_up_loading } />
                      :
                        <TouchableOpacity onPress={() => _pickImage()} style={ profile_button_upload }>
                          <Text style={{ ...font_medium, color: 'white' }}>Change Profile</Text>
                        </TouchableOpacity> }
                  { message || success ? <Text style={{ ...font_medium, color: success ? 'green' : 'red' }}>{ message || success }</Text> : null }
                </View>
                <TableComponent user={ user.checkSignin } />
                <View style={ profile_footer }>
                  <TouchableOpacity style={ profile_button_change } onPress={() => navigation.navigate('Change')}>
                    <Font name='key' color='white' size={ 25 } />
                    <Text style={{ ...font_small, fontWeight: 'bold', color: 'white' }}>Change Pass</Text>
                  </TouchableOpacity>
                  { user && user.checkSignin && user.checkSignin.role === 'master' || user.checkSignin.role === 'HR Staff' || user.checkSignin.role === 'director'
                      ? <><TouchableOpacity style={ profile_button_change } onPress={() => navigation.navigate('Pin')}>
                          <Font name='apple-alt' color='white' size={ 25 } />
                          <Text style={{ ...font_small, fontWeight: 'bold', color: 'white' }}>Change Pin</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ profile_button_change } onPress={() => navigation.navigate('CreateUser')}>
                          <Font name='user' color='white' size={ 25 } />
                          <Text style={{ ...font_small, fontWeight: 'bold', color: 'white' }}>Create</Text>
                        </TouchableOpacity></>
                      : null }
                </View>
              </View>
            : <Text>Something error</Text>
        }
      </View>
    </>
  )
}

const TableComponent = ({ user }) => (
  <View style={ profile_table }>
    <View style={ profile_per_row }>
      <Text style={ profile_table_lable }> Username </Text>
      <Text style={ profile_table_span }>{ user.username ? user.username.toUpperCase() : ' - ' }</Text>
    </View>
    <View style={ profile_per_row }>
      <Text style={ profile_table_lable }> Email </Text>
      <Text style={ profile_table_span }>{ user.email ? user.email : ' - ' }</Text>
    </View>
    <View style={ profile_per_row }>
      <Text style={ profile_table_lable }> Position </Text>
      <Text style={ profile_table_span }>{ user.role ? user.role : ' - ' }</Text>
    </View>
    <View style={ profile_per_row }>
      <Text style={ profile_table_lable }> Gender </Text>
      <Text style={ profile_table_span }>{ user.gender ? user.gender.toUpperCase() : ' - ' }</Text>
    </View>
    <View style={ profile_per_row }>
      <Text style={ profile_table_lable }> Phone Number </Text>
      <Text style={ profile_table_span }>{ user.phone ? user.phone : ' - ' }</Text>
    </View>
    <View style={ profile_per_row }>
      <Text style={ profile_table_lable }> Religion </Text>
      <Text style={ profile_table_span }>{ user.religion ? user.religion.toUpperCase() : ' - ' }</Text>
    </View>
    <View style={ profile_per_row }>
      <Text style={ profile_table_lable }> Identity Number </Text>
      <Text style={ profile_table_span }>{ user.identityNumber ? user.identityNumber : ' - ' }</Text>
    </View>
  </View>
)