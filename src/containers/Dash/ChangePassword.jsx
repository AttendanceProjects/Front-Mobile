import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LogoComponent } from '../../components';
import { getAccess } from '../../service';
import { useMutation } from '@apollo/react-hooks';
import { Mutation } from '../../graph'

export const ChangePasswordContainers = ({ navigation }) => {
  const [ oldPass, setOldPass ] = useState( false );
  const [ newPass, setNewPass ] = useState( false );
  const [ confirmPass, setConfirmPass ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ submit ] = useMutation( Mutation.CHANGE_PASS );

  const _confirmChange = async () => {
    if( newPass !== confirmPass ) setMessage({ text: 'new pass & confirm pass not valid', status: true });
    else if( !newPass || !oldPass || !confirmPass ) setMessage({ text: 'make sure all field is not empty', status: true })
    else {
      try {
        setLoading( true );
        const { code, token } = await getAccess();
        const { data } = await  submit({ variables: { code, token, oldPass, newPass } });
        if ( data && data.changePass && data.changePass.msg ) {
          setMessage({ text: data.changePass.msg, status: false })
          setLoading( false );
          setTimeout(() => {
            setOldPass( false );
            setNewPass( false );
            setConfirmPass( false );
            navigation.goBack();
          }, 4000)
        }
      }catch({ graphQLErrors }) { setMessage({ text: graphQLErrors[0].message, status: true }) }
    }
    setTimeout(() => {
      setLoading( false );
      setMessage( false );
    }, 5000)
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <LogoComponent w={ 325 } h={ 325 } t={ 0 } r={ 'auto' }/>
      <TextInput keyboardType='default' autoCapitalize={ false } style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', height: 25 }} placeholder={ 'Old Password' } placeholderTextColor={ 'white' } onChangeText={ msg => setOldPass( msg ) }/>
      <TextInput keyboardType='default' autoCapitalize={ false } secureTextEntry={ true } style={{ color: 'white', fontWeight: 'bold', height: 25, marginTop: 15, textAlign: "center" }} placeholder={ 'New Password' } placeholderTextColor={ 'white' } onChangeText={ msg => setNewPass( msg ) }/>
      <TextInput keyboardType='default' autoCapitalize={ false } secureTextEntry={ true } style={{ color: 'white', fontWeight: 'bold', height: 25, marginTop: 15, textAlign: "center" }} placeholder={ 'Confirm Password' } placeholderTextColor={ 'white' } onChangeText={ msg => setConfirmPass( msg ) }/>
      { loading && <ActivityIndicator color={ 'blue' } />}
      { message && message.text ? <Text style={{ color: message.status ? 'red' : 'green', fontWeight: 'bold', fontSize: 12, marginTop: 5 }}>{ message.text }</Text> : null}
      <TouchableOpacity onPress={() => _confirmChange() } style={{ marginTop: 10, backgroundColor: '#ce0f3d', borderRadius: 25, width: '35%', height: 35, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
      </TouchableOpacity>
    </View>
  )

}