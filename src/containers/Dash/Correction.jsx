import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import Font from 'react-native-vector-icons/FontAwesome5'
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../graph';
import { getAccess } from '../../service'
import { SimpleError } from '../../components';

export const CorrectionContainers = () => {
  const [ fetch, { data: Att } ] = useLazyQuery( Query.GET_HISTORY );
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( false );

  useEffect(() => {
    (async () => {
      try {
        setLoading( true );
        const { code, token } = await getAccess();
        await fetch({ variables: { code, token } })
        setLoading( false );
      }catch({ graphQLErrors }) { setError( graphQLErrors[0].message ); console.log( graphQLErrors[0].message ) }
    })()
  }, [])

  console.log( Att );

  return (
    <SafeAreaView style={{ backgroundColor: '#353941', flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, width: '100%' }}>
          <Text style={{ textAlign: 'center', fontSize: 30, color: 'white', fontWeight: 'bold' }}>Select Attendance</Text>
          {
            Att && Att.getHistory.length
              ?
              <View style={{ alignItems: 'center', width: '100%' }}>
                <FlatList
                  style={{ width: '100%' }}
                  data={ Att.getHistory }
                  renderItem={({ item, index }) => (
                    <View style={{ width: '96%', height: 60, borderWidth: 1, marginTop: 15, borderColor: 'red', backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ width: '100%' }}>{ index } dqwdqw</Text>
                    </View>
                  )}
                  keyExtractor={( item, index ) => index.toString()}
                />
              </View>
              : loading
                  ? <ActivityIndicator color={ 'blue' } />
                  : error && <SimpleError />
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}