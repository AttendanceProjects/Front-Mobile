import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, ActivityIndicator, SafeAreaView, Image , TouchableOpacity} from 'react-native';
import Font from 'react-native-vector-icons/FontAwesome5'
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../../graph';
import { getAccess } from '../../../service'
import { SimpleError, MapCorrections } from '../../../components';

export const CorrectionContainers = () => {
  const [ fetch, { data: Att } ] = useLazyQuery( Query.USER_CORRECTION );
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( false );
  const [ zoom, setZoom ] = useState( false );

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
      <ScrollView >
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, width: '100%' }}>
          <Text style={{ textAlign: 'center', fontSize: 25, color: 'white', fontWeight: 'bold' }}>Correction</Text>
          { loading
            && <ActivityIndicator color={ 'blue' } />}
          { error && !loading
            ? <SimpleError /> : null }
          { Att && Att.userCorrection.length && !loading && !error
              ? <View style={{ alignItems: 'center', width: '100%' }}>
                  <FlatList
                    style={{ width: '100%' }}
                    data={ Att.userCorrection }
                    renderItem={({ item, index }) => (
                      <View style={{ width: '96%', padding: 10, height: 160, borderRadius: 10, marginLeft: 10, marginTop: 15, backgroundColor: '#90b8f8' }}>
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                          <View style={{ width: '50%' , flexDirection: 'column', borderBottomWidth: 1, borderBottomColor: 'black' }}>
                            <Text style={{ fontSize: 13 }}>Req At:</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{ item && item.createdAt ? new Date( item.createdAt ).toLocaleDateString() : ' - ' }</Text>
                          </View>
                          <View style={{ width: '50%', flexDirection: 'column', alignItems: 'flex-end', borderBottomColor: 'black', borderBottomWidth: 1 }}>
                            <Text style={{ fontSize: 13 }}>Attendance Date</Text>
                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{ item.AttId && item.AttId.date ? item.AttId.date : ' - ' }</Text>
                          </View>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                          <View style={{ width: '50%', marginTop: 10, flexDirection: 'row'}}>
                            <Image source={ item.image ? { uri: item.image } : require('../../../../assets/defaultImage.png')} style={{ height: 80, width: 80 }}/>
                            <View style={{ marginLeft: 10, justifyContent: 'space-around' }}>
                              <Text style={{ fontSize: 13, fontStyle: 'italic' }}>Req Changes</Text>
                              <Text style={{ fontSize: 13 }}>Checkin &nbsp; <Text style={{ fontWeight: 'bold' }}>{ item.start_time ? item.start_time : ' - ' }</Text></Text>
                              <Text style={{ fontSize: 13 }}>Checkout &nbsp; <Text style={{ fontWeight: 'bold' }}>{ item.end_time ? item.end_time : ' - ' }</Text></Text>
                              <Text style={{ fontSize: 13 }}>Reason &nbsp; <Text style={{ fontWeight: 'bold' }}>{ item.reason ? item.reason : ' - ' }</Text></Text>
                              <Text style={{ fontSize: 13 }}>Status &nbsp; <Text style={{ fontWeight: 'bold', color: item.status === 'acc' ? 'green' : item.status === 'dec' ? 'red' : 'blue' }}>{ item.status && item.status === 'req' ? 'Request' : item.status === 'acc' ? 'Accepted' : 'Decline' }</Text></Text>
                            </View>
                          </View>
                          <View style={{ width: '50%', marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                            <MapCorrections
                              start={{
                                longitude: item.AttId.start_location && item.AttId.start_location.longitude,
                                latitude: item.AttId.start_location && item.AttId.start_location.latitude
                              }}
                              end={{
                                longitude: item.AttId.end_location && item.AttId.end_location.longitude,
                                latitude: item.AttId.end_location && item.AttId.end_location.latitude
                              }}
                              />
                          </View>
                        </View>
                      </View>
                    )}
                    keyExtractor={( item, index ) => index.toString()}
                  />
                </View>
              : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 500 }}>
                  <Image source={ require('../../../../assets/badRequest.png') } style={{ height: 150, width: 150 }} />
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}> No Correction </Text>
                </View>}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}