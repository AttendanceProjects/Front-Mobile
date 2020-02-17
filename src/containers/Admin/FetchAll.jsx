import React, { useState, useEffect } from 'react';
import { View, Animated, Text, Alert, ScrollView, TouchableOpacity, RefreshControl, Platform, ActivityIndicator } from 'react-native';
import { getAccess } from '../../service';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Mutation, Query } from '../../graph';
import { ListComponentAdmin, FadeViewAdmin } from '../../components'

export const GetAllCorrection = ({ navigation: { navigate: push, state: { params } } }) => {
  const [ loading, setloading ] = useState( true );
  const [ show, setShow ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ getAllCorrection ] = useMutation( Mutation.SEE_REQ_CORRECTION );
  const [ items, setItems ] = useState( ['s'] );
  const [ refreshing, setRefresh ] = useState( false );
  const [ correctId, setCorrectId ] = useState( false );
  const [ access, setAccess ] = useState( false );


  useEffect(() => {
    (async() => {
      setShow( false )
      const { code, token } = await getAccess();
      setAccess({ code, token })
      const { pin_security } = await params
      if( code && token && pin_security ) {
        _onFetching( code, token, pin_security );
      }else if( !pin_security ) Alert.alert('warning', 'we cant found your pin security, please try again', [{ text: 'Yes', onPress: _ => push( 'DashBoard' ) }])
      else Alert.alert('warning', 'you\'re logout, please signin again', [{text: 'Yes', onPress: _ => push( 'Signin' )}])
    })()
  }, [])

  const _onFetching = async (code, token, pin_security) => {
    setloading( true );
    setItems([ 's' ]);
    try{
      const { data: { reqIn } } = await getAllCorrection({ variables: { code, token, pin_security } })
      setItems( reqIn );
      console.log( reqIn );
      setloading( false );
    }catch({ graphQLErrors }){ setMessage( graphQLErrors[0].message ); _onClear( setMessage ); setloading( false ); }
  }

  const onRefresh = React.useCallback(async () => {
    setRefresh(true);
    await _onFetching();
    setRefresh( false );
  }, [ refreshing ]);

  const _onClear = meth => setTimeout(() => meth( false ), 2000);

  const _onSeeDetail = async (stats, id) => {
    if( id ) await setCorrectId( id );
    else await setCorrectId( false );
    setShow( stats );
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#353941' }}>
      <View style={{ height: 50, width: '100%', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 28, letterSpacing: 1 }}>Admin Page</Text>
      </View>
      <ScrollView refreshControl={ Platform.OS === 'ios' ? <View><RefreshControl refreshing={ refreshing } onRefresh={ onRefresh }/></View> : <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /> }>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, width: '100%' }}>
          { items && items.length || loading
              ? items.map(el => <ListComponentAdmin item={ el } key={ el._id } loading={ loading } action={ _onSeeDetail } />)
              : null }
        </View>

      </ScrollView>
      { show 
          &&  <FadeViewAdmin show={ show } close={ _onSeeDetail } id={ correctId } code={ access.code } token={ access.token }/> }
    </View>
  )
}
