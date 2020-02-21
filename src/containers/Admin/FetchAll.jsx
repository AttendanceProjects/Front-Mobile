import React, { useState, useEffect } from 'react';
import { View, Animated, Text, Alert, ScrollView, TouchableOpacity, RefreshControl, Platform, ActivityIndicator } from 'react-native';
import { getAccess } from '../../service';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Mutation, Query } from '../../graph';
import { ListComponentAdmin, FadeViewAdminComponent } from '../../components'

export const GetAllCorrection = ({ navigation: { navigate: push, state: { params } } }) => {
  const [ loading, setloading ] = useState( false );
  const [ show, setShow ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ getAllCorrection ] = useMutation( Mutation.SEE_REQ_CORRECTION );
  const [ items, setItems ] = useState( ['s'] );
  const [ refreshing, setRefresh ] = useState( false );
  const [ correctId, setCorrectId ] = useState( false );
  const [ access, setAccess ] = useState( false );
  const [ security, setSecurity ] = useState( false );


  useEffect(() => {
    (async() => {
      setShow( false )
      const { code, token } = await getAccess();
      setAccess({ code, token })
      const { pin_security } = await params
      setSecurity( pin_security );
      if( code && token && pin_security ) {
        _onFetching( code, token, pin_security );
      }else if( !pin_security ) Alert.alert('warning', 'we cant found your pin security, please try again', [{ text: 'Yes', onPress: _ => push( 'DashBoard' ) }])
      else Alert.alert('warning', 'you\'re logout, please signin again', [{text: 'Yes', onPress: _ => push( 'Signin' )}])
    })()
  }, [])

  const _onFetching = async (code, token, pin_security) => {
    setShow( false );
    setloading( true );
    setItems([ 's' ]);
    try{
      const { data: { reqIn } } = await getAllCorrection({ variables: { code, token, pin_security } })
      setItems( reqIn );
      setloading( false );
    }catch({ graphQLErrors }){ setMessage( graphQLErrors[0].message ); _onClear( setMessage ); setloading( false ); }
  }

  const onRefresh = React.useCallback(async () => {
    setRefresh(true);
    const { code, token } = await getAccess();
    const { pin_security } = params;
    await _onFetching( code, token, pin_security );
    setRefresh( false );
  }, [ refreshing ]);

  const _onClear = meth => setTimeout(() => meth( false ), 2000);

  const _onSeeDetail = async (stats, id) => {
    console.log( id )
    if( id ) await setCorrectId( id );
    else await setCorrectId( false );
    setShow( stats );
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#353941' }}>
      <View style={{ height: '10%', width: '100%', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 28, letterSpacing: 1 }}>Admin Page</Text>
      </View>
      <ScrollView refreshControl={ Platform.OS === 'ios' ? <View><RefreshControl refreshing={ refreshing } onRefresh={ onRefresh }/></View> : <View><RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /></View> }>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, width: '100%', height: '90%'  }}>
          { items && items.length || loading
              ? items.map((el, i) => <ListComponentAdmin item={ el } key={ i } loading={ loading } action={ _onSeeDetail } />)
              : null}
        </View>
        { items && items.length === 0
            ? <View style={{ height: '100%', width: '100%', marginTop: 50, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold' }}>Empty Request</Text>
              </View>
            : null}
      </ScrollView>
      { show 
          &&  <FadeViewAdminComponent pin={ security } show={ show } _onFetching={ _onFetching } close={ _onSeeDetail } id={ correctId } code={ access.code } token={ access.token }/> }
    </View>
  )
}
