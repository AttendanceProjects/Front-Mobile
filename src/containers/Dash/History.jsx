import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { OfflieHeaderComponent, ListHistoryFilterComponent, ErrorFilterComponent } from '../../components';
import { getAccess, checkConnection } from '../../service';
import { useLazyQuery } from '@apollo/react-hooks';
import { Query } from '../../graph';
import Font from 'react-native-vector-icons/FontAwesome5'
import { ContainerStyle } from './ContainerStyle';

const {
  his_content,
  his_loading,
  his_body,
  his_items,
  his_button_icon,
  his_update_content,
  his_content_text,
  his_empty,
  his_image_empty,
  his_text_empty
} = ContainerStyle;

export const History = ({ navigation: { navigate: push } }) => {
  const [ history, { data: UserHistory, loading } ] = useLazyQuery( Query.GET_HISTORY, { fetchPolicy: 'network-only' } );
  const [ message, setMessage ] = useState( false );
  const [ refreshing, setRefresh ] = useState( false );
  const [ isOnline, setIsOnline ] = useState( false );

  useEffect(() => {
    (async () => {
      const { network } = await checkConnection();
      setIsOnline( network );
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

  return (
    <View style={ his_content }>
      { !isOnline && <OfflieHeaderComponent /> }
      { loading && !message
          ? <View style={ his_loading }>
              <ActivityIndicator color='white' size={ 'large' }/>
            </View>
          : null }
      { message && !loading
          ? <ErrorFilterComponent text={ message } size={ 30 }/>
          : null }
      { UserHistory && UserHistory.getHistory.length > 0 && !loading && !message
          ? 
            <ScrollView refreshControl={ Platform.OS === 'ios' ? <View><RefreshControl refreshing={ refreshing } onRefresh={ onRefresh }/></View> : <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /> }>

              <View style={ his_body }>
                      {
                        UserHistory.getHistory.map(el => (
                          <View key={ el._id } style={ his_items }>
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
                            <TouchableOpacity onPress={() => _onNavigationChange( el )} style={ his_button_icon }>
                              <Font name='info' size={ 20 } />
                            </TouchableOpacity>
                            <View style={ his_update_content }>
                              <Text style={ his_content_text }>Last Update: { el.updatedAt ? new Date( el.updatedAt ).toLocaleString('en-US',{timeZone: 'Asia/Jakarta'}).replace(', ','-') : ' - ' }</Text>
                            </View>
                          </View>
                        ))
                      }

                </View>
            </ScrollView>
          : !loading && !message && UserHistory && UserHistory.getHistory.length === 0
              ? <View style={ his_empty }>
                  <Image source={ require('../../../assets/box-empty.png') } style={ his_image_empty } />
                  <Text style={ his_text_empty }>No History Saved</Text>
                </View> 
              : null }
    </View>
  )
}