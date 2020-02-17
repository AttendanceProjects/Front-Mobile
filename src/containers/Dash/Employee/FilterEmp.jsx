import React, { useState, useEffect } from 'react';
import { View, Text, Platform, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert, Linking } from 'react-native';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Mutation, Query } from '../../../graph';
import { getAccess } from '../../../service'
import { ListEmployeeComponent } from '../../../components';
import Font from 'react-native-vector-icons/FontAwesome5';

export const FilterEmployeeContainers = ({ navigation }) => {
  const [ searchEmployee ] = useMutation( Mutation.FILTER_EMPLOYEE );
  const [ fetchUser, { data: user } ] = useLazyQuery( Query.CHECK_SIGN_IN );
  const [ access, setAccess ] = useState( {} );
  const [ search, setSearch ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ success, setSuccess ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ count, setCount ] = useState( false );
  const [ items, setItems ] = useState( [] );


  useEffect(() => {
    (async () => {
      setLoading( true );
      const { count: countParams } = await navigation.state.params;
      setCount( countParams )
      const { code, token } = await getAccess();
      if( code, token ) {
        setAccess({ code, token })
        await fetchUser({ variables: { code, token } })
        setLoading( false );
      }else {
        setLoading( false );
        setMessage( 'please signin again' );
        _onClear( setMessage );
        setTimeout(() => navigation.navigate( 'Signin' ), 2000);
      }
    })()
  }, [])

  const _onClear = meth => {
    setTimeout(() =>  meth( false ), 3500);
  }

  const _onFiltering = async () => {
    if( search ) {
      try {
        setLoading( true );
        const { code, token } = access;
        const { data: { filterEmployee } } = await searchEmployee({ variables: { code, token, search: search.toLowerCase() } });
        if( filterEmployee && filterEmployee.length ) {
          setItems( filterEmployee );
          setLoading( false );
          setSuccess( 'We found!' );
          _onClear( setSuccess );
        }else{
          setMessage( 'Not Found');
          _onClear( setMessage );
          setLoading( false );
        }
      }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); _onClear( setMessage ); setLoading( false ) }
    }else{
      setItems( [] );
      setMessage( 'Empty search' );
      _onClear( setMessage );
    }
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
    <View style={{ backgroundColor: '#C1C1C1', flex: 1, padding: 10 }}>
      { count
          &&  <Text style={{ textAlign: 'center', fontSize: 25 }}>
                Employee <Text style={{ color: 'grey', fontSize: 18, fontWeight: 'bold' }}>{ count }</Text>
              </Text> }
      <View style={{ height: Platform.OS === 'android' ? 85 : 80, width: '100%', padding: 20, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: '70%' }}>
          { message || success
              ? <Text style={{ textAlign: 'center', color: message ? 'red' : 'green', marginBottom: 10 }}>{ message || success }</Text>
              : null }
          <TextInput style={{ width: '89%', borderRadius: 2, shadowOpacity: 5, padding: 5, shadowColor: '#353941', backgroundColor: 'white', height: '50%', fontWeight: 'bold' }} keyboardType='default' autoCapitalize='none' placeholder={ 'Find someone...' } value={ search } onChangeText={ msg => setSearch( msg ) }/>
        </View>
        <TouchableOpacity style={{ width: '30%', alignItems: 'flex-end' }} onPress={() => _onFiltering()}>
          <Font name={ 'search' } size={ 20 } />
        </TouchableOpacity>
      </View>
      { loading
          &&  <View style={{ width: '100%', height: '70%', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color='blue'/>
              </View>  }
      <ScrollView style={{ width: '100%', padding: 10 }}>
        {
          items && items.length && !loading && user && user.checkSignin
            ? items.map((el, i) => <ListEmployeeComponent key={ el._id } i={ i } el={ el } _onChatWa={ _onChatWa } _onSendEmail={ _onSendEmail } username={ user.checkSignin.username } _onCalling={ _onCalling }/> )
            : null
        }
      </ScrollView>
    </View>
  )
}