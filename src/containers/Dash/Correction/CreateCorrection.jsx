import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl, Platform, Image } from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../../graph';
import { getAccess } from '../../../service';
import { ListCorrectionComponent } from '../../../components';

export const CreateCorrectionContainers = ({ navigation: { navigate: push } }) => {
  const [ loading, setLoading ] = useState( false );
  const [ loadingCheck, setLoadingCheck ] = useState( false );
  const [ refreshing, setRefresh ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ getAttId, setAttId ] = useState( '' );
  const [ fetchHistory, { data: Att } ] = useLazyQuery( Query.GET_HISTORY, { fetchPolicy: 'no-cache' } );
  const [ checkAtt, { data: check } ] = useLazyQuery( Query.CHECK_AVAILABLE_ATT, { fetchPolicy: 'no-cache' } );

  useEffect(() => {
    fetching()
  }, []);

  const fetching = async _ => {
    setLoading( true );
    try {
      setMessage( false );
      const { code, token } = await getAccess();
      if( code, token ) {
        await fetchHistory({ variables: { code, token }})
        setTimeout(() => {
          setLoading( false )
        }, 800);
      }
    }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); setLoading( false ); _onClear( setMessage ) }
  }

  const _onClear = meth => setTimeout(() => meth( false ), 2000);

  const onRefresh = React.useCallback(async () => {
    setRefresh(true);
    await fetching();
    setRefresh( false );
  }, [ refreshing ]);

  const checkAvailable = async id => {
    setAttId( '' );
    try {
      setMessage( false );
      setLoadingCheck( true );
      const { code, token } = await getAccess();
      if( code, token ) {
        await checkAtt({ variables: { code, token, id } })
        await setAttId( id );
        setLoadingCheck( false );
      }
    }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); setLoadingCheck( false ); _onClear( setMessage ) }
  }

  const triggerCheck = ( msg ) => {
    if( msg === 'ok' ) push( 'Form', { id: getAttId } );
    else setMessage( 'Something Wrong' );
  }
  

  return (
    <View style={{ flex: 1, backgroundColor: '#353941' }}>
    { loading && !message
        ? <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size='large' color='white' />
            <Text style={{ color: 'white', fontWeight: 'bold', letterSpacing: 1, marginTop: 10, fontSize: Platform.OS === 'android' ? 15: 20 }}>Please wait...</Text>
          </View>
        : null }
    { message && !loading
        ? <View style={{ wdith: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={ require('../../../../assets/sadforerror.png') } style={{ width: 150, height: 150 }} />
            <Text style={{ fontSize: 12, color: 'red', fontWeight: 'bold', letterSpacing: 2, textAlign: 'center' }}>{ message }</Text>
          </View>
        : null }
    {
      Att && Att.getHistory.length && !loading && !message
        ? 
          <ScrollView style={{ flex: 1,}} refreshControl={ Platform.OS === 'ios' ? <View><RefreshControl refreshing={ refreshing } onRefresh={ onRefresh }/></View> : <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /> }>
            <View style={{ height: '100%', width: '100%' }}>
              { check && check.check && !loading 
                  ? triggerCheck( check.check.msg )
                  : null }
              
                  <View>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Select Attendance</Text>
                    { Att.getHistory.map(el => <ListCorrectionComponent key={ el._id } item={ el } checkAvailable={ checkAvailable } loadingCheck={ loadingCheck } message={ message }/>) }
                  </View>
            </View>
          </ScrollView>
      : null }
    </View>
  )
}