import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { OfflieHeaderComponent, ListHistoryFilterComponent, ErrorFilterComponent } from '../../components';
import { getAccess, checkConnection } from '../../service';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../graph';
import Font from 'react-native-vector-icons/FontAwesome5'
import { SwipeListView } from 'react-native-swipe-list-view';


export const History = ({ navigation }) => {
  const [ history, { data: UserHistory } ] = useLazyQuery( Query.GET_HISTORY );
  const [ message, setMessage ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ isOnline, setIsOnline ] = useState( true );
  const [ access, setAccess ] = useState( {} );

  useEffect(() => {
    (async () => {
      setLoading( true );
      await checkConnection({ save: setIsOnline });
      const { code, token } = await getAccess();
      setAccess({ code, token })
      try {
        await history({ variables: { code, token } });
        setLoading( false );
      }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ) }
    })()
  }, [])
  
  const _onNavigationChange = item =>  navigation.navigate('Detail', { id: item._id, access, date: item.date })

  return (
    <View style={{ flex: 1, backgroundColor: '#353941' }}>
      { !isOnline && <OfflieHeaderComponent /> }
        <ScrollView>

          <View style={{ marginTop: 10, marginHorizontal: 5 }}>
            {
              UserHistory && UserHistory.getHistory.length > 0
                ? 
                  <SwipeListView
                    data={ UserHistory.getHistory }
                    disableRightSwipe={true}
                    closeOnRowOpen={true}
                    stopLeftSwipe={35}
                    closeOnRowBeginSwipe={true}
                    closeOnScroll={true}
                    closeOnRowPress={true}
                    keyExtractor={( item, index ) => index.toString()}
                    renderItem={ ({item}) => (
                      <ListHistoryFilterComponent
                        load={ loading }
                        bc= { '#c9485b' }
                        justy={ 'space-between' }
                        size={{
                          role: Platform.OS === 'android' ? 10 : 13,
                          time: Platform.OS === 'android' ? 18 : 24,
                          name: Platform.OS === 'android' ? 10 : 16,
                          date: Platform.OS === 'android' ? 15 : 20
                        }}
                        typeParent={{
                          date: item.date,
                          image: {
                            start: item.start_image,
                            end: item.end_image
                          },
                          username: item.UserId.username,
                          role: item.UserId.role,
                          name: 'history',
                          startTime: item.start,
                          startIssues: item.start_issues,
                          endTime: item.end,
                          endIssues: item.end_issues,
                          reason: {
                            end: item.end_reason
                          },
                          empty: UserHistory.getHistory.length > 0 ? false : true,
                        }}
                      />
                    )}
                    renderHiddenItem={({ item }) => (
                      <TouchableOpacity
                        style={{ width: 50, right: 15, top: 25, position: 'absolute', flexDirection: 'row-reverse', marginTop: 20, marginLeft: 20, height: 50, alignItems: 'center' }}
                        onPress={() => _onNavigationChange( item )}
                        >
                          <Font name={ 'pen-alt' } size={ 30 } color={ 'white' } />
                      </TouchableOpacity>
                    )}
                    leftOpenValue={75}
                    rightOpenValue={-75}
                    />
                : 
                loading
                  ? <ActivityIndicator color={ 'blue' } size={ 'large' } style={{ position: 'absolute', right: 'auto', top: 'auto' }}/>
                  : message
                    ? <ErrorFilterComponent text={ message } size={ 30 }/>
                    : <View style={{ flex: 1, marginTop: Platform.OS === 'android' ? 200 : 150, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={ require('../../../assets/box-empty.png') } style={{ width: 150, height: 150 }} />
                        <Text style={{ fontSize: Platform.OS === 'android' ? 15 : 20, color: 'white', fontWeight: 'bold', marginTop: Platform.OS === 'android' ? 35 : 50, letterSpacing: 2 }}>No History Saved</Text>
                        </View>
            }
          </View>
      </ScrollView>
    </View>
  )
}