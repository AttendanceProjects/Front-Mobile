import React, { useState, useEffect } from 'react';
import { View, Text, Platform, ScrollView, Image, StyleSheet, Linking, ActivityIndicator, Alert } from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../../graph';
import { ListEmployeeComponent } from '../../../components'
import Font from 'react-native-vector-icons/FontAwesome5';
import { getAccess } from '../../../service'
import qs from 'qs';

export const EmployeeContainers = ({ navigation }) => {
  const [ employee, { data: allEmployee, loading } ] = useLazyQuery( Query.ALL_EMPLOYEE );
  const [ getUser, { data: user } ] = useLazyQuery( Query.CHECK_SIGN_IN );
  const [ message, setMessage ] = useState( false );
  const [ success, setSuccess ] = useState( false );

  useEffect(() => {
    (async () => {
      try {
        const { code, token } = await getAccess();
        if( code, token ) {
          await employee({ variables: { code, token } });
          await getUser({ variables: { code, token } });
        }else {
          setMessage( 'authentication error, please signin first' );
          setTimeout(() => navigation.navigate( 'Signin' ), 5000);
        }
      }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); _onClear( setMessage ) }
    })()
  }, [])

  const _onClear = meth => {
    setTimeout(() => meth( false ), 3500);
  }

  const sendEmail = async (to, options = {}) => {
    const { cc, bcc } = options;

    let url = `mailto:${to}`;

    const query = qs.stringify({
        subject: 'Presence',
        body: 'I Want ask something',
        cc: cc,
        bcc: bcc
    });

    if (query.length) {
        url += `?${query}`;
    }

    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
        throw new Error('Provided URL can not be handled');
    }

    return Linking.openURL(url);
  }

  const _onSendEmail = ({ to }) => {
    if( user && user.checkSignin ) {
      if( to === user.checkSignin.email ) Alert.alert('Warning', 'cant email to yourself' );
      else _alertSendMail( to );
    }else _alertSendMail( to );
  }

  const _alertSendMail = to => {
    Alert.alert('Attention', `are you sure want send email to ${ to }`, [ { text: 'no' },{ text: 'yes', onPress: async () => {
      const msg =  await sendEmail(to,'hai', 'hai');
      if( msg ) {
        setSuccess( 'message successfully sent' );
      }
    }}])
  }

  const _onChatWa = ({ phone }) => {
    if( user && user.checkSignin ) {
      if ( phone === user.checkSignin.phone ) Alert.alert('Warning', 'cant chat yourself' );
      else _alertWa( phone )
    }else _alertWa( phone )
  }

  const _alertWa = phone => {
    Alert.alert('Attention', `chat with ${ phone }`, [
      { text: 'No' },
      { text: 'Yes', onPress: () => {
        Linking.openURL(`https://api.whatsapp.com/send?phone=${ phone.split('')[0] === '0' ? phone.slice(1, phone.length ) : phones }&text=i%20want%20ask%20you%20something%20sir`)
      }}
    ])
  }

  const _onCalling = ({ phone }) => {
    if( user && user.checkSignin ) {
      if ( phone === user.checkSignin.phone ) Alert.alert('Warning', 'cant call yourself' );
      else Linking.openURL(`tel:${ phone }`)
    }else Linking.openURL(`tel:${ phone }`)
  }


  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#C1C1C1' }}>
      <View style={{ height: Platform.OS === 'android' ? 85 : 80, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', padding: 15 }}>
        <Text style={{ color: '#353941', fontWeight: 'bold', fontSize: Platform.OS === 'android' ? 25 : 28 }}>
          Employee &nbsp;
          { allEmployee && allEmployee.seeEmployee.length
              ? <Text style={{ fontSize: 19 }}>
                  { allEmployee.seeEmployee.length }
                </Text> : null }
          { message || success
              &&  <Text style={{ color: message ? 'red' : 'green', fontSize: Platform.OS === 'android' ? 8 : 10, marginLeft: 5 }}>
                  { message || success }
                  </Text> }
          </Text>
          { allEmployee && allEmployee.seeEmployee
              ? <Font name={ 'search' } size={ 20 } onPress={() => navigation.navigate( 'Filter', { count: allEmployee.seeEmployee.length } )} /> 
              : null }
      </View>
      { loading
          &&  <View style={{ width: '100%', height: '70%', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color='black' size='large'/>
              </View>}
      <ScrollView style={{ width: '100%', padding: 10 }}>
        {
          allEmployee && allEmployee.seeEmployee && user && user.checkSignin && !loading
            &&
              allEmployee.seeEmployee.map((el, i) => <ListEmployeeComponent username={ user.checkSignin.username } key={ el._id } i={ i } el={ el } _onChatWa={ _onChatWa } _onSendEmail={ _onSendEmail } _onCalling={ _onCalling }/> )
        }
      </ScrollView>
    </View>
  )
}

