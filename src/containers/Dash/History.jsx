import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { OfflieHeaderComponent, ListHistoryFilterComponent, ErrorFilterComponent } from '../../components';
import { getAccess, checkConnection } from '../../service';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../graph';
import Font from 'react-native-vector-icons/FontAwesome5'
import { SwipeListView } from 'react-native-swipe-list-view';


export const History = ({ navigation: { navigate: push } }) => {
  const [ history, { data: UserHistory, loading } ] = useLazyQuery( Query.GET_HISTORY, { fetchPolicy: 'network-only' } );
  const [ message, setMessage ] = useState( false );
  const [ refreshing, setRefresh ] = useState( false );
  const [ isOnline, setIsOnline ] = useState( true );

  useEffect(() => {
    (async () => {
      await checkConnection({ save: setIsOnline });
      fetching();
    })()
  }, [])

  const fetching = async _ => {
    try {
      const { code, token } = await getAccess();
      await history({ variables: { code, token } });
    }catch({ graphQLErrors }) { setMessage( graphQLErrors[0].message ); _onClear( setMessage ); }
  }

  const _onClear = meth => setTimeout(() => meth( false ), 2500)

  const onRefresh = React.useCallback(async () => {
    setRefresh(true);
    fetching();
    setRefresh( false );
  }, [ refreshing ]);
  
  const _onNavigationChange = async item =>  {
    const { code, token } = await getAccess()
    push('Detail', { id: item._id, access: { code, token }, date: item.date })
  }

  console.log( UserHistory )
  return (
    <View style={{ flex: 1, backgroundColor: '#353941' }}>
      { !isOnline && <OfflieHeaderComponent /> }
      { loading && !message
          ? <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator color='white' size={ 'large' } style={{ position: 'absolute', right: 'auto', top: 'auto' }}/>
            </View>
          : null }
      { message && !loading
          ? <ErrorFilterComponent text={ message } size={ 30 }/>
          : null }
      { UserHistory && UserHistory.getHistory.length > 0 && !loading && !message
          ? 
            <ScrollView refreshControl={ Platform.OS === 'ios' ? <View><RefreshControl refreshing={ refreshing } onRefresh={ onRefresh }/></View> : <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /> }>

              <View style={{ marginTop: 10, marginHorizontal: 5 }}>
                
                      {
                        UserHistory.getHistory.map(el => (
                          <View key={ el._id } style={{ position: 'relative', width: '100%' }}>
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
                                date: el.date,
                                image: {
                                  start: el.start_image,
                                  end: el.end_image
                                },
                                username: el.UserId.username,
                                role: el.UserId.role,
                                name: 'history',
                                startTime: el.start,
                                startIssues: el.start_issues,
                                endTime: el.end,
                                endIssues: el.end_issues,
                                reason: {
                                  end: el.end_reason
                                },
                                empty: UserHistory.getHistory.length > 0 ? false : true,
                              }}
                            />
                            <TouchableOpacity onPress={() => _onNavigationChange( el )} style={{ height: 35, width: 35, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, top: 2, backgroundColor: 'white', borderRadius: 20 }}>
                              <Font name='info' size={ 20 } />
                            </TouchableOpacity>
                            <View style={{ position: 'absolute', top: 15, right: 50 }}>
                              <Text style={{ fontSize: 10, color: 'white', fontWeight: 'bold' }}>Last Update: { el.updatedAt ? new Date( el.updatedAt ).toLocaleString('en-US',{timeZone: 'Asia/Jakarta'}).replace(', ','-') : ' - ' }</Text>
                            </View>
                          </View>
                        ))
                      }

                </View>
            </ScrollView>
          : !loading && !message && UserHistory && UserHistory.getHistory.length === 0
              ? <View style={{ flex: 1, marginTop: Platform.OS === 'android' ? 200 : 150, alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={ require('../../../assets/box-empty.png') } style={{ width: 150, height: 150 }} />
                  <Text style={{ fontSize: Platform.OS === 'android' ? 15 : 20, color: 'white', fontWeight: 'bold', marginTop: Platform.OS === 'android' ? 35 : 50, letterSpacing: 2 }}>No History Saved</Text>
                </View> 
              : null }
    </View>
  )
}