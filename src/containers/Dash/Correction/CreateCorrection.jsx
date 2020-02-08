import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../../graph';
import { getAccess } from '../../../service';
import { CorrectionLoadingComponent } from '../../../components';

export const CreateCorrectionContainers = ({ navigation }) => {
  const [ access, setAccess ] = useState( {} );
  const [ loading, setLoading ] = useState( false );
  const [ loadingCheck, setLoadingCheck ] = useState( false );
  const [ message, setMessage ] = useState( false );
  const [ getAttId, setAttId ] = useState( '' );
  const [ fetchHistory, { data: Att } ] = useLazyQuery( Query.GET_HISTORY, { fetchPolicy: 'no-cache' } );
  const [ checkAtt, { data: check } ] = useLazyQuery( Query.CHECK_AVAILABLE_ATT, { fetchPolicy: 'no-cache' } );

  useEffect(() => {
    (async() => {
      try {
        setMessage( false );
        setLoading( true );
        const { code, token } = await getAccess();
        if( code, token ) {
          setAccess({ code, token });
          await fetchHistory({ variables: { code, token }})
          setLoading( false )
        }
      }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); setLoading( false ); }
    })()
  }, [])

  const checkAvailable = async id => {
    setAttId( '' );
    try {
      setMessage( false );
      setLoadingCheck( true );
      const { code, token } = access;
      if( code, token ) {
        await checkAtt({ variables: { code, token, id } })
        await setAttId( id );
        setLoadingCheck( false );
      }
    }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); setLoadingCheck( false ); }
  }

  const triggerCheck = ( msg ) => {
    if( msg === 'ok' ) navigation.navigate( 'Form', { id: getAttId } );
    else setMessage( 'Something Wrong' );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#353941', justifyContent: loading ? 'center' : "flex-start", alignItems: loading ? 'center' : 'flex-start' }}>
      { loading
          &&  <CorrectionLoadingComponent />}
      { check && check.check ? triggerCheck( check.check.msg ) : null }
      {
        Att && Att.getHistory && !loading
          ? 
          <View>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Select Attendance</Text>
            { Att.getHistory.map(el => (
                <TouchableOpacity key={ el._id } style={{ height: 60, width: '100%', marginTop: 15, paddingLeft: 10, paddingRight: 10 }} onPress={_ => checkAvailable( el._id )}>
                  <View style={{ width: '100%', backgroundColor: '#90b8f8', borderRadius: 5, height: '100%' }}>
                    <View style={{ width: '100%',  flexDirection: 'row', justifyContent: 'space-around', height: message ? '80%' : '100%' }} >
                      <View style={{ width: '45%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14 }}>{ el.date }</Text>
                      </View>
                      <View style={{ width: '55%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14, letterSpacing: 2 }}>Check In : <Text style={{ color: 'green', fontWeight: 'bold' }}>{ el.start }</Text></Text>
                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14, letterSpacing: 2 }}>Checkout : <Text style={{ color: 'green', fontWeight: 'bold' }}>{ el.end }</Text></Text>
                      </View>
                      { loadingCheck
                        &&  <View style={{ width: '15%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                              <ActivityIndicator color={ 'red' } />
                            </View> }
                      
                    </View>
                    { message
                      && <Text style={{ fontSize: 12, color: 'red', fontWeight: 'bold', letterSpacing: 2, textAlign: 'center' }}>{ message }</Text>}
                  </View>
                </TouchableOpacity>
            )) }
          </View>
          : null
      }
    </View>
  )
}